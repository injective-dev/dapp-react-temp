import { expect } from "chai";
import { ethers } from "hardhat";
import { USDCPaymentProcessor } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

/**
 * Tests use a local mock ERC20 for unit testing (since we can't hit testnet in CI).
 * When testing against Injective testnet, the contract uses the real Circle USDC.
 */
describe("USDCPaymentProcessor", function () {
  let paymentProcessor: USDCPaymentProcessor;
  let mockToken: any; // local ERC20 for unit tests
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  const MINIMUM_PAYMENT = ethers.parseUnits("1", 6); // 1 USDC

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy a minimal ERC20 for local unit testing
    const ERC20Factory = await ethers.getContractFactory("MockERC20ForTest");
    mockToken = await ERC20Factory.deploy();

    // Deploy PaymentProcessor pointing to our local mock token
    // Note: on testnet, constructor uses hardcoded USDC_TESTNET address
    // For local tests, we override via a test-only constructor param
    const PaymentProcessorFactory = await ethers.getContractFactory("USDCPaymentProcessorTest");
    paymentProcessor = await PaymentProcessorFactory.deploy(
      await mockToken.getAddress(),
      MINIMUM_PAYMENT
    ) as unknown as USDCPaymentProcessor;

    // Fund user1
    await mockToken.mint(user1.address, ethers.parseUnits("1000", 6));
    await mockToken.connect(user1).approve(await paymentProcessor.getAddress(), ethers.MaxUint256);
  });

  describe("Payments", function () {
    it("should accept USDC payments", async function () {
      const amount = ethers.parseUnits("10", 6);
      await expect(paymentProcessor.connect(user1).pay(amount, "test payment"))
        .to.emit(paymentProcessor, "PaymentReceived");

      expect(await paymentProcessor.totalCollected()).to.equal(amount);
    });

    it("should reject payments below minimum", async function () {
      const tooLow = ethers.parseUnits("0.5", 6);
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
      expect(history[1].memo).to.equal("second");
    });

    it("should allow owner to withdraw", async function () {
      const amount = ethers.parseUnits("50", 6);
      await paymentProcessor.connect(user1).pay(amount, "payment");

      const before = await mockToken.balanceOf(owner.address);
      await paymentProcessor.connect(owner).withdraw();
      const after = await mockToken.balanceOf(owner.address);

      expect(after - before).to.equal(amount);
    });

    it("should reject withdrawal from non-owner", async function () {
      await expect(
        paymentProcessor.connect(user1).withdraw()
      ).to.be.revertedWithCustomError(paymentProcessor, "OwnableUnauthorizedAccount");
    });
  });
});
