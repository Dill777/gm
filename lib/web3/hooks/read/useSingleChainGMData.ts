import { useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { NETWORKS } from "@/config/chains";
import { getUserGMStats } from "@/lib/api/gm";
import useAuth from "@/lib/auth/useAuth";
import { CONTRACTS_GM, CONTRACT_DATA_GM } from "@/config/contracts";

export interface GMDataResult {
  fee: string;
  lastGM: Date | null;
  lastGMFormatted: string;
  todayGMStatus: boolean;
  gmStreak: number;
  totalGMs: number;
}

// Helper function to check if GM is supported on the current chain
const isGMSupportedOnChain = (chainId?: NETWORKS): boolean => {
  if (!chainId) return false;
  return chainId in CONTRACT_DATA_GM[CONTRACTS_GM.GM].addresses;
};

// Helper function to format last GM date
const formatLastGM = (lastGM: Date | null): string => {
  if (!lastGM) return "Never";

  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - lastGM.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays <= 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;

  return lastGM.toLocaleDateString();
};

export const useSingleChainGMData = () => {
  const { address, isConnected } = useAccount();
  const { isAuthorized } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch data for a specific chain
  const fetchGMDataForChain = useCallback(
    async (chainId: NETWORKS): Promise<GMDataResult> => {
      if (!address || !isConnected || !isAuthorized) {
        return {
          fee: "0",
          lastGM: null,
          lastGMFormatted: "Not Available",
          todayGMStatus: false,
          gmStreak: 0,
          totalGMs: 0,
        };
      }

      if (!isGMSupportedOnChain(chainId)) {
        return {
          fee: "0",
          lastGM: null,
          lastGMFormatted: "Not Available",
          todayGMStatus: false,
          gmStreak: 0,
          totalGMs: 0,
        };
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch data from database API for this specific chain
        const result = await getUserGMStats(address, chainId);

        let gmData: GMDataResult;

        if (!result.isError && result.data) {
          const lastGM = result.data.lastGM
            ? new Date(result.data.lastGM)
            : null;
          gmData = {
            fee: "0", // Fee not needed for display
            lastGM,
            lastGMFormatted: formatLastGM(lastGM),
            todayGMStatus: result.data.todayStatus || false,
            gmStreak: result.data.gmStreak || 0,
            totalGMs: result.data.totalCount || 0,
          };
        } else {
          // Default data if API call fails
          gmData = {
            fee: "0",
            lastGM: null,
            lastGMFormatted: "Never",
            todayGMStatus: false,
            gmStreak: 0,
            totalGMs: 0,
          };
        }

        return gmData;
      } catch (error) {
        console.error(`Error fetching GM data for chain ${chainId}:`, error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);

        // Return default data on error
        return {
          fee: "0",
          lastGM: null,
          lastGMFormatted: "Never",
          todayGMStatus: false,
          gmStreak: 0,
          totalGMs: 0,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [address, isConnected, isAuthorized]
  );

  return {
    fetchGMDataForChain,
    isLoading,
    error,
  };
};
