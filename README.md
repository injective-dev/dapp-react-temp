# ⚡ Injective dApp React Template

A production-ready React starter template for building dApps on [Injective](https://injective.network/). Clone this repo and start building in minutes.

**What's included:**
- 🎨 **React 18 + Vite + TypeScript + Tailwind CSS** frontend
- 💳 **USDC Payment contracts** (MockUSDC + USDCPaymentProcessor) on Injective EVM testnet
- 🤖 **Injective MCP integration** — let AI assistants query and transact on Injective
- 🔗 **wagmi v2 + viem** for wallet connection (MetaMask, WalletConnect)
- 🧪 **Hardhat** for contract compilation, testing, and deployment

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/injective-dev/dapp-react-temp my-dapp
cd my-dapp

# 2. Set up environment
cp .env.example .env
# Edit .env with your values

# 3. Deploy contracts to Injective testnet
cd contracts
npm install
npm run deploy:testnet
# → Copy the printed contract addresses into your .env

# 4. Start the frontend
cd ../frontend
npm install
npm run dev
# → Open http://localhost:5173
```

**Need testnet INJ?** Get it from the [Injective Testnet Faucet](https://testnet.faucet.injective.network/).

---

## Project Structure

```
dapp-react-temp/
├── frontend/                    # React app (Vite + TypeScript + Tailwind)
│   └── src/
│       ├── config/
│       │   ├── wagmi.ts         # Injective chain config + wallet connectors
│       │   └── contracts.ts     # Contract addresses + ABIs
│       ├── hooks/
│       │   ├── useWallet.ts     # Wallet connection state
│       │   └── useUSDCPayment.ts # USDC payment interactions
│       ├── components/
│       │   ├── ConnectWallet.tsx
│       │   ├── PaymentForm.tsx
│       │   ├── TransactionHistory.tsx
│       │   └── NetworkBadge.tsx
│       └── pages/
│           ├── Home.tsx         # Landing page
│           └── Dashboard.tsx    # Main dApp UI
├── contracts/                   # Solidity + Hardhat
│   ├── contracts/
│   │   ├── MockUSDC.sol         # ERC20 mock USDC (testnet)
│   │   └── USDCPaymentProcessor.sol
│   ├── scripts/deploy.ts        # Deployment script
│   └── test/                   # Contract tests
├── mcp/                         # Injective MCP integration
│   ├── README.md                # MCP setup guide
│   ├── setup.sh                 # Auto-setup script
│   ├── mcp-config.json          # Config template for AI clients
│   └── examples/                # Usage examples
├── .env.example                 # Environment variables template
└── package.json                 # Root workspace
```

---

## Smart Contracts

Deployed on **Injective EVM Testnet** (Chain ID: `1440002`).

### MockUSDC

A testnet ERC20 with 6 decimals (matching real USDC). Includes a public **faucet** — anyone can mint 1000 USDC for testing.

```solidity
// Get 1000 test USDC
mockUSDC.faucet();
```

### USDCPaymentProcessor

Accepts USDC payments, tracks history, and lets the owner withdraw.

```solidity
// Pay 10 USDC with a memo
paymentProcessor.pay(10_000_000, "subscription payment");

// View payment history
Payment[] memory history = paymentProcessor.getPaymentHistory(userAddress);
```

**Key functions:**

| Function | Access | Description |
|----------|--------|-------------|
| `pay(amount, memo)` | Public | Send USDC payment |
| `getPaymentHistory(user)` | Public | Get payment records |
| `withdraw()` | Owner | Withdraw all USDC |
| `setMinimumPayment(amount)` | Owner | Update minimum payment |

### Deploying Contracts

```bash
cd contracts

# Install dependencies
npm install

# Compile
npm run compile

# Run tests
npm run test

# Deploy to testnet
npm run deploy:testnet

# Deploy to mainnet (when ready)
npm run deploy:mainnet
```

After deployment, copy the printed addresses into your `.env` file.

---

## Frontend

### Injective Chain Config (`frontend/src/config/wagmi.ts`)

The template pre-configures the Injective EVM testnet chain:

```typescript
const injectiveTestnet = defineChain({
  id: 1440002,           // Chain ID
  name: "Injective Testnet",
  nativeCurrency: { name: "Injective", symbol: "INJ", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet.svm.injective.network/"] },
  },
  blockExplorers: {
    default: { url: "https://testnet.explorer.injective.network/" },
  },
  testnet: true,
});
```

To switch to mainnet, uncomment the `injectiveMainnet` chain definition and update your `.env`.

### Key Hooks

**`useWallet`** — wallet connection state:
```typescript
const { address, isConnected, balance, connectWallet, disconnect } = useWallet();
```

**`useUSDCPayment`** — USDC payment operations:
```typescript
const { usdcBalanceFormatted, pay, mintTestUSDC, paymentHistory } = useUSDCPayment();

// Pay 10 USDC
await pay("10", "subscription");

// Mint test USDC from faucet
await mintTestUSDC();
```

---

## 🤖 Injective MCP Integration

This template includes an integration module for the [Injective MCP Server](https://github.com/InjectiveLabs/mcp-server), which lets AI assistants (Claude, Cursor, VS Code Copilot) query and transact on Injective via natural language.

### What is MCP?

[MCP (Model Context Protocol)](https://modelcontextprotocol.io/introduction) is an open standard that enables AI tools to connect to external data sources and APIs. The Injective MCP server exposes Injective's blockchain capabilities as MCP tools.

### Setup

```bash
# Automated setup (clones and builds the MCP server)
npm run mcp:setup

# Or manually:
cd mcp && bash setup.sh
```

### Configure Your AI Client

#### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "injective": {
      "command": "node",
      "args": ["/absolute/path/to/mcp/injective-mcp-server/dist/mcp/server.js"],
      "env": {
        "INJECTIVE_NETWORK": "testnet"
      }
    }
  }
}
```

Restart Claude Desktop. ✅

#### Cursor IDE

Create `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "injective": {
      "command": "node",
      "args": ["/absolute/path/to/mcp/injective-mcp-server/dist/mcp/server.js"],
      "env": {
        "INJECTIVE_NETWORK": "testnet"
      }
    }
  }
}
```

#### VS Code (GitHub Copilot)

Create `.vscode/mcp.json`:

```json
{
  "servers": {
    "injective": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/mcp/injective-mcp-server/dist/mcp/server.js"],
      "env": {
        "INJECTIVE_NETWORK": "testnet"
      }
    }
  }
}
```

### Example AI Prompts

Once connected, ask your AI assistant:

```
"What's the INJ balance of 0x1234...abcd on Injective testnet?"
"Check the USDC balance of my wallet"
"Did transaction 0xabc... succeed?"
"What's the current gas price on Injective?"
"Query the MockUSDC total supply"
```

### Switch to Mainnet

Change the env value in your config:
```json
"env": { "INJECTIVE_NETWORK": "mainnet" }
```

Full MCP docs: [`mcp/README.md`](./mcp/README.md)

---

## Deployment to Mainnet

1. **Switch contract network** in `contracts/.env`:
   ```
   # Use mainnet RPC
   INJECTIVE_TESTNET_RPC=https://svm.injective.network/
   ```
   Then run `npm run deploy:mainnet`

2. **Switch frontend** — update `.env`:
   ```
   VITE_CHAIN_ID=1738
   VITE_RPC_URL=https://svm.injective.network/
   VITE_EXPLORER_URL=https://explorer.injective.network/
   ```

3. **Replace MockUSDC** with the real USDC address on Injective mainnet.

4. **Build**: `npm run build` → deploy `frontend/dist/` to your hosting (Vercel, Netlify, etc.)

---

## Resources

| Resource | Link |
|----------|------|
| Injective Developer Docs | https://docs.injective.network/ |
| Injective EVM Docs | https://docs.injective.network/developers/evm |
| Injective MCP Server | https://github.com/InjectiveLabs/mcp-server |
| Testnet Faucet | https://testnet.faucet.injective.network/ |
| Testnet Explorer | https://testnet.explorer.injective.network/ |
| Mainnet Explorer | https://explorer.injective.network/ |
| Injective Discord | https://discord.gg/injective |

---

## License

MIT © [Chuhan Jin](https://github.com/ChuhanJin)
