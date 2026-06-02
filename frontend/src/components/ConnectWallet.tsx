import { useWallet } from "@/hooks/useWallet";

export function ConnectWallet() {
  const {
    address,
    isConnected,
    isConnecting,
    balance,
    connectors,
    isOnCorrectNetwork,
    connectWallet,
    disconnect,
    switchToInjective,
  } = useWallet();

  if (isConnected && !isOnCorrectNetwork) {
    return (
      <button
        onClick={switchToInjective}
        className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        Switch to Injective Testnet
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="bg-injective-card border border-injective-border rounded-lg px-3 py-2 text-sm">
          <div className="text-gray-400 text-xs">Balance</div>
          <div className="text-white font-medium">
            {balance ? parseFloat(balance.formatted).toFixed(4) : "0"} INJ
          </div>
        </div>
        <div className="bg-injective-card border border-injective-border rounded-lg px-3 py-2 text-sm">
          <div className="text-gray-400 text-xs">Address</div>
          <div className="text-injective-blue font-mono font-medium">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        </div>
        <button
          onClick={() => disconnect()}
          className="bg-red-900/30 hover:bg-red-800/50 text-red-400 border border-red-800/50 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {connectors.slice(0, 2).map((connector, i) => (
        <button
          key={connector.id}
          onClick={() => connectWallet(i)}
          disabled={isConnecting}
          className="bg-injective-blue hover:bg-blue-400 text-black font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {isConnecting ? "Connecting..." : i === 0 ? "Connect Wallet" : connector.name}
        </button>
      ))}
    </div>
  );
}
