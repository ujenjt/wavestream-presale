pragma solidity ^0.4.17;

import "./ERC20.sol";
import "./CappedCrowdsale.sol";

/**
 * @title TestCrowdsale
 */
contract TestCrowdsale is CappedCrowdsale {
  function TestCrowdsale(uint256 _rate, address _wallet, uint256 _cap, ERC20 _token) public
    Crowdsale(_rate, _wallet, _token)
    CappedCrowdsale(_cap)
  {}
}
