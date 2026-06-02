import { useState } from "react";
import { useUSDCPayment } from "@/hooks/useUSDCPayment";
import { useWallet } from "@/hooks/useWallet";

export function PaymentForm() {
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  const { isConnected, isOnCorrectNetwork } = useWallet();
  const {
    usdcBalanceFormatted,
    minimumPaymentFormatted,
    pay,
    isLoading,
    error,
    txHash,
  } = useUSDCPayment();

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    try {
      const hash = await pay(amount, memo);
      setSuccess(hash);
      setAmount("");
      setMemo("");
    } catch {
      // error is set in the hook
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-injective-card border border-injective-border rounded-xl p-6 text-center text-gray-400">
        Connect your wallet to make payments
      </div>
    );
  }

  if (!isOnCorrectNetwork) {
    return (
      <div className="bg-injective-card border border-yellow-800/50 rounded-xl p-6 text-center text-yellow-400">
        Please switch to Injective Testnet to continue
      </div>
    );
  }

  return (
    <div className="bg-injective-card border border-injective-border rounded-xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Pay with USDC</h2>
        <div className="text-sm text-gray-400">
          Balance:{" "}
          <span className="text-white font-medium">
            {parseFloat(usdcBalanceFormatted).toFixed(2)} USDC
          </span>
        </div>
      </div>

      {/* Circle Faucet link */}
      <a
        href="https://faucet.circle.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-blue-900/30 hover:bg-blue-800/40 text-blue-300 border border-blue-800/50 font-medium py-2.5 rounded-lg transition-colors text-sm"
      >
        💧 Get Testnet USDC — Circle Faucet
        <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>

      <div className="border-t border-injective-border" />

      <form onSubmit={handlePay} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Amount (USDC)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Min ${minimumPaymentFormatted} USDC`}
            min={minimumPaymentFormatted}
            step="0.01"
            required
            className="w-full bg-injective-dark border border-injective-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-injective-blue transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Memo{" "}
            <span className="text-gray-500 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Payment reference or note"
            maxLength={200}
            className="w-full bg-injective-dark border border-injective-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-injective-blue transition-colors"
          />
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-800/50 rounded-lg px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/30 border border-green-800/50 rounded-lg px-4 py-3 text-green-400 text-sm">
            ✅ Payment sent!{" "}
            <a
              href={`https://testnet.blockscout.injective.network/tx/${success}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-green-300"
            >
              View on Explorer
            </a>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !amount}
          className="w-full bg-injective-blue hover:bg-blue-400 text-black font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : `Pay ${amount || "0"} USDC`}
        </button>
      </form>

      {txHash && (
        <p className="text-xs text-gray-500 break-all">Tx: {txHash}</p>
      )}
    </div>
  );
}
