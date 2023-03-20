// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@opengsn/contracts/src/ERC2771Recipient.sol";

contract TokenTest is ERC20, ERC2771Recipient {
    address public owner;
    address public trustedForwarder;
    string public message;

    constructor(address _trustedForwarder) ERC20("TokenTest", "TT") {
        owner = _msgSender();
        _mint(_msgSender(), 100000000 * 10 ** uint256(18));
        trustedForwarder = _trustedForwarder;
    }

    // function to set a message
    function setMessage(string memory _message) public {
        message = _message;
    }

    function _msgSender() internal view override(Context, ERC2771Recipient) returns (address sender) {
        sender = ERC2771Recipient._msgSender();
    }

    function _msgData() internal view override(Context, ERC2771Recipient) returns (bytes calldata) {
        return ERC2771Recipient._msgData();
    }
}