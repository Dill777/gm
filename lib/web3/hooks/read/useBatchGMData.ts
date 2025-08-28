import { useCallback, useState, useEffect } from "react";
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

export interface BatchGMData {
  [chainId: number]: GMDataResult;
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

// Get all supported chain IDs for GM
const getSupportedChainIds = (): NETWORKS[] => {
  return Object.keys(CONTRACT_DATA_GM[CONTRACTS_GM.GM].addresses).map(
    (id) => Number(id) as NETWORKS
  );
};

export const useBatchGMData = () => {
  const { address, isConnected } = useAccount();
  const { isAuthorized } = useAuth();

  const [data, setData] = useState<BatchGMData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBatchGMData = useCallback(async (): Promise<BatchGMData> => {
    if (!address || !isConnected || !isAuthorized) {
      const emptyData: BatchGMData = {};
      setData(emptyData);
      return emptyData;
    }

    setIsLoading(true);
    setError(null);

    try {
      const supportedChainIds = getSupportedChainIds();
      const batchData: BatchGMData = {};

      // Fetch data for all supported chains in parallel
      const chainDataPromises = supportedChainIds.map(async (chainId) => {
        try {
          if (!isGMSupportedOnChain(chainId)) {
            return {
              chainId,
              data: {
                fee: "0",
                lastGM: null,
                lastGMFormatted: "Not Available",
                todayGMStatus: false,
                gmStreak: 0,
                totalGMs: 0,
              },
            };
          }

          // Fetch data from database API
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

          return { chainId, data: gmData };
        } catch (error) {
          console.error(`Error fetching GM data for chain ${chainId}:`, error);
          return {
            chainId,
            data: {
              fee: "0",
              lastGM: null,
              lastGMFormatted: "Never",
              todayGMStatus: false,
              gmStreak: 0,
              totalGMs: 0,
            },
          };
        }
      });

      const results = await Promise.all(chainDataPromises);

      // Build the batch data object
      results.forEach(({ chainId, data }) => {
        batchData[chainId] = data;
      });

      setData(batchData);
      return batchData;
    } catch (error) {
      console.error("Error fetching batch GM data:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setError(errorMessage);

      const emptyData: BatchGMData = {};
      setData(emptyData);
      return emptyData;
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected, isAuthorized]);

  // Auto-fetch data when user becomes authorized
  useEffect(() => {
    if (isConnected && address && isAuthorized) {
      fetchBatchGMData();
    } else {
      // Reset data when user is not authorized
      setData({});
    }
  }, [isConnected, address, isAuthorized, fetchBatchGMData]);

  // Function to get data for a specific chain
  const getGMDataForChain = useCallback(
    (chainId: NETWORKS): GMDataResult => {
      return (
        data[chainId] || {
          fee: "0",
          lastGM: null,
          lastGMFormatted: "Never",
          todayGMStatus: false,
          gmStreak: 0,
          totalGMs: 0,
        }
      );
    },
    [data]
  );

  // Function to refresh data for a specific chain (for individual card refresh)
  const refreshGMDataForChain = useCallback(
    async (chainId: NETWORKS): Promise<GMDataResult> => {
      if (!address || !isConnected || !isAuthorized) {
        return {
          fee: "0",
          lastGM: null,
          lastGMFormatted: "Never",
          todayGMStatus: false,
          gmStreak: 0,
          totalGMs: 0,
        };
      }

      try {
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

        // Fetch fresh data for this specific chain
        const result = await getUserGMStats(address, chainId);

        let gmData: GMDataResult;

        if (!result.isError && result.data) {
          const lastGM = result.data.lastGM
            ? new Date(result.data.lastGM)
            : null;
          gmData = {
            fee: "0",
            lastGM,
            lastGMFormatted: formatLastGM(lastGM),
            todayGMStatus: result.data.todayStatus || false,
            gmStreak: result.data.gmStreak || 0,
            totalGMs: result.data.totalCount || 0,
          };
        } else {
          gmData = {
            fee: "0",
            lastGM: null,
            lastGMFormatted: "Never",
            todayGMStatus: false,
            gmStreak: 0,
            totalGMs: 0,
          };
        }

        // Update the batch data with the new data for this chain
        setData((prevData) => ({
          ...prevData,
          [chainId]: gmData,
        }));

        return gmData;
      } catch (error) {
        console.error(`Error refreshing GM data for chain ${chainId}:`, error);
        const defaultData = {
          fee: "0",
          lastGM: null,
          lastGMFormatted: "Never",
          todayGMStatus: false,
          gmStreak: 0,
          totalGMs: 0,
        };

        // Update the batch data with default data for this chain
        setData((prevData) => ({
          ...prevData,
          [chainId]: defaultData,
        }));

        return defaultData;
      }
    },
    [address, isConnected, isAuthorized]
  );

  return {
    batchData: data,
    isLoading,
    error,
    fetchBatchGMData,
    getGMDataForChain,
    refreshGMDataForChain,
  };
};
