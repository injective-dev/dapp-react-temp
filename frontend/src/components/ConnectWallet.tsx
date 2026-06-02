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
        className="btn-primary bg-inj-coral text-inj-midnight"
      >
        Switch to Injective Testnet
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-inj-sm">
        {/* Balance chip */}
        <div className="flex flex-col px-inj-md py-inj-sm bg-inj-snow border border-inj-midnight/15 rounded-inj-md">
          <span className="font-whyte text-label-sm text-inj-midnight/50">Balance</span>
          <span className="font-marist text-sm font-semibold text-inj-midnight">
            {balance ? parseFloat(balance.formatted).toFixed(4) : "0"} INJ
          </span>
        </div>

        {/* Address chip */}
        <div className="flex flex-col px-inj-md py-inj-sm bg-inj-snow border border-inj-midnight/15 rounded-inj-md">
          <span className="font-whyte text-label-sm text-inj-midnight/50">Address</span>
          <span className="font-marist text-sm font-semibold text-inj-ocean font-mono">
            {address.slice(0, 6)}…{address.slice(-4)}
          </span>
        </div>

        {/* Disconnect */}
        <button
          onClick={() => disconnect()}
          className="px-inj-md py-inj-sm rounded-inj-md font-marist text-sm font-medium
                     border border-inj-midnight/20 text-inj-midnight/60
                     hover:border-inj-midnight/50 hover:text-inj-midnight transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-inj-sm">
      <button
        onClick={() => connectWallet(0)}
        disabled={isConnecting}
        className="btn-primary"
      >
        {isConnecting ? "Connecting…" : "Connect Wallet"}
      </button>
    </div>
  );
}
