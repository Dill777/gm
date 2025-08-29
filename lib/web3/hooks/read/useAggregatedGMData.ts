import { useCallback, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { getAllUserGMStats } from "@/lib/api/gm";
import useAuth from "@/lib/auth/useAuth";

export interface AggregatedGMData {
  todayGMCount: number;
  thisWeekGMCount: number;
  totalGMsAllChains: number;
}

export const useAggregatedGMData = () => {
  const { address, isConnected } = useAccount();
  const { isAuthorized } = useAuth();

  const [data, setData] = useState<AggregatedGMData>({
    todayGMCount: 0,
    thisWeekGMCount: 0,
    totalGMsAllChains: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAggregatedGMData =
    useCallback(async (): Promise<AggregatedGMData> => {
      if (!address || !isConnected || !isAuthorized) {
        const emptyData = {
          todayGMCount: 0,
          thisWeekGMCount: 0,
          totalGMsAllChains: 0,
        };
        setData(emptyData);
        return emptyData;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Get aggregated stats from database across all chains
        const result = await getAllUserGMStats(address);

        if (!result.isError) {
          const resultData = result.data;

          const aggregatedData = {
            todayGMCount: resultData.todayCount || 0,
            thisWeekGMCount: resultData.weekCount || 0,
            totalGMsAllChains: resultData.totalCount || 0,
          };

          setData(aggregatedData);
          return aggregatedData;
        } else {
          console.error(
            "Failed to fetch aggregated GM stats from database:",
            result.error
          );
          const emptyData = {
            todayGMCount: 0,
            thisWeekGMCount: 0,
            totalGMsAllChains: 0,
          };
          setData(emptyData);
          return emptyData;
        }
      } catch (error) {
        console.error("Error fetching aggregated GM data:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);

        const emptyData = {
          todayGMCount: 0,
          thisWeekGMCount: 0,
          totalGMsAllChains: 0,
        };
        setData(emptyData);
        return emptyData;
      } finally {
        setIsLoading(false);
      }
    }, [address, isConnected, isAuthorized]);

  // Auto-fetch data when user becomes authorized
  useEffect(() => {
    if (isAuthorized) {
      fetchAggregatedGMData();
    } else {
      // Reset data when user is not authorized
      setData({
        todayGMCount: 0,
        thisWeekGMCount: 0,
        totalGMsAllChains: 0,
      });
    }
  }, [isAuthorized]);

  return {
    todayGMCount: data.todayGMCount,
    thisWeekGMCount: data.thisWeekGMCount,
    totalGMsAllChains: data.totalGMsAllChains,
    isLoading,
    error,
    fetchAggregatedGMData,
  };
};
