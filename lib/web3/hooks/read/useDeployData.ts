import { useCallback, useMemo } from "react";
import { useAccount } from "wagmi";
import { useReadDeployContract } from "../core/useReadCallDeploy";
import { CONTRACTS_DEPLOY, CONTRACT_DATA_DEPLOY } from "@/config/contracts";
import { NETWORKS } from "@/config/chains";
import { formatEther } from "viem";
import { getUserDeployStats } from "@/lib/api/deploy";

export interface DeployDataResult {
  fee: string;
  totalDeployments: number; // Now from database instead of contract
  lastDeploy: Date | null;
  lastDeployFormatted: string;
  todayDeployStatus: boolean;
}

// Helper function to check if Deploy is supported on the current chain
const isDeploySupportedOnChain = (chainId?: NETWORKS): boolean => {
  if (!chainId) return false;
  return chainId in CONTRACT_DATA_DEPLOY[CONTRACTS_DEPLOY.DEPLOY].addresses;
};

export const useDeployData = (
  chainId?: NETWORKS
): {
  fetchDeployData: () => Promise<DeployDataResult>;
  fetchDeployFee: () => Promise<string>;
  fetchDeployments: () => Promise<number>; // User's deployment count from database
  fetchTotalDeployments: () => Promise<number>; // Global deployment count from database
  fetchLastDeploy: () => Promise<Date | null>;
  isDeploySupported: boolean;
} => {
  const { address } = useAccount();
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

  // Fetch user's deployments from database instead of contract
  const fetchDeployments = useCallback(async () => {
    try {
      if (address && chainId && isDeploySupported) {
        const result = await getUserDeployStats(address, chainId);

        if (!result.isError) {
          return result.data.totalCount || 0;
        } else {
          console.error(
            "Failed to fetch Deploy stats from database:",
            result.error
          );
          return 0;
        }
      }
    } catch (e) {
      console.error("Error fetching user deployments from database:", e);
      return 0;
    }
    return 0;
  }, [address, chainId, isDeploySupported]);

  // Fetch total deployments from database instead of contract
  const fetchTotalDeployments = useCallback(async () => {
    try {
      if (address && chainId && isDeploySupported) {
        const result = await getUserDeployStats(address, chainId);

        if (!result.isError) {
          return result.data.totalCount || 0;
        } else {
          console.error(
            "Failed to fetch total Deploy stats from database:",
            result.error
          );
          return 0;
        }
      }
    } catch (e) {
      console.error("Error fetching total deployments from database:", e);
      return 0;
    }
    return 0;
  }, [address, chainId, isDeploySupported]);

  // Fetch last deploy from database
  const fetchLastDeploy = useCallback(async () => {
    try {
      if (address && chainId && isDeploySupported) {
        const result = await getUserDeployStats(address, chainId);

        if (!result.isError) {
          return result.data.lastDeploy
            ? new Date(result.data.lastDeploy)
            : null;
        } else {
          console.error(
            "Failed to fetch last Deploy from database:",
            result.error
          );
          return null;
        }
      }
    } catch (e) {
      console.error("Error fetching last deploy from database:", e);
      return null;
    }
    return null;
  }, [address, chainId, isDeploySupported]);

  // Helper function to format date for display
  const formatLastDeploy = (lastDeploy: Date | null): string => {
    if (!lastDeploy) return "Never";

    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - lastDeploy.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays <= 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return lastDeploy.toLocaleDateString();
  };

  // Helper function to check if deploy was done today - using database data
  const checkTodayDeployStatus = async (): Promise<boolean> => {
    if (!address || !chainId || !isDeploySupported) return false;

    try {
      const result = await getUserDeployStats(address, chainId);

      if (!result.isError) {
        return result.data.todayStatus || false;
      }
    } catch (e) {
      console.error("Error checking today's Deploy status:", e);
    }
    return false;
  };

  const fetchDeployData = useCallback(async (): Promise<DeployDataResult> => {
    try {
      if (!isDeploySupported) {
        // Return default data for unsupported chains
        return {
          fee: "0",
          totalDeployments: 0,
          lastDeploy: null,
          lastDeployFormatted: "Not Available",
          todayDeployStatus: false,
        };
      }

      // Fast database-only data fetching for display purposes
      const [totalDeployments, dbStats] = await Promise.all([
        fetchDeployments(),
        address && chainId ? getUserDeployStats(address, chainId) : null,
      ]);

      let lastDeploy: Date | null = null;
      let todayDeployStatus = false;

      // Get data from database (fast)
      if (dbStats && !dbStats.isError) {
        lastDeploy = dbStats.data.lastDeploy
          ? new Date(dbStats.data.lastDeploy)
          : null;
        todayDeployStatus = dbStats.data.todayStatus || false;
      }

      const lastDeployFormatted = formatLastDeploy(lastDeploy);

      return {
        fee: "0", // Fee not needed for display - will be fetched when making transaction
        totalDeployments, // Now using database data
        lastDeploy,
        lastDeployFormatted,
        todayDeployStatus,
      };
    } catch (e) {
      console.error("Error fetching Deploy data:", e);
      return {
        fee: "0",
        totalDeployments: 0,
        lastDeploy: null,
        lastDeployFormatted: "Never",
        todayDeployStatus: false,
      };
    }
  }, [fetchDeployments, isDeploySupported, address, chainId]);

  return {
    fetchDeployData,
    fetchDeployFee,
    fetchDeployments,
    fetchTotalDeployments,
    fetchLastDeploy,
    isDeploySupported,
  };
};
