// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title USDCPaymentProcessor
 * @dev Accepts USDC payments on Injective EVM testnet.
 *      Tracks payment history per address.
 *      Owner can withdraw accumulated USDC.
 *
 * Deployed on Injective EVM Testnet (Chain ID: 1440002)
 */
contract USDCPaymentProcessor is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdc;
    uint256 public minimumPayment; // in USDC (6 decimals)
    uint256 public totalCollected;

    struct Payment {
        address payer;
        uint256 amount;
        uint256 timestamp;
        string memo;
    }

    // Maps user address to their payment records
    mapping(address => Payment[]) private paymentHistory;
    // All payment records for global lookup
    Payment[] public allPayments;

    event PaymentReceived(
        address indexed payer,
        uint256 amount,
        string memo,
        uint256 timestamp
    );
    event Withdrawal(address indexed to, uint256 amount);
    event MinimumPaymentUpdated(uint256 oldAmount, uint256 newAmount);

    error PaymentBelowMinimum(uint256 sent, uint256 minimum);
    error NoFundsToWithdraw();

    constructor(address _usdc, uint256 _minimumPayment) Ownable(msg.sender) {
        usdc = IERC20(_usdc);
        minimumPayment = _minimumPayment;
    }

    /**
     * @dev User pays USDC to this contract.
     * @param amount Amount in USDC (6 decimals). E.g., 1000000 = 1 USDC
     * @param memo Optional payment note/reference
     */
    function pay(uint256 amount, string calldata memo) external nonReentrant {
        if (amount < minimumPayment) {
            revert PaymentBelowMinimum(amount, minimumPayment);
        }

        usdc.safeTransferFrom(msg.sender, address(this), amount);

        Payment memory payment = Payment({
            payer: msg.sender,
            amount: amount,
            timestamp: block.timestamp,
            memo: memo
        });

        paymentHistory[msg.sender].push(payment);
        allPayments.push(payment);
        totalCollected += amount;

        emit PaymentReceived(msg.sender, amount, memo, block.timestamp);
    }

    /**
     * @dev Owner withdraws all collected USDC
     */
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = usdc.balanceOf(address(this));
        if (balance == 0) revert NoFundsToWithdraw();

        usdc.safeTransfer(owner(), balance);
        emit Withdrawal(owner(), balance);
    }

    /**
     * @dev Owner withdraws specific amount
     */
    function withdrawAmount(uint256 amount) external onlyOwner nonReentrant {
        usdc.safeTransfer(owner(), amount);
        emit Withdrawal(owner(), amount);
    }

    /**
     * @dev Update minimum payment amount
     */
    function setMinimumPayment(uint256 newMinimum) external onlyOwner {
        uint256 old = minimumPayment;
        minimumPayment = newMinimum;
        emit MinimumPaymentUpdated(old, newMinimum);
    }

    /**
     * @dev Get payment history for a specific address
     */
    function getPaymentHistory(address user) external view returns (Payment[] memory) {
        return paymentHistory[user];
    }

    /**
     * @dev Get total number of payments ever processed
     */
    function getTotalPaymentCount() external view returns (uint256) {
        return allPayments.length;
    }

    /**
     * @dev Get current USDC balance held by this contract
     */
    function getBalance() external view returns (uint256) {
        return usdc.balanceOf(address(this));
    }
}
