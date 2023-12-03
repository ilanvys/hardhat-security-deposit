// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

error SecurityDeposit__NotOwner();
error SecurityDeposit__CurrentlyLocked();
error SecurityDeposit__WithdrawFailed();

contract SecurityDeposit {
    uint public unlockTime;
    address payable public owner;

    modifier onlyOwner {
        // require(msg.sender == owner);
        if (msg.sender != owner) revert SecurityDeposit__NotOwner();
        _;
    }

    modifier onTime {
        // require(msg.sender == owner);
        if (block.timestamp < unlockTime) revert SecurityDeposit__CurrentlyLocked();
        _;
    }

    constructor(uint _unlockTime) payable {
        owner = payable(msg.sender);
        unlockTime = _unlockTime;
    }

    function withdraw() public onlyOwner onTime {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }('');
        // require(success, 'Call failed');
         if (!success) revert SecurityDeposit__WithdrawFailed();
    }

    // Optional -> add an option to deposit more money
}