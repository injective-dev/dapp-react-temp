import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "INJ");

  // 1. Deploy MockUSDC
  console.log("\n📦 Deploying MockUSDC...");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.waitForDeployment();
  const usdcAddress = await mockUSDC.getAddress();
  console.log("✅ MockUSDC deployed to:", usdcAddress);

  // 2. Deploy USDCPaymentProcessor
  // Minimum payment: 1 USDC (1,000,000 in 6-decimal units)
  const minimumPayment = ethers.parseUnits("1", 6);
  console.log("\n📦 Deploying USDCPaymentProcessor...");
  const PaymentProcessor = await ethers.getContractFactory("USDCPaymentProcessor");
  const paymentProcessor = await PaymentProcessor.deploy(usdcAddress, minimumPayment);
  await paymentProcessor.waitForDeployment();
  const processorAddress = await paymentProcessor.getAddress();
  console.log("✅ USDCPaymentProcessor deployed to:", processorAddress);

  // 3. Print summary
  console.log("\n🎉 Deployment Complete!");
  console.log("=".repeat(50));
  console.log("MockUSDC:              ", usdcAddress);
  console.log("USDCPaymentProcessor:  ", processorAddress);
  console.log("=".repeat(50));
  console.log("\n📋 Add these to your frontend/.env:");
  console.log(`VITE_MOCK_USDC_ADDRESS=${usdcAddress}`);
  console.log(`VITE_PAYMENT_PROCESSOR_ADDRESS=${processorAddress}`);
  console.log("\n🔗 View on Injective Testnet Explorer:");
  console.log(`https://testnet.explorer.injective.network/address/${usdcAddress}`);
  console.log(`https://testnet.explorer.injective.network/address/${processorAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
