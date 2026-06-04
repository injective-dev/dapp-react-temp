import { Link } from "react-router-dom";
import { ConnectWallet } from "@/components/ConnectWallet";
import { NetworkBadge } from "@/components/NetworkBadge";
import { VaultForm } from "@/components/VaultForm";
import { useWallet } from "@/hooks/useWallet";
import { IS_CONTRACT_CONFIGURED } from "@/config/contracts";

export function Dashboard() {
  const { isConnected, address, balance } = useWallet();

  return (
    <div className="min-h-screen bg-inj-snow">
      {/* Header */}
      <header className="bg-inj-midnight border-b border-inj-snow/10">
        <div className="max-w-5xl mx-auto px-inj-lg h-16 flex items-center justify-between">
          <Link
            to="/"
            className="font-marist font-bold text-inj-snow text-lg tracking-tight
                       hover:text-inj-snow/80 transition-colors"
          >
            Injective dApp
          </Link>
          <div className="flex items-center gap-inj-sm">
            <NetworkBadge />
            <ConnectWallet />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-inj-lg py-inj-xl">
        {/* Setup banner — shown when contract is not yet deployed */}
        {!IS_CONTRACT_CONFIGURED && (
          <div className="mb-inj-lg rounded-inj-md border border-amber-400/40 bg-amber-50 px-inj-lg py-inj-md">
            <p className="font-marist text-sm font-semibold text-amber-800 mb-1">
              ⚠️ Vault contract not configured
            </p>
            <p className="font-whyte text-label-sm text-amber-700">
              The USDC Vault is already deployed on Injective EVM Testnet.
              Set the contract address in your{" "}
              <code className="font-mono bg-amber-100 px-1 rounded">.env</code> file:
            </p>
            <pre className="mt-inj-sm font-mono text-xs text-amber-800 bg-amber-100 rounded p-inj-sm overflow-x-auto">
              # frontend/.env{"\n"}
              VITE_VAULT_ADDRESS=&lt;deployed_vault_address&gt;
            </pre>
          </div>
        )}
        {!isConnected ? (
          /* Not connected state */
          <div className="flex flex-col items-center justify-center py-32 gap-inj-lg">
            <p className="font-marist text-body-md text-inj-midnight/50">
              Connect your wallet to access the USDC Vault
            </p>
            <ConnectWallet />
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-inj-sm mb-inj-xl">
              <div className="card-outline">
                <p className="font-whyte text-label-sm text-inj-midnight/50 mb-1">Wallet</p>
                <p className="font-marist text-sm font-semibold text-inj-ocean font-mono">
                  {address?.slice(0, 8)}…{address?.slice(-6)}
                </p>
              </div>

              <div className="card-outline">
                <p className="font-whyte text-label-sm text-inj-midnight/50 mb-1">INJ Balance</p>
                <p className="font-marist text-sm font-semibold text-inj-midnight">
                  {balance ? parseFloat(balance.formatted).toFixed(4) : "0"} INJ
                </p>
              </div>

              <div className="card-outline col-span-2 md:col-span-1">
                <p className="font-whyte text-label-sm text-inj-midnight/50 mb-1">Network</p>
                <span className="tag-builder">Injective Testnet</span>
              </div>
            </div>

            {/* Main content */}
            <div className="max-w-2xl mx-auto">
              <VaultForm />

              {/* MCP card */}
              <div className="card border border-inj-ocean/20 mt-inj-xl">
                <div className="flex items-center gap-inj-sm mb-inj-sm">
                  <span className="tag-builder">AI</span>
                  <h3 className="font-marist text-base font-bold text-inj-snow">
                    MCP Integration
                  </h3>
                </div>
                <p className="font-marist text-body-md text-inj-snow/60 mb-inj-md">
                  Connect Claude, Cursor, or VS Code to Injective via the MCP
                  server for natural language on-chain operations.
                </p>
                <a
                  href="https://github.com/InjectiveLabs/mcp-server"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-whyte text-label-sm text-inj-ocean hover:underline"
                >
                  Set up MCP →
                </a>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
