pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";


/**
 * @title WavestreamPresale
 * @dev Capped crowdsale with two wallets.
 */
contract WavestreamPresale is CappedCrowdsale, Ownable {
  using SafeMath for uint256;

  bool public isClosed = false;

  event Closed();

  // The raised funds are being forwarded to two wallets. First, until total
  // amout of wei raised is less than or equal to `priorityCap`, raised funds
  // are forwarded to `priorityWallet`. After that, raised funds are
  // forwarded to `wallet`.
  uint256 public priorityCap;

  // Address where first priorityCap raised wei are forwarded.
  address public priorityWallet;

  /**
   * @dev Constructor
   * @param _rate Number of token units a buyer gets per wei
   * @param _priorityWallet Address where first priorityCap raised wei are forwarded
   * @param _priorityCap Max amount of wei to be forwarded to _priorityWallet
   * @param _wallet Address where collected funds will be forwarded after hitting _priorityCap
   * @param _cap Max amount of wei to be contributed
   * @param _token Address of the token being sold
   */
  function WavestreamPresale(
    uint256 _rate,
    address _priorityWallet,
    uint256 _priorityCap,
    address _wallet,
    uint256 _cap,
    ERC20 _token
  ) public
    Crowdsale(_rate, _wallet, _token)
    CappedCrowdsale(_cap)
    Ownable()
  {
    require(_priorityCap > 0);
    require(_priorityCap < _cap);
    require(_priorityWallet != address(0));
    require(_priorityWallet != _wallet);

    priorityWallet = _priorityWallet;
    priorityCap = _priorityCap;
  }

  /**
   * @dev Closes crowdsale. Can be only called by contract owner.
   */
  function closeCrowdsale() onlyOwner public {
    require(!isClosed);

    isClosed = true;

    uint256 tokenBalance = token.balanceOf(address(this));
    if (tokenBalance > 0) {
      token.transfer(owner, tokenBalance);
    }

    Closed();
  }

  /**
   * @dev Determines how ETH is stored/forwarded on purchases.
   * Part of OpenZeppelin internal interface.
   */
  function _forwardFunds() internal {
    if (weiRaised <= priorityCap) {
      priorityWallet.transfer(msg.value);
    } else {
      uint256 weiRaisedBefore = weiRaised.sub(msg.value);

      if (weiRaisedBefore < priorityCap) {
        uint256 transferToPriorityWallet = priorityCap.sub(weiRaisedBefore);
        uint256 transferToWallet = weiRaised.sub(priorityCap);
        priorityWallet.transfer(transferToPriorityWallet);
        wallet.transfer(transferToWallet);
      } else {
        wallet.transfer(msg.value);
      }
    }
  }

  /**
   * @dev Validation of an incoming purchase.
   * Part of OpenZeppelin internal interface.
   *
   * @param _beneficiary Token purchaser
   * @param _weiAmount Amount of wei contributed
   */
  function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal {
    require(!isClosed);
    super._preValidatePurchase(_beneficiary, _weiAmount);
  }
}
