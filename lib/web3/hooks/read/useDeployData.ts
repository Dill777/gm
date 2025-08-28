import { useCallback, useMemo } from "react";
import { useReadDeployContract } from "../core/useReadCallDeploy";
import { CONTRACTS_DEPLOY, CONTRACT_DATA_DEPLOY } from "@/config/contracts";
import { NETWORKS } from "@/config/chains";
import { formatEther } from "viem";

// Helper function to check if Deploy is supported on the current chain
const isDeploySupportedOnChain = (chainId?: NETWORKS): boolean => {
  if (!chainId) return false;
  return chainId in CONTRACT_DATA_DEPLOY[CONTRACTS_DEPLOY.DEPLOY].addresses;
};

export const useDeployData = (
  chainId?: NETWORKS
): {
  fetchDeployFee: () => Promise<string>;
  isDeploySupported: boolean;
} => {
  const { callDeployContract } = useReadDeployContract();

  const isDeploySupported = isDeploySupportedOnChain(chainId);

  const feeCall = useMemo(
    () => ({
      contract: CONTRACTS_DEPLOY.DEPLOY,
      functionName: "fee",
    }),
    []
  );

  const fetchDeployFee = useCallback(async () => {
    try {
      if (chainId && isDeploySupported) {
        // Fetch from blockchain if not cached or expired
        const data = await callDeployContract(feeCall, chainId);
        // Contract returns bigint, ensure proper type handling
        const _fee = data ? BigInt(data.toString()) : BigInt(0);
        const feeString = formatEther(_fee);

        return feeString;
      }
    } catch (e) {
      console.error("Error fetching deploy fee:", e);
      return "0";
    }
    return "0";
  }, [callDeployContract, feeCall, chainId, isDeploySupported]);

  return {
    fetchDeployFee,
    isDeploySupported,
  };
};
