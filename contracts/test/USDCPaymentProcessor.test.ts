import { expect } from "chai";
import { ethers } from "hardhat";
import { MockUSDC, USDCPaymentProcessor } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("USDCPaymentProcessor", function () {
  let mockUSDC: MockUSDC;
  let paymentProcessor: USDCPaymentProcessor;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  const MINIMUM_PAYMENT = ethers.parseUnits("1", 6); // 1 USDC

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const MockUSDCFactory = await ethers.getContractFactory("MockUSDC");
    mockUSDC = await MockUSDCFactory.deploy();

    const PaymentProcessorFactory = await ethers.getContractFactory("USDCPaymentProcessor");
    paymentProcessor = await PaymentProcessorFactory.deploy(
      await mockUSDC.getAddress(),
      MINIMUM_PAYMENT
    );

    // Fund user1 with USDC via faucet
    await mockUSDC.connect(user1).faucet();
    // Approve payment processor
    await mockUSDC.connect(user1).approve(await paymentProcessor.getAddress(), ethers.MaxUint256);
  });

  describe("MockUSDC", function () {
    it("should have correct name and symbol", async function () {
      expect(await mockUSDC.name()).to.equal("USD Coin (Mock)");
      expect(await mockUSDC.symbol()).to.equal("USDC");
      expect(await mockUSDC.decimals()).to.equal(6);
    });

    it("should allow faucet minting of 1000 USDC", async function () {
      const balance = await mockUSDC.balanceOf(user2.address);
      await mockUSDC.connect(user2).faucet();
      const newBalance = await mockUSDC.balanceOf(user2.address);
      expect(newBalance - balance).to.equal(ethers.parseUnits("1000", 6));
    });
  });

  describe("USDCPaymentProcessor", function () {
    it("should accept USDC payments", async function () {
      const amount = ethers.parseUnits("10", 6); // 10 USDC
      await expect(paymentProcessor.connect(user1).pay(amount, "test payment"))
        .to.emit(paymentProcessor, "PaymentReceived")
        .withArgs(user1.address, amount, "test payment", await ethers.provider.getBlock("latest").then(b => b!.timestamp + 1));

      expect(await paymentProcessor.totalCollected()).to.equal(amount);
    });

    it("should reject payments below minimum", async function () {
      const tooLow = ethers.parseUnits("0.5", 6); // 0.5 USDC
      await expect(
        paymentProcessor.connect(user1).pay(tooLow, "too small")
      ).to.be.revertedWithCustomError(paymentProcessor, "PaymentBelowMinimum");
    });

    it("should track payment history per user", async function () {
      const amount1 = ethers.parseUnits("5", 6);
      const amount2 = ethers.parseUnits("10", 6);

      await paymentProcessor.connect(user1).pay(amount1, "first");
      await paymentProcessor.connect(user1).pay(amount2, "second");

      const history = await paymentProcessor.getPaymentHistory(user1.address);
      expect(history.length).to.equal(2);
      expect(history[0].amount).to.equal(amount1);
      expect(history[1].amount).to.equal(amount2);
      expect(history[0].memo).to.equal("first");
    });

    it("should allow owner to withdraw", async function () {
      const amount = ethers.parseUnits("50", 6);
      await paymentProcessor.connect(user1).pay(amount, "payment");

      const ownerBalanceBefore = await mockUSDC.balanceOf(owner.address);
      await paymentProcessor.connect(owner).withdraw();
      const ownerBalanceAfter = await mockUSDC.balanceOf(owner.address);

      expect(ownerBalanceAfter - ownerBalanceBefore).to.equal(amount);
    });

    it("should reject withdrawal from non-owner", async function () {
      await expect(
        paymentProcessor.connect(user1).withdraw()
      ).to.be.revertedWithCustomError(paymentProcessor, "OwnableUnauthorizedAccount");
    });
  });
});
