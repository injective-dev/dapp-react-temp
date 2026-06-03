<div align="center">
  <img src="./logo.jpg" alt="Logo" width="120" />

  <h1>Injective dApp React Template</h1>

  <p>A minimal React starter for building dApps on Injective EVM.</p>

  <p>
    <strong>Stack:</strong> Vite · React 18 · TypeScript · Tailwind CSS · wagmi v2 · Hardhat
  </p>

  <p>
    <a href="https://docs.injective.network/developers-evm/network-information">Docs</a> ·
    <a href="https://testnet.blockscout.injective.network/">Testnet Explorer</a> ·
    <a href="https://testnet.faucet.injective.network/">Faucet</a>
  </p>
</div>

---

> **GitHub Template** — Click **"Use this template"** → **"Create a new repository"** to get started. Do not clone this repo directly.

---

## Quick Start

```bash
# 1. Clone your new repo
git clone https://github.com/<your-username>/<your-repo> my-dapp && cd my-dapp

# 2. Deploy contracts to testnet
cd contracts && npm install && npm run deploy:testnet
# Copy the printed contract address into .env

# 3. Configure environment
cp .env.example .env  # set VITE_PAYMENT_PROCESSOR_ADDRESS

# 4. Start frontend
cd ../frontend && npm install && npm run dev
```

> Need testnet tokens? Get **INJ** at [testnet.faucet.injective.network](https://testnet.faucet.injective.network/) and **USDC** at [faucet.circle.com](https://faucet.circle.com/).

---

## Project Structure

```
├── frontend/               # React app
│   └── src/
│       ├── config/         # wagmi chain config + ABIs
│       ├── hooks/          # useWallet, useUSDCPayment
│       ├── components/
│       └── pages/          # Home, Dashboard
├── contracts/              # Solidity + Hardhat
│   ├── contracts/USDCPaymentProcessor.sol
│   └── scripts/deploy.ts
└── mcp/                    # Injective MCP integration
```

---

## Network Reference

| | Testnet | Mainnet |
|---|---|---|
| Chain ID | `1439` | `1776` |
| RPC | `https://k8s.testnet.json-rpc.injective.network/` | `https://sentry.evm-rpc.injective.network/` |
| Explorer | [testnet.blockscout](https://testnet.blockscout.injective.network/) | [blockscout](https://blockscout.injective.network/) |
| USDC | `0x0C382e...84C5d` | `0xa00C59...235a` |

---

## Contracts

**USDCPaymentProcessor** — accepts USDC, tracks history, owner can withdraw.

```solidity
pay(uint256 amount, string memo)      // pay with USDC (approve first)
getPaymentHistory(address user)       // view payment history
withdraw()                            // owner withdraws
setMinimumPayment(uint256 amount)     // update minimum (owner only)
```

```bash
cd contracts && npm run compile && npm run test && npm run deploy:testnet
```

---

## MCP Integration

Connect AI tools (Claude, Cursor, VS Code) to Injective via the [Injective MCP Server](https://github.com/InjectiveLabs/mcp-server).

```bash
npm run mcp:setup
```

Add to your AI client config:

```json
{
  "mcpServers": {
    "injective": {
      "command": "node",
      "args": ["/path/to/mcp/injective-mcp-server/dist/mcp/server.js"],
      "env": { "INJECTIVE_NETWORK": "testnet" }
    }
  }
}
```

See [`mcp/README.md`](./mcp/README.md) for details.

---

## Deploy to Mainnet

Update `.env`:

```env
VITE_CHAIN_ID=1776
VITE_RPC_URL=https://sentry.evm-rpc.injective.network/
VITE_USDC_ADDRESS=0xa00C59fF5a080D2b954d0c75e46E22a0c371235a
```

Then run `npm run deploy:mainnet`.

---

MIT © [Chuhan Jin](https://github.com/ChuhanJin)
