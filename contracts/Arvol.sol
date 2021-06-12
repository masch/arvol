// SPDX-License-Identifier: MIT
pragma solidity 0.7.3;

/**
 * This code contains elements of ERC20BurnableUpgradeable.sol https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/master/contracts/token/ERC20/ERC20BurnableUpgradeable.sol
 * Those have been inlined for the purpose of gas optimization.
 */

import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

/**
 * @title Universal Basic Income
 * @dev Arvol is an ERC20 compatible token.
 *
 * TBD
 */
contract Arvol is Initializable {

  /* Events */

  /**
   * @dev Emitted when `value` tokens are moved from one account (`from`) to another (`to`).
   *
   * Note that `value` may be zero.
   * Also note that due to continuous minting we cannot emit transfer events from the address 0 when tokens are created.
   * In order to keep consistency, we decided not to emit those events from the address 0 even when minting is done within a transaction.
   */
  event Transfer(address indexed from, address indexed to, uint256 value);

  /**
   * @dev Emitted when the allowance of a `spender` for an `owner` is set by
   * a call to {approve}. `value` is the new allowance.
   */
  event Approval(address indexed owner, address indexed spender, uint256 value);

  using SafeMath for uint256;

  /* Storage */

  mapping (address => uint256) private _balances;

  // mapping (address => mapping (address => uint256)) public allowance;

  /// @dev A lower bound of the total supply. Does not take into account tokens minted as Arvol by an address before it moves those (transfer or burn).
  uint256 public _totalSupply;

  /// @dev Name of the token.
  string public _name;

  /// @dev Symbol of the token.
  string public _symbol;

  /// @dev Number of decimals of the token.
  uint8 public _decimals;

  /* Initializer */

  /** @dev Constructor.
  *  @param initialSupply_ for the Arvol coin including all decimals.
  *  @param name_ for Arvol coin.
  *  @param symbol_ for Arvol coin ticker.
  */
  function initialize(uint256 initialSupply_, string memory name_, string memory symbol_) public initializer {
    _name = name_;
    _symbol = symbol_;
    _decimals = 18;

    _balances[msg.sender] = initialSupply_;
    _totalSupply = initialSupply_;
  }

  /**
    * @dev TBD.
    */
  function balanceOf(address account) public view returns (uint256) {
      return _balances[account];
  }

}
