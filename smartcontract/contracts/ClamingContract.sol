// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/** @title Claiming Tokens
 * @notice It is a contract for claiming tokens
 */
contract ClamingContract is ERC20, ReentrancyGuard, Ownable {

    // Struct for stakers
    struct Staker {
        bool isRegistered;
        uint updatedAt;
        uint stakedAmount;
        uint claimedAmount;
    }

    uint constant TOKEN_BALANCE_UNIT = 1000 ether;

    // Mapping are cheaper than arrays
    mapping(address => Staker) private _stakers;

    event ClaimedTokens(address user, uint amount, uint updatedAt);

    /**
     * @notice Constructor
     * @param _stakersAddresses: address of the stakers
     */
    constructor(
        string memory name, 
        string memory symbol,
        address[] memory _stakersAddresses
    ) ERC20(name, symbol) {
        uint totalTokenAmount;
        for(uint i = 0; i < _stakersAddresses.length; i ++) {
            _stakers[_stakersAddresses[i]] = Staker({
                isRegistered: true,
                updatedAt: block.timestamp,
                stakedAmount: TOKEN_BALANCE_UNIT * (i + 1),
                claimedAmount: 0
            });
            
            totalTokenAmount += TOKEN_BALANCE_UNIT * (i + 1);
        }

        _mint(address(this), totalTokenAmount);
    }

    /**
     * @notice Claim tokens from pool
     * @dev Callable by users
     * @param _amount: amount to claim
     */
    function claimTokens(
        uint _amount
    ) external nonReentrant {
        require(
            _stakers[msg.sender].isRegistered,
            "Invalid address"
        );
        require(
            _amount > 0,
            "Amount must bigger than zero"
        );
        require(
            _amount <= _stakers[msg.sender].stakedAmount,
            "Insuffient amount"
        );

        uint currentTime = block.timestamp;

        _stakers[msg.sender].stakedAmount -= _amount;
        _stakers[msg.sender].claimedAmount += _amount;
        _stakers[msg.sender].updatedAt += currentTime;

        _transfer(address(this), msg.sender, _amount);

        emit ClaimedTokens(
            msg.sender,
            _amount,
            currentTime
        );
    }
    
    ////////////////////////////////////////////////////////
    /// View Functions
    ////////////////////////////////////////////////////////
    /**
     * @notice View staker by address
     * @param _userAddress: address of the staker
    */
    function viewStakerByAddress(address _userAddress) external view returns (Staker memory)
    {
        return (
            _stakers[_userAddress]
        );
    }
}
