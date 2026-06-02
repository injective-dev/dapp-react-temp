import { createConfig, http } from "wagmi";
import { defineChain } from "viem";
import { injected, metaMask, walletConnect } from "wagmi/connectors";

/**
 * Injective EVM Testnet chain definition
 * Chain ID: 1440002 (0x15F902)
 * RPC: https://testnet.svm.injective.network/
 */
export const injectiveTestnet = defineChain({
  id: 1440002,
  name: "Injective Testnet",
  nativeCurrency: {
    name: "Injective",
    symbol: "INJ",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        import.meta.env.VITE_RPC_URL || "https://testnet.svm.injective.network/",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Injective Testnet Explorer",
      url:
        import.meta.env.VITE_EXPLORER_URL ||
        "https://testnet.explorer.injective.network/",
    },
  },
  testnet: true,
});

/**
 * Injective EVM Mainnet — uncomment when ready for production
 */
// export const injectiveMainnet = defineChain({
//   id: 1738,
//   name: "Injective",
//   nativeCurrency: { name: "Injective", symbol: "INJ", decimals: 18 },
//   rpcUrls: {
//     default: { http: ["https://svm.injective.network/"] },
//   },
//   blockExplorers: {
//     default: { name: "Injective Explorer", url: "https://explorer.injective.network/" },
//   },
// });

export const wagmiConfig = createConfig({
  chains: [injectiveTestnet],
  connectors: [
    injected(), // MetaMask & other injected wallets
    metaMask(),
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
    }),
  ],
  transports: {
    [injectiveTestnet.id]: http(),
  },
});
