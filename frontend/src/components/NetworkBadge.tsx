import { useWallet } from "@/hooks/useWallet";
import { injectiveTestnet } from "@/config/wagmi";

export function NetworkBadge() {
  const { chain, isConnected } = useWallet();
  if (!isConnected) return null;

  const isCorrect = chain?.id === injectiveTestnet.id;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-inj-full font-whyte text-label-sm font-medium ${
        isCorrect
          ? "bg-inj-lime text-inj-forest"
          : "bg-inj-coral/20 text-inj-coral border border-inj-coral/40"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isCorrect ? "bg-inj-forest" : "bg-inj-coral"
        }`}
      />
      {isCorrect ? chain?.name : `Wrong Network`}
    </span>
  );
}
