import { useState } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, formatUnits, maxUint256 } from "viem";
import { CONTRACT_ADDRESSES, ERC20_ABI, PAYMENT_PROCESSOR_ABI, IS_CONTRACT_CONFIGURED } from "@/config/contracts";
import { useAccount } from "wagmi";

export interface PaymentRecord {
  payer: `0x${string}`;
  amount: bigint;
  timestamp: bigint;
  memo: string;
}

export function useUSDCPayment() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read USDC balance (Circle testnet USDC)
  const { data: usdcBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.USDC,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read allowance for payment processor
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACT_ADDRESSES.USDC,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, CONTRACT_ADDRESSES.PAYMENT_PROCESSOR] : undefined,
    query: { enabled: !!address },
  });

  // Read payment history
  const { data: paymentHistory, refetch: refetchHistory } = useReadContract({
    address: CONTRACT_ADDRESSES.PAYMENT_PROCESSOR,
    abi: PAYMENT_PROCESSOR_ABI,
    functionName: "getPaymentHistory",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read minimum payment
  const { data: minimumPayment } = useReadContract({
    address: CONTRACT_ADDRESSES.PAYMENT_PROCESSOR,
    abi: PAYMENT_PROCESSOR_ABI,
    functionName: "minimumPayment",
  });

  // Wait for tx confirmation
  const { isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  /**
   * Approve payment processor to spend USDC on user's behalf
   */
  const approveUSDC = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.USDC,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [CONTRACT_ADDRESSES.PAYMENT_PROCESSOR, maxUint256],
      });
      setTxHash(hash);
      await refetchAllowance();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approval failed");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Send a USDC payment
   * @param amountStr — human-readable amount (e.g. "10" for 10 USDC)
   * @param memo — optional payment note
   *
   * Automatically approves if allowance is insufficient.
   * Get testnet USDC from: https://faucet.circle.com/
   */
  const pay = async (amountStr: string, memo: string) => {
    if (!IS_CONTRACT_CONFIGURED) {
      const msg = "Contract not configured. Deploy the contract first, then set VITE_PAYMENT_PROCESSOR_ADDRESS in your .env file.";
      setError(msg);
      throw new Error(msg);
    }
    setIsLoading(true);
    setError(null);
    try {
      const amount = parseUnits(amountStr, 6);

      // Auto-approve if allowance is insufficient
      if (!allowance || allowance < amount) {
        await approveUSDC();
      }

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.PAYMENT_PROCESSOR,
        abi: PAYMENT_PROCESSOR_ABI,
        functionName: "pay",
        args: [amount, memo],
      });
      setTxHash(hash);
      await Promise.all([refetchBalance(), refetchHistory()]);
      return hash;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Balances
    usdcBalance,
    usdcBalanceFormatted: usdcBalance ? formatUnits(usdcBalance, 6) : "0",
    // Minimum payment
    minimumPayment,
    minimumPaymentFormatted: minimumPayment ? formatUnits(minimumPayment, 6) : "1",
    // Payment history
    paymentHistory: (paymentHistory as PaymentRecord[] | undefined) ?? [],
    // Actions
    approveUSDC,
    pay,
    // State
    isLoading,
    error,
    txHash,
    isTxSuccess,
  };
}
