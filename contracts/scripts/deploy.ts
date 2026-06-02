import { ethers } from "hardhat";

// Official Circle USDC on Injective EVM Testnet
// Source: https://docs.injective.network/developers-defi/usdc-stablecoin#testnet
const USDC_TESTNET = "0x0C382e685bbeeFE5d3d9C29e29E341fEE8E84C5d";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "INJ");
  console.log("\n📌 Using official Circle USDC on Injective Testnet:", USDC_TESTNET);
  console.log("   Get testnet USDC at: https://faucet.circle.com/");

  // Deploy USDCPaymentProcessor with 1 USDC minimum payment
  const minimumPayment = ethers.parseUnits("1", 6); // 1 USDC
  console.log("\n📦 Deploying USDCPaymentProcessor...");
  const PaymentProcessor = await ethers.getContractFactory("USDCPaymentProcessor");
  const paymentProcessor = await PaymentProcessor.deploy(minimumPayment);
  await paymentProcessor.waitForDeployment();
  const processorAddress = await paymentProcessor.getAddress();
  console.log("✅ USDCPaymentProcessor deployed to:", processorAddress);

  // Print summary
  console.log("\n🎉 Deployment Complete!");
  console.log("=".repeat(50));
  console.log("USDC (Circle testnet):    ", USDC_TESTNET);
  console.log("USDCPaymentProcessor:     ", processorAddress);
  console.log("=".repeat(50));
  console.log("\n📋 Add these to your .env:");
  console.log(`VITE_MOCK_USDC_ADDRESS=${USDC_TESTNET}`);
  console.log(`VITE_PAYMENT_PROCESSOR_ADDRESS=${processorAddress}`);
  console.log("\n🔗 View on Injective Testnet Explorer:");
  console.log(`https://testnet.blockscout.injective.network/address/${processorAddress}`);
  console.log("\n💧 Get testnet USDC:");
  console.log("   https://faucet.circle.com/");
  console.log("💧 Get testnet INJ (for gas):");
  console.log("   https://testnet.faucet.injective.network/");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
