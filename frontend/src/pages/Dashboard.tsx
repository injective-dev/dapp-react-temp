import { Link } from "react-router-dom";
import { ConnectWallet } from "@/components/ConnectWallet";
import { NetworkBadge } from "@/components/NetworkBadge";
import { PaymentForm } from "@/components/PaymentForm";
import { TransactionHistory } from "@/components/TransactionHistory";
import { useWallet } from "@/hooks/useWallet";

export function Dashboard() {
  const { isConnected, address, balance } = useWallet();

  return (
    <div className="min-h-screen bg-injective-dark text-white">
      {/* Header */}
      <header className="border-b border-injective-border">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-white hover:text-injective-blue transition-colors">
            <span className="text-xl">⚡</span>
            Injective dApp
          </Link>
          <div className="flex items-center gap-3">
            <NetworkBadge />
            <ConnectWallet />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">Connect your wallet to access the dashboard</p>
            <ConnectWallet />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-injective-card border border-injective-border rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-1">Wallet</div>
                <div className="font-mono text-injective-blue text-sm">
                  {address?.slice(0, 8)}...{address?.slice(-6)}
                </div>
              </div>
              <div className="bg-injective-card border border-injective-border rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-1">INJ Balance</div>
                <div className="text-white font-semibold">
                  {balance ? parseFloat(balance.formatted).toFixed(4) : "0"} INJ
                </div>
              </div>
              <div className="bg-injective-card border border-injective-border rounded-xl p-4 col-span-2 md:col-span-1">
                <div className="text-xs text-gray-400 mb-1">Network</div>
                <div className="text-green-400 font-medium text-sm">Injective Testnet</div>
              </div>
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <PaymentForm />
              </div>
              <div className="space-y-6">
                <TransactionHistory />

                {/* MCP hint */}
                <div className="bg-indigo-900/20 border border-indigo-800/40 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🤖</span>
                    <h3 className="font-semibold text-indigo-300">MCP Integration</h3>
                  </div>
                  <p className="text-sm text-indigo-300/70 mb-3">
                    Use the Injective MCP server to let AI assistants query and transact
                    on this dApp's contracts.
                  </p>
                  <a
                    href="https://github.com/InjectiveLabs/mcp-server"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline"
                  >
                    Set up MCP →
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
