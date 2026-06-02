import { formatUnits } from "viem";
import { useUSDCPayment, PaymentRecord } from "@/hooks/useUSDCPayment";
import { useWallet } from "@/hooks/useWallet";

function formatTimestamp(ts: bigint): string {
  return new Date(Number(ts) * 1000).toLocaleString();
}

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function TransactionHistory() {
  const { isConnected } = useWallet();
  const { paymentHistory } = useUSDCPayment();

  if (!isConnected) return null;

  return (
    <div className="bg-injective-card border border-injective-border rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Payment History</h2>

      {paymentHistory.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-6">
          No payments yet. Make your first payment above!
        </p>
      ) : (
        <div className="space-y-3">
          {[...paymentHistory].reverse().map((payment: PaymentRecord, i: number) => (
            <div
              key={i}
              className="flex items-start justify-between p-3 bg-injective-dark rounded-lg border border-injective-border/50"
            >
              <div className="space-y-0.5">
                <div className="text-sm font-medium text-white">
                  {formatUnits(payment.amount, 6)} USDC
                </div>
                {payment.memo && (
                  <div className="text-xs text-gray-400">"{payment.memo}"</div>
                )}
                <div className="text-xs text-gray-500">
                  {formatTimestamp(payment.timestamp)}
                </div>
              </div>
              <div className="text-xs font-mono text-gray-500">
                {shortenAddress(payment.payer)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
