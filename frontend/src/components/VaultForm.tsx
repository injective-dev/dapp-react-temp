import { useState } from "react";
import { useUSDCVault } from "@/hooks/useUSDCVault";
import { useWallet } from "@/hooks/useWallet";

export function VaultForm() {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  const { isConnected, isOnCorrectNetwork } = useWallet();
  const {
    usdcBalanceFormatted,
    userDepositFormatted,
    vaultBalanceFormatted,
    deposit,
    withdraw,
    withdrawAll,
    isLoading,
    error,
    txHash,
  } = useUSDCVault();

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    try {
      const hash = await deposit(depositAmount);
      setSuccess(hash);
      setDepositAmount("");
    } catch {
      // error set in hook
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    try {
      const hash = await withdraw(withdrawAmount);
      setSuccess(hash);
      setWithdrawAmount("");
    } catch {
      // error set in hook
    }
  };

  const handleWithdrawAll = async () => {
    setSuccess(null);
    try {
      const hash = await withdrawAll();
      setSuccess(hash);
    } catch {
      // error set in hook
    }
  };

  if (!isConnected) {
    return (
      <div className="card flex items-center justify-center min-h-[120px]">
        <p className="text-inj-snow/60 font-marist text-body-md">
          Connect your wallet to use the vault
        </p>
      </div>
    );
  }

  if (!isOnCorrectNetwork) {
    return (
      <div className="rounded-inj-md p-inj-lg border border-inj-sand/60 bg-inj-sand/10 text-inj-cinnamon text-center font-marist">
        Switch to Injective Testnet to continue
      </div>
    );
  }

  return (
    <div className="space-y-inj-lg">
      {/* Vault Stats Card */}
      <div className="card">
        <h2 className="font-marist text-xl font-bold text-inj-snow mb-inj-md">
          USDC Vault
        </h2>
        <div className="grid grid-cols-3 gap-inj-md">
          <div className="bg-inj-midnight/60 rounded-inj-md p-inj-md border border-inj-snow/10">
            <p className="font-whyte text-label-sm text-inj-snow/50 mb-1">Your Wallet</p>
            <p className="font-marist text-lg font-semibold text-inj-snow">
              {parseFloat(usdcBalanceFormatted).toFixed(2)}
            </p>
            <p className="font-whyte text-label-xs text-inj-snow/30">USDC</p>
          </div>
          <div className="bg-inj-midnight/60 rounded-inj-md p-inj-md border border-inj-lime/20">
            <p className="font-whyte text-label-sm text-inj-snow/50 mb-1">Your Deposit</p>
            <p className="font-marist text-lg font-semibold text-inj-lime">
              {parseFloat(userDepositFormatted).toFixed(2)}
            </p>
            <p className="font-whyte text-label-xs text-inj-snow/30">USDC</p>
          </div>
          <div className="bg-inj-midnight/60 rounded-inj-md p-inj-md border border-inj-ocean/20">
            <p className="font-whyte text-label-sm text-inj-snow/50 mb-1">Total in Vault</p>
            <p className="font-marist text-lg font-semibold text-inj-ocean">
              {parseFloat(vaultBalanceFormatted).toFixed(2)}
            </p>
            <p className="font-whyte text-label-xs text-inj-snow/30">USDC</p>
          </div>
        </div>

        {/* Circle Faucet Link */}
        <a
          href="https://faucet.circle.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full mt-inj-md
                     border border-inj-snow/20 rounded-inj-md py-2.5
                     font-whyte text-label-sm text-inj-snow/70
                     hover:border-inj-snow/50 hover:text-inj-snow transition-colors"
        >
          <span className="text-inj-lime">💧</span>
          Get Testnet USDC — Circle Faucet
          <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Deposit Form */}
      <div className="card">
        <h3 className="font-marist text-lg font-bold text-inj-snow mb-inj-md">
          Deposit USDC
        </h3>
        <form onSubmit={handleDeposit} className="space-y-inj-md">
          <div>
            <label className="block font-whyte text-label-sm text-inj-snow/60 mb-2">
              Amount (USDC)
            </label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Enter amount to deposit"
              min="0.01"
              step="0.01"
              required
              className="w-full bg-inj-midnight/60 border border-inj-snow/15
                         rounded-inj-md px-inj-md py-inj-sm
                         text-inj-snow font-marist placeholder-inj-snow/30
                         focus:outline-none focus:border-inj-ocean transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !depositAmount}
            className="btn-primary w-full"
          >
            {isLoading ? "Processing…" : `Deposit ${depositAmount || "0"} USDC`}
          </button>
        </form>
      </div>

      {/* Withdraw Form */}
      <div className="card">
        <h3 className="font-marist text-lg font-bold text-inj-snow mb-inj-md">
          Withdraw USDC
        </h3>
        <form onSubmit={handleWithdraw} className="space-y-inj-md">
          <div>
            <label className="block font-whyte text-label-sm text-inj-snow/60 mb-2">
              Amount (USDC)
            </label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount to withdraw"
              min="0.01"
              step="0.01"
              max={userDepositFormatted}
              required
              className="w-full bg-inj-midnight/60 border border-inj-snow/15
                         rounded-inj-md px-inj-md py-inj-sm
                         text-inj-snow font-marist placeholder-inj-snow/30
                         focus:outline-none focus:border-inj-ocean transition-colors"
            />
            <p className="font-whyte text-label-xs text-inj-snow/40 mt-1">
              Available: {parseFloat(userDepositFormatted).toFixed(2)} USDC
            </p>
          </div>
          <div className="flex gap-inj-sm">
            <button
              type="submit"
              disabled={isLoading || !withdrawAmount}
              className="btn-primary flex-1"
            >
              {isLoading ? "Processing…" : `Withdraw ${withdrawAmount || "0"} USDC`}
            </button>
            <button
              type="button"
              onClick={handleWithdrawAll}
              disabled={isLoading || parseFloat(userDepositFormatted) === 0}
              className="btn-secondary px-inj-lg"
            >
              Withdraw All
            </button>
          </div>
        </form>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="rounded-inj-md px-inj-md py-inj-sm bg-inj-coral/10 border border-inj-coral/30
                        font-whyte text-label-sm text-inj-coral">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-inj-md px-inj-md py-inj-sm bg-inj-lime/10 border border-inj-lime/30
                        font-whyte text-label-sm text-inj-lime">
          Transaction successful!{" "}
          <a
            href={`https://testnet.blockscout.injective.network/tx/${success}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80"
          >
            View on Explorer →
          </a>
        </div>
      )}

      {txHash && (
        <p className="font-whyte text-label-sm text-inj-snow/30 break-all">
          Tx: {txHash}
        </p>
      )}
    </div>
  );
}
