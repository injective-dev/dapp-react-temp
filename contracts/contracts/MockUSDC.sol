// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @dev A mock USDC token for Injective testnet development.
 *      Anyone can mint tokens for testing purposes.
 *      Uses 6 decimals to match real USDC.
 */
contract MockUSDC is ERC20, Ownable {
    uint8 private constant DECIMALS = 6;
    uint256 public constant FAUCET_AMOUNT = 1000 * 10 ** 6; // 1000 USDC per faucet call

    event FaucetMint(address indexed recipient, uint256 amount);

    constructor() ERC20("USD Coin (Mock)", "USDC") Ownable(msg.sender) {
        // Mint 1,000,000 USDC to deployer for initial liquidity
        _mint(msg.sender, 1_000_000 * 10 ** DECIMALS);
    }

    /**
     * @dev Returns 6 decimals to match real USDC
     */
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }

    /**
     * @dev Public faucet: anyone can mint 1000 USDC for testnet testing
     */
    function faucet() external {
        _mint(msg.sender, FAUCET_AMOUNT);
        emit FaucetMint(msg.sender, FAUCET_AMOUNT);
    }

    /**
     * @dev Owner can mint arbitrary amounts (for seeding liquidity, etc.)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
