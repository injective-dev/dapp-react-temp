import { Link } from "react-router-dom";
import { ConnectWallet } from "@/components/ConnectWallet";
import { useWallet } from "@/hooks/useWallet";

const features = [
  {
    icon: "💳",
    title: "USDC Payments",
    desc: "Accept USDC payments on Injective EVM testnet with MockUSDC and USDCPaymentProcessor contracts.",
  },
  {
    icon: "🤖",
    title: "MCP Integration",
    desc: "Built-in Injective MCP server integration — let AI agents query and transact on Injective.",
  },
  {
    icon: "⚡",
    title: "Production Ready",
    desc: "Vite + React 18 + TypeScript + Tailwind + wagmi v2. Clone, configure, deploy.",
  },
  {
    icon: "🔧",
    title: "Hardhat Contracts",
    desc: "Solidity contracts with full test suite. One command to deploy to testnet or mainnet.",
  },
];

export function Home() {
  const { isConnected } = useWallet();

  return (
    <div className="min-h-screen bg-injective-dark text-white">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-injective-blue/10 border border-injective-blue/30 text-injective-blue text-sm px-4 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-injective-blue rounded-full animate-pulse" />
          Injective EVM Testnet Ready
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
          Injective{" "}
          <span className="text-injective-blue">dApp Template</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          A production-ready React starter with USDC payment contracts and Injective MCP
          integration. Clone, customize, ship.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <ConnectWallet />
          {isConnected && (
            <Link
              to="/dashboard"
              className="bg-injective-card border border-injective-border hover:border-injective-blue text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Go to Dashboard →
            </Link>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-injective-card border border-injective-border rounded-xl p-5 hover:border-injective-blue/50 transition-colors"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold mb-1">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Start Code */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-center mb-6">Quick Start</h2>
        <div className="bg-black rounded-xl border border-injective-border p-6 font-mono text-sm overflow-x-auto">
          <div className="space-y-1 text-gray-300">
            <div><span className="text-gray-500"># 1. Clone the template</span></div>
            <div><span className="text-injective-blue">git</span> clone https://github.com/injective-dev/dapp-react-temp my-dapp && cd my-dapp</div>
            <div className="mt-3"><span className="text-gray-500"># 2. Deploy contracts to Injective testnet</span></div>
            <div>cd contracts && npm install && <span className="text-injective-blue">npm run</span> deploy:testnet</div>
            <div className="mt-3"><span className="text-gray-500"># 3. Configure frontend with contract addresses</span></div>
            <div>cp .env.example .env && <span className="text-gray-500"># fill in addresses from step 2</span></div>
            <div className="mt-3"><span className="text-gray-500"># 4. Start the frontend</span></div>
            <div>cd frontend && npm install && <span className="text-injective-blue">npm run</span> dev</div>
          </div>
        </div>
      </section>
    </div>
  );
}
