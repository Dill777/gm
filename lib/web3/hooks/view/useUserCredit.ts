import { useCallback, useMemo } from "react";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { CONTRACTS } from "@/config/contracts";
import { useReadCall } from "../core/useReadCall";

export const useUserCredit = () => {
  const { address, chainId } = useAccount();
  const { callContract } = useReadCall();

  const call = useMemo(
    () => ({
      contract: CONTRACTS.GIFTCARD,
      functionName: "getUserCredits",
      args: [address],
    }),
    [address]
  );

  const fetchUserCredit = useCallback(async () => {
    try {
      if (address) {
        const data = await callContract(call, chainId);
        const _credit = (!!data ? data : BigInt(0)) as bigint;
        return parseInt(formatEther(_credit));
      }
    } catch (e) {
      return 0;
    }
    return 0;
  }, [callContract, call, chainId, address]);

  return { fetchUserCredit };
};
