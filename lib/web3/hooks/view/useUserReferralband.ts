import { useMemo } from "react";
import { useAccount } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { useContract } from "../core/useContract";

export const useUserReferralBand = () => {
  const { address, chainId } = useAccount();

  const call = useMemo(
    () => ({
      contract: CONTRACTS.REGISTRY,
      functionName: "getReferralBand",
      args: [address],
      chainId,
    }),
    [address, chainId]
  );

  const { data, isLoading } = useContract(call);

  return { referband: Number(data ?? 0), isLoading };
};
