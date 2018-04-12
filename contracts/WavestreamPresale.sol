pragma solidity ^0.4.17;

import "./ERC20.sol";
import "./CappedCrowdsale.sol";

/**
 * @title TestCrowdsale
 */
contract WavestreamPresale is CappedCrowdsale {
  function WavestreamPresale(uint256 _rate, address _wallet, uint256 _cap, ERC20 _token) public
    Crowdsale(_rate, _wallet, _token)
    CappedCrowdsale(_cap)
  {}
}
