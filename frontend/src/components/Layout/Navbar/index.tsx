import React, { useEffect, useState } from 'react';
import { Navbar as BsNavbar, NavItem, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { routeNames } from 'routes';
import { connectWallet, getCurrentWalletConnected } from 'utils/connection';
import { deployedChainId } from 'utils/constants';
import './index.scss';


const Navbar = () => {

  const [walletAddress, setWallet] = useState<string>("");
  const [status, setStatus] = useState<boolean>(false);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus(true);
        } else {
          setWallet("");
          setStatus(false);
        }
      });
    } else {
      setStatus(false);
    }
  }

  useEffect(() => {
    (async () => {
      const { address, status } = await getCurrentWalletConnected();
      console.log("address, status", address, status);
      setWallet(address);
      setStatus(status);
      addWalletListener();
    })();
  }, []);

  return (
    <BsNavbar className='px-4 py-3' expand='md' collapseOnSelect style={{ background: "#141414", borderBottom: "1px solid #707070" }}>
      <div className='container-fluid'>
        <Link
          className='d-flex align-items-center navbar-brand mr-0 c-logo-container'
          to={routeNames.home}
        >
          <span>{"Test Project"}</span>
        </Link>

        <BsNavbar.Toggle aria-controls='responsive-navbar-nav' style={{ background: "#D8D3D3" }} />
        <BsNavbar.Collapse id='responsive-navbar-nav' className='nav-menu-wrap'>
          <Nav className='ml-auto'>
            <NavItem
              className='custom-navbar-button auth-button'
              onClick={() => connectWallet(deployedChainId)}
            >
              {walletAddress.length > 0 ? (
                String(walletAddress).substring(0, 6) +
                "..." +
                String(walletAddress).substring(38)
              ) : (
                <span>Connect Wallet</span>
              )}
            </NavItem>
          </Nav>
        </BsNavbar.Collapse>
      </div>
    </BsNavbar>
  );
};

export default Navbar;
