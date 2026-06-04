import { Link } from "react-router-dom";
import { ConnectWallet } from "@/components/ConnectWallet";
import { useWallet } from "@/hooks/useWallet";

const features = [
  {
    tag: "Vault",
    title: "USDC Vault",
    desc: "Deposit and withdraw USDC on Injective EVM testnet. Contract already deployed — no setup needed.",
  },
  {
    tag: "AI",
    title: "MCP Integration",
    desc: "Connect AI assistants to Injective via the MCP server for natural language on-chain operations.",
  },
  {
    tag: "Frontend",
    title: "React + wagmi v2",
    desc: "Vite, React 18, TypeScript, Tailwind CSS. Pre-configured for Injective EVM testnet.",
  },
  {
    tag: "Contracts",
    title: "Hardhat Ready",
    desc: "Solidity contracts with deploy scripts and tests. Vault already deployed on testnet.",
  },
];

export function Home() {
  const { isConnected } = useWallet();

  return (
    <div className="min-h-screen bg-inj-snow">
      {/* Nav */}
      <nav className="border-b border-inj-midnight/10">
        <div className="max-w-5xl mx-auto px-inj-lg h-16 flex items-center justify-between">
          <span className="font-marist font-bold text-inj-midnight text-lg tracking-tight">
            Injective dApp
          </span>
          <ConnectWallet />
        </div>
      </nav>

      {/* Hero — Midnight background */}
      <section className="bg-inj-midnight">
        <div className="max-w-5xl mx-auto px-inj-lg py-24 md:py-32">
          {/* Builder tag */}
          <span className="tag-builder mb-inj-lg inline-flex">
            ⚡ Testnet Ready
          </span>

          <h1 className="font-marist text-display font-bold text-inj-snow leading-[1.1] mb-inj-lg max-w-2xl">
            Build on Injective.<br />
            Ship faster.
          </h1>

          <p className="font-marist text-body-md text-inj-snow/60 max-w-xl mb-inj-xl">
            A production-ready React starter with USDC payment contracts and
            Injective MCP integration. Clone, configure, deploy.
          </p>

          <div className="flex flex-wrap gap-inj-sm items-center">
            {!isConnected ? (
              <ConnectWallet />
            ) : (
              <Link to="/dashboard" className="btn-primary">
                Open Dashboard →
              </Link>
            )}
            <a
              href="https://github.com/injective-dev/dapp-react-temp"
              target="_blank"
              rel="noopener noreferrer"
              className="px-inj-md py-inj-sm rounded-inj-md font-marist text-body-md font-medium
                         border border-inj-snow/20 text-inj-snow/70
                         hover:border-inj-snow/60 hover:text-inj-snow transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Features — Snow background, Midnight cards */}
      <section className="max-w-5xl mx-auto px-inj-lg py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-inj-md">
          {features.map((f) => (
            <div key={f.title} className="card group hover:ring-1 hover:ring-inj-ocean/40 transition-all">
              <span className="tag-builder mb-inj-md inline-flex">
                {f.tag}
              </span>
              <h3 className="font-marist text-lg font-bold text-inj-snow mb-2">
                {f.title}
              </h3>
              <p className="font-marist text-body-md text-inj-snow/60 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Start — Midnight code block */}
      <section className="max-w-5xl mx-auto px-inj-lg pb-24">
        <h2 className="font-marist text-2xl font-bold text-inj-midnight mb-inj-lg">
          Quick Start
        </h2>
        <div className="bg-inj-midnight rounded-inj-md p-inj-xl overflow-x-auto">
          <pre className="font-mono text-sm text-inj-snow/80 space-y-1">
            <div><span className="text-inj-snow/40"># 1. Clone the repo</span></div>
            <div className="text-inj-snow">git clone https://github.com/&lt;you&gt;/&lt;your-repo&gt; &amp;&amp; <span className="text-inj-ocean">cd</span> &lt;your-repo&gt;/frontend</div>
            <div className="mt-3"><span className="text-inj-snow/40"># 2. Install and run — no contract deployment needed!</span></div>
            <div>npm install &amp;&amp; npm run dev</div>
            <div className="mt-3"><span className="text-inj-snow/40"># Vault contract is already deployed on Injective EVM Testnet ✅</span></div>
          </pre>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-inj-midnight/10">
        <div className="max-w-5xl mx-auto px-inj-lg h-14 flex items-center justify-between">
          <span className="font-whyte text-label-sm text-inj-midnight/40">
            MIT © Chuhan Jin
          </span>
          <div className="flex items-center gap-inj-lg">
            <a
              href="https://docs.injective.network/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-whyte text-label-sm text-inj-midnight/40 hover:text-inj-midnight transition-colors"
            >
              Docs
            </a>
            <a
              href="https://testnet.blockscout.injective.network/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-whyte text-label-sm text-inj-midnight/40 hover:text-inj-midnight transition-colors"
            >
              Explorer
            </a>
            <a
              href="https://github.com/InjectiveLabs/mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="font-whyte text-label-sm text-inj-midnight/40 hover:text-inj-midnight transition-colors"
            >
              MCP
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
