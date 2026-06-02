// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title USDCPaymentProcessor
 * @dev Accepts USDC payments on Injective EVM.
 *      Uses the official Circle USDC deployment on Injective.
 *      Tracks payment history per address.
 *      Owner can withdraw accumulated USDC.
 *
 * Injective EVM Testnet (Chain ID: 1439)
 *   USDC: 0x0C382e685bbeeFE5d3d9C29e29E341fEE8E84C5d
 *   RPC:  https://k8s.testnet.json-rpc.injective.network/
 *
 * Injective EVM Mainnet (Chain ID: 1776)
 *   USDC: 0xa00C59fF5a080D2b954d0c75e46E22a0c371235a
 *   RPC:  https://sentry.evm-rpc.injective.network/
 *
 * Get testnet USDC: https://faucet.circle.com/
 * Docs: https://docs.injective.network/developers-defi/usdc-stablecoin
 */
contract USDCPaymentProcessor is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /// @notice Official Circle USDC on Injective EVM Testnet
    address public constant USDC_TESTNET = 0x0C382e685bbeeFE5d3d9C29e29E341fEE8E84C5d;

    IERC20 public immutable usdc;
    uint256 public minimumPayment;
    uint256 public totalCollected;

    struct Payment {
        address payer;
        uint256 amount;
        uint256 timestamp;
        string memo;
    }

    mapping(address => Payment[]) private paymentHistory;
    Payment[] public allPayments;

    event PaymentReceived(address indexed payer, uint256 amount, string memo, uint256 timestamp);
    event Withdrawal(address indexed to, uint256 amount);
    event MinimumPaymentUpdated(uint256 oldAmount, uint256 newAmount);

    error PaymentBelowMinimum(uint256 sent, uint256 minimum);
    error NoFundsToWithdraw();

    constructor(uint256 _minimumPayment) Ownable(msg.sender) {
        usdc = IERC20(USDC_TESTNET);
        minimumPayment = _minimumPayment;
    }

    /**
     * @dev Pay USDC. Caller must approve this contract first.
     * @param amount Amount in USDC units (6 decimals). 1 USDC = 1_000_000
     * @param memo Optional payment reference
     */
    function pay(uint256 amount, string calldata memo) external nonReentrant {
        if (amount < minimumPayment) revert PaymentBelowMinimum(amount, minimumPayment);

        usdc.safeTransferFrom(msg.sender, address(this), amount);

        Payment memory payment = Payment(msg.sender, amount, block.timestamp, memo);
        paymentHistory[msg.sender].push(payment);
        allPayments.push(payment);
        totalCollected += amount;

        emit PaymentReceived(msg.sender, amount, memo, block.timestamp);
    }

    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = usdc.balanceOf(address(this));
        if (balance == 0) revert NoFundsToWithdraw();
        usdc.safeTransfer(owner(), balance);
        emit Withdrawal(owner(), balance);
    }

    function withdrawAmount(uint256 amount) external onlyOwner nonReentrant {
        usdc.safeTransfer(owner(), amount);
        emit Withdrawal(owner(), amount);
    }

    function setMinimumPayment(uint256 newMinimum) external onlyOwner {
        emit MinimumPaymentUpdated(minimumPayment, newMinimum);
        minimumPayment = newMinimum;
    }

    function getPaymentHistory(address user) external view returns (Payment[] memory) {
        return paymentHistory[user];
    }

    function getTotalPaymentCount() external view returns (uint256) {
        return allPayments.length;
    }

    function getBalance() external view returns (uint256) {
        return usdc.balanceOf(address(this));
    }
}
