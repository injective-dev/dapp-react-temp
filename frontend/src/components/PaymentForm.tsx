import { useState } from "react";
import { useUSDCPayment } from "@/hooks/useUSDCPayment";
import { useWallet } from "@/hooks/useWallet";

export function PaymentForm() {
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  const { isConnected, isOnCorrectNetwork } = useWallet();
  const { usdcBalanceFormatted, minimumPaymentFormatted, pay, isLoading, error, txHash } =
    useUSDCPayment();

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    try {
      const hash = await pay(amount, memo);
      setSuccess(hash);
      setAmount("");
      setMemo("");
    } catch {
      // error set in hook
    }
  };

  if (!isConnected) {
    return (
      <div className="card flex items-center justify-center min-h-[120px]">
        <p className="text-inj-snow/60 font-marist text-body-md">
          Connect your wallet to make payments
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
    <div className="card space-y-inj-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-marist text-xl font-bold text-inj-snow">
          Pay with USDC
        </h2>
        <div className="text-right">
          <p className="font-whyte text-label-sm text-inj-snow/50">Your balance</p>
          <p className="font-marist text-sm font-semibold text-inj-snow">
            {parseFloat(usdcBalanceFormatted).toFixed(2)} USDC
          </p>
        </div>
      </div>

      {/* Circle Faucet */}
      <a
        href="https://faucet.circle.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full
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

      <div className="border-t border-inj-snow/10" />

      {/* Form */}
      <form onSubmit={handlePay} className="space-y-inj-md">
        <div>
          <label className="block font-whyte text-label-sm text-inj-snow/60 mb-2">
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
            className="w-full bg-inj-midnight/60 border border-inj-snow/15
                       rounded-inj-md px-inj-md py-inj-sm
                       text-inj-snow font-marist placeholder-inj-snow/30
                       focus:outline-none focus:border-inj-ocean transition-colors"
          />
        </div>

        <div>
          <label className="block font-whyte text-label-sm text-inj-snow/60 mb-2">
            Memo
            <span className="ml-1 text-inj-snow/30">(optional)</span>
          </label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Payment reference or note"
            maxLength={200}
            className="w-full bg-inj-midnight/60 border border-inj-snow/15
                       rounded-inj-md px-inj-md py-inj-sm
                       text-inj-snow font-marist placeholder-inj-snow/30
                       focus:outline-none focus:border-inj-ocean transition-colors"
          />
        </div>

        {error && (
          <div className="rounded-inj-md px-inj-md py-inj-sm bg-inj-coral/10 border border-inj-coral/30
                          font-whyte text-label-sm text-inj-coral">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-inj-md px-inj-md py-inj-sm bg-inj-lime/10 border border-inj-lime/30
                          font-whyte text-label-sm text-inj-lime">
            Payment sent!{" "}
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

        <button
          type="submit"
          disabled={isLoading || !amount}
          className="btn-primary w-full"
        >
          {isLoading ? "Processing…" : `Pay ${amount || "0"} USDC`}
        </button>
      </form>

      {txHash && (
        <p className="font-whyte text-label-sm text-inj-snow/30 break-all">
          Tx: {txHash}
        </p>
      )}
    </div>
  );
}
