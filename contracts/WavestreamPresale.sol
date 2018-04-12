pragma solidity ^0.4.17;

import "./SafeMath.sol";
import "./ERC20.sol";
import "./CappedCrowdsale.sol";
import "./Ownable.sol";

/**
 * @title WavestreamPresale
 * @dev Capped crowdsale with two wallets.
 */
contract WavestreamPresale is CappedCrowdsale, Ownable {
  using SafeMath for uint256;

  /**
   * @dev Modifier to make a function callable only when the contract is not closed.
   */
  modifier whenNotClosed() {
    require(!isClosed);
    _;
  }

  bool public isClosed = false;

  event Closed();

  // The reised funds are being transferred to two wallets. First, until total
  // amout of wei raised is less than or equal to `priorityCap`, raised funds
  // are transferred to `priorityWallet`. After that, raised funds are
  // transferred to `wallet`.
  uint256 public priorityCap;

  // Address where collected first raised _priorityCap ether
  address public priorityWallet;

  /**
   * @dev Constructor
   * @param _rate Number of token units a buyer gets per wei
   * @param _priorityWallet Address where collected first raised _priorityCap wei
   * @param _priorityCap Max amount of wei to be transferred to _priorityWallet
   * @param _wallet Address where collected funds will be forwarded to after hitting the _priorityCap
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

    priorityWallet = _priorityWallet;
    priorityCap = _priorityCap;
  }

  /**
   * @dev Close crowdsale, only for owner.
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
   * @dev Determines how ETH is stored/forwarded on purchases. Part of OpenZeppelin
   * internal interface.
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
   * @dev Validation of an incoming purchase. Use require statements to revert state when conditions are not met. Use super to concatenate validations.
   * Part of OpenZeppelin internal interface.
   * @param _beneficiary Token purchaser
   * @param _weiAmount Amount of wei contributed
   */
  function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal whenNotClosed {
    super._preValidatePurchase(_beneficiary, _weiAmount);
  }
}
