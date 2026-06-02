# ⚡ Injective dApp React Template

React starter for building dApps on Injective EVM. Clone and start building.

**Stack:** Vite + React 18 + TypeScript + Tailwind CSS + wagmi v2 + Hardhat

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/injective-dev/dapp-react-temp my-dapp && cd my-dapp

# 2. Deploy contracts to Injective testnet
cd contracts && npm install && npm run deploy:testnet
# → Copy the printed addresses into .env

# 3. Configure environment
cp .env.example .env  # fill in VITE_PAYMENT_PROCESSOR_ADDRESS

# 4. Run frontend
cd ../frontend && npm install && npm run dev
```

> **Need testnet tokens?**
> - INJ (gas): [testnet.faucet.injective.network](https://testnet.faucet.injective.network/)
> - USDC: [faucet.circle.com](https://faucet.circle.com/)

---

## Project Structure

```
├── frontend/          # React app
│   └── src/
│       ├── config/    # Chain config (wagmi) + contract ABIs
│       ├── hooks/     # useWallet, useUSDCPayment
│       ├── components/
│       └── pages/     # Home, Dashboard
├── contracts/         # Solidity + Hardhat
│   ├── contracts/USDCPaymentProcessor.sol
│   └── scripts/deploy.ts
└── mcp/               # Injective MCP integration
```

---

## Contracts

**Network:** Injective EVM Testnet · Chain ID `1440002`

**USDC:** `0x0C382e685bbeeFE5d3d9C29e29E341fEE8E84C5d` (official Circle deployment)

### USDCPaymentProcessor

Accepts USDC, tracks payment history, owner can withdraw.

```solidity
pay(uint256 amount, string memo)       // user pays USDC
getPaymentHistory(address user)        // view history
withdraw()                             // owner withdraws (onlyOwner)
setMinimumPayment(uint256 amount)      // update minimum (onlyOwner)
```

```bash
cd contracts
npm run compile       # compile
npm run test          # run tests
npm run deploy:testnet
```

---

## MCP Integration

Connect AI assistants (Claude, Cursor, VS Code) to Injective via the [Injective MCP Server](https://github.com/InjectiveLabs/mcp-server).

```bash
npm run mcp:setup   # clones + builds the MCP server
```

Then add to your AI client config:

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

- **Claude Desktop:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Cursor:** `.cursor/mcp.json`
- **VS Code:** `.vscode/mcp.json`

See [`mcp/README.md`](./mcp/README.md) for full setup guide.

---

## Go to Mainnet

1. Update `.env`: set `VITE_CHAIN_ID=1738`, `VITE_RPC_URL=https://svm.injective.network/`, `VITE_USDC_ADDRESS=0xa00C59fF5a080D2b954d0c75e46E22a0c371235a`
2. Run `npm run deploy:mainnet`

---

## Links

- [Injective Docs](https://docs.injective.network/)
- [Testnet Explorer](https://testnet.blockscout.injective.network/)
- [USDC on Injective](https://docs.injective.network/developers-defi/usdc-stablecoin)
- [Injective MCP Server](https://github.com/InjectiveLabs/mcp-server)

---

MIT © [Chuhan Jin](https://github.com/ChuhanJin)
