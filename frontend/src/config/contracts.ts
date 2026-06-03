/**
 * Official Circle USDC on Injective EVM Testnet
 * Source: https://docs.injective.network/developers-defi/usdc-stablecoin#testnet
 * Get testnet USDC: https://faucet.circle.com/
 */
export const USDC_TESTNET_ADDRESS = "0x0C382e685bbeeFE5d3d9C29e29E341fEE8E84C5d" as const;

/**
 * USDCPaymentProcessor address — fill in after running: cd contracts && npm run deploy:testnet
 */
export const CONTRACT_ADDRESSES = {
  USDC: (import.meta.env.VITE_USDC_ADDRESS || USDC_TESTNET_ADDRESS) as `0x${string}`,
  PAYMENT_PROCESSOR: (import.meta.env.VITE_PAYMENT_PROCESSOR_ADDRESS ||
    "0x0000000000000000000000000000000000000000") as `0x${string}`,
};

/**
 * True only when VITE_PAYMENT_PROCESSOR_ADDRESS is set to a real deployed address.
 * Use this to guard UI flows before allowing transactions.
 */
export const IS_CONTRACT_CONFIGURED =
  !!import.meta.env.VITE_PAYMENT_PROCESSOR_ADDRESS &&
  import.meta.env.VITE_PAYMENT_PROCESSOR_ADDRESS !== "0x0000000000000000000000000000000000000000";

/**
 * Standard ERC20 ABI — functions needed for USDC interactions
 */
export const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
] as const;

/**
 * USDCPaymentProcessor ABI
 */
export const PAYMENT_PROCESSOR_ABI = [
  {
    name: "pay",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "memo", type: "string" },
    ],
    outputs: [],
  },
  {
    name: "getPaymentHistory",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "payer", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "timestamp", type: "uint256" },
          { name: "memo", type: "string" },
        ],
      },
    ],
  },
  {
    name: "getBalance",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "minimumPayment",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "totalCollected",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "USDC_TESTNET",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    name: "PaymentReceived",
    type: "event",
    inputs: [
      { name: "payer", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "memo", type: "string", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
] as const;
