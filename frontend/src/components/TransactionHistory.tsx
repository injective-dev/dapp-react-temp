import { formatUnits } from "viem";
import { useUSDCPayment, PaymentRecord } from "@/hooks/useUSDCPayment";
import { useWallet } from "@/hooks/useWallet";

function formatTimestamp(ts: bigint): string {
  return new Date(Number(ts) * 1000).toLocaleString();
}

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function TransactionHistory() {
  const { isConnected } = useWallet();
  const { paymentHistory } = useUSDCPayment();

  if (!isConnected) return null;

  return (
    <div className="card space-y-inj-md">
      <h2 className="font-marist text-xl font-bold text-inj-snow">
        Payment History
      </h2>

      {paymentHistory.length === 0 ? (
        <p className="font-marist text-body-md text-inj-snow/40 text-center py-8">
          No payments yet
        </p>
      ) : (
        <div className="space-y-2">
          {[...paymentHistory].reverse().map((payment: PaymentRecord, i: number) => (
            <div
              key={i}
              className="flex items-start justify-between
                         px-inj-md py-inj-sm
                         rounded-inj-sm
                         border border-inj-snow/10 bg-inj-snow/5"
            >
              <div className="space-y-0.5">
                <p className="font-marist text-sm font-semibold text-inj-snow">
                  {parseFloat(formatUnits(payment.amount, 6)).toFixed(2)} USDC
                </p>
                {payment.memo && (
                  <p className="font-whyte text-label-sm text-inj-snow/50">
                    "{payment.memo}"
                  </p>
                )}
                <p className="font-whyte text-label-sm text-inj-snow/30">
                  {formatTimestamp(payment.timestamp)}
                </p>
              </div>
              <span className="font-whyte text-label-sm text-inj-snow/40 font-mono">
                {shortenAddress(payment.payer)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
