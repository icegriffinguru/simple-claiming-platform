
import React, { useEffect, useState } from 'react';

import { Store } from 'react-notifications-component';
import { Spin } from 'antd';

import Web3 from 'web3';
import { ethers } from 'ethers';

import { getCurrentWalletConnected } from 'utils/connection';
import { notificationConfig } from 'utils/constants';
import { IUserInfo } from 'utils';
import mainContractAbi from 'abi/maincontract-abi.json';

const StakingCard = () => {
  const [inputAmount, setInputAmount] = useState<any>(0);

  const [claimingInfoMesssage, setClaimingInfoMesssage] = React.useState<string>('');
  const [claimingButtonDisabled, setClaimingButtonDisabled] = React.useState<boolean>(true);

  const [userInfo, setUserInfo] = useState<IUserInfo | null>();
  const [walletAddress, setWallet] = useState<string>("");
  const [walletStatus, setWalletStatus] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const {
    REACT_APP_RPC_URL,
    REACT_APP_CONTRACT_ADDRESS,
  } = process.env;

  const options = {
    reconnect: {
      auto: true,
      delay: 5000, // ms
      maxAttempts: 5,
      onTimeout: false
    }
  };

  const mainContractAbis: any = mainContractAbi;

  const provider = new Web3(new Web3.providers.WebsocketProvider(REACT_APP_RPC_URL, options));
  const mainContract = new provider.eth.Contract(mainContractAbis, REACT_APP_CONTRACT_ADDRESS);

  const initialize = async (isInit: boolean) => {
    try {
      if (isInit)
        setLoading(true);

      setInputAmount(0);
      setClaimingInfoMesssage("");
      setClaimingButtonDisabled(true);

      const selectedAddress = window.ethereum.selectedAddress;
      const _userInfo = await mainContract.methods.viewStakerByAddress(selectedAddress).call();

      const userInfo = {
        isRegistered: _userInfo.isRegistered,
        updatedAt: _userInfo.updatedAt,
        stakedAmount: Number(ethers.utils.formatEther(_userInfo.stakedAmount.toString())) * 1,
        claimedAmount: Number(ethers.utils.formatEther(_userInfo.claimedAmount.toString())) * 1
      };

      console.log(">>>>>>>>>>>>>>>>", userInfo);

      setUserInfo(userInfo);
      setLoading(false);
    } catch (_) {
      setUserInfo(null);
      setLoading(false);
    }
  };

  const onInputAmountChange = (v: any) => {
    const value = Number(v);

    let _claimingInfoMesssage = '';
    let _claimingButtonDisabled = true;

    if (value <= 0) {
      _claimingInfoMesssage = 'Invalid amount.';
    } else if (value > userInfo.stakedAmount) {
      _claimingInfoMesssage = 'Not enough tokens in smart contract';
    } else {
      _claimingButtonDisabled = false;
    }

    setClaimingInfoMesssage(_claimingInfoMesssage);
    setClaimingButtonDisabled(_claimingButtonDisabled);
    setInputAmount(v);
  };

  const claim = async () => {
    try {
      if (!walletStatus) {
        Store.addNotification({
          ...notificationConfig,
          type: "warning",
          message: "Please check wallet connection"
        });

        return;
      }

      setIsProcessing(true);

      const transactionParameters = {
        to: REACT_APP_CONTRACT_ADDRESS,
        from: window.ethereum.selectedAddress,
        data: mainContract.methods
          .claimTokens(
            ethers.utils.parseUnits(inputAmount.toString(), "ether"),
          )
          .encodeABI(),
      };

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });
      console.log("tx: ", txHash);

      Store.addNotification({
        ...notificationConfig,
        type: "success",
        message: "Successed to claim tokens"
      });

      setIsProcessing(false);
    } catch (err) {
      console.log("Claiming tokens => err:", err);

      Store.addNotification({
        ...notificationConfig,
        type: "danger",
        message: "Failed to claim tokens"
      });
      setIsProcessing(false);
    }
  };

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: any) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setWalletStatus(true);
        } else {
          setWallet("");
          setWalletStatus(false);
        }
      });
    } else {
      setWallet("");
      setWalletStatus(false);
    }
  }

  function addSmartContractListener() {
    mainContract.events.ClaimedTokens({}, (error: any, data: any) => {
      if (!error) {
        (async () => {
          console.log("event occured");
          await initialize(false);
        })();
      }
    });
  }


  useEffect(() => {
    (async () => {
      const { address, status } = await getCurrentWalletConnected();
      setWallet(address);
      setWalletStatus(status);
      await initialize(true);
      addWalletListener();
      addSmartContractListener();
    })();

  }, [walletAddress]);

  return (
    <div style={{ margin: "auto" }}>
      <Spin spinning={isLoading || isProcessing}>
        <div className='card'>
          <div className='modaldiv'>
            <h3 className='modalHeader'>
              {'Claim Tokens'}
            </h3>
          </div>

          <div
            style={{
              marginTop: '12px'
            }}
            className='pinkpara font-24'
          >
            <span>Claimed Amount: </span>
            <span style={{ color: '#FEE277', fontWeight: 600, fontSize: '1rem' }}>
              {userInfo && userInfo?.claimedAmount}
            </span>
          </div>

          <div className='modal-divider'></div>

          <div
            style={{
              marginTop: '12px'
            }}
            className='pinkpara font-24'
          >
            <span>Available Tokens in Smart Contract: </span>
            <span style={{ color: '#FEE277', fontWeight: 600, fontSize: '1rem' }}>
              {userInfo && userInfo?.stakedAmount}
            </span>
          </div>
          <h6 className='modal-info-1'>
            {'Amount to claim'}
          </h6>
          <div className='modal-div-1 mb-2'>
            <input className='modal-input-1'
              placeholder={'Amount'}
              type='number'
              step={0.01}
              value={inputAmount}
              onChange={(e) => onInputAmountChange(e.target.value)}
            />
          </div>
          <div className='modal-divider' style={{ paddingTop: "20px" }}></div>
          {
            claimingInfoMesssage && (
              <div className='modal-info-message'>
                {claimingInfoMesssage}
              </div>
            )
          }

          <button
            className='modal-submit-button'
            onClick={claim}
            disabled={claimingButtonDisabled}
          >
            Claim
          </button>
        </div>
      </Spin>
    </div>
  );
};

export default StakingCard;