import { useCallback, useMemo } from "react";
import { useReadGMContract } from "../core/useReadCallGM";
import { CONTRACTS_GM, CONTRACT_DATA_GM } from "@/config/contracts";
import { NETWORKS } from "@/config/chains";
import { formatEther } from "viem";

// Helper function to check if GM is supported on the current chain
const isGMSupportedOnChain = (chainId?: NETWORKS): boolean => {
  if (!chainId) return false;
  return chainId in CONTRACT_DATA_GM[CONTRACTS_GM.GM].addresses;
};

export const useGMData = (
  chainId?: NETWORKS
): {
  fetchGMFee: () => Promise<string>;
  isGMSupported: boolean;
} => {
  const { callGMContract } = useReadGMContract();

  const isGMSupported = isGMSupportedOnChain(chainId);

  const feeCall = useMemo(
    () => ({
      contract: CONTRACTS_GM.GM,
      functionName: "fee",
    }),
    []
  );

  const fetchGMFee = useCallback(async () => {
    try {
      if (chainId && isGMSupported) {
        const data = await callGMContract(feeCall, chainId);
        // Contract returns bigint, ensure proper type handling
        const _fee = data ? BigInt(data.toString()) : BigInt(0);
        const feeString = formatEther(_fee);

        return feeString;
      }
    } catch (e) {
      console.error("Error fetching GM fee:", e);
      return "0";
    }
    return "0";
  }, [callGMContract, feeCall, chainId, isGMSupported]);

  return { fetchGMFee, isGMSupported };
};
