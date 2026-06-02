import { useWallet } from "@/hooks/useWallet";
import { injectiveTestnet } from "@/config/wagmi";

export function NetworkBadge() {
  const { chain, isConnected } = useWallet();

  if (!isConnected) return null;

  const isCorrect = chain?.id === injectiveTestnet.id;

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        isCorrect
          ? "bg-green-900/40 text-green-400 border border-green-800/50"
          : "bg-red-900/40 text-red-400 border border-red-800/50"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isCorrect ? "bg-green-400" : "bg-red-400"}`} />
      {isCorrect ? chain?.name : `Wrong Network (${chain?.name ?? "Unknown"})`}
    </div>
  );
}
