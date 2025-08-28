import { useCallback, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { getAllUserDeployStats } from "@/lib/api/deploy";
import useAuth from "@/lib/auth/useAuth";

export interface AggregatedDeployData {
  todayDeployCount: number;
  thisWeekDeployCount: number;
  totalDeploySCDeployed: number;
}

export const useAggregatedDeployData = () => {
  const { address, isConnected } = useAccount();
  const { isAuthorized } = useAuth();

  const [data, setData] = useState<AggregatedDeployData>({
    todayDeployCount: 0,
    thisWeekDeployCount: 0,
    totalDeploySCDeployed: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAggregatedDeployData =
    useCallback(async (): Promise<AggregatedDeployData> => {
      if (!address || !isConnected || !isAuthorized) {
        const emptyData = {
          todayDeployCount: 0,
          thisWeekDeployCount: 0,
          totalDeploySCDeployed: 0,
        };
        setData(emptyData);
        return emptyData;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Get aggregated stats from database across all chains
        const result = await getAllUserDeployStats(address);

        if (!result.isError) {
          const resultData = result.data;

          const aggregatedData = {
            todayDeployCount: resultData.todayCount || 0,
            thisWeekDeployCount: resultData.weekCount || 0,
            totalDeploySCDeployed: resultData.totalCount || 0,
          };

          setData(aggregatedData);
          return aggregatedData;
        } else {
          console.error(
            "Failed to fetch aggregated Deploy stats from database:",
            result.error
          );
          const emptyData = {
            todayDeployCount: 0,
            thisWeekDeployCount: 0,
            totalDeploySCDeployed: 0,
          };
          setData(emptyData);
          return emptyData;
        }
      } catch (error) {
        console.error("Error fetching aggregated Deploy data:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);

        const emptyData = {
          todayDeployCount: 0,
          thisWeekDeployCount: 0,
          totalDeploySCDeployed: 0,
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
      fetchAggregatedDeployData();
    } else {
      // Reset data when user is not authorized
      setData({
        todayDeployCount: 0,
        thisWeekDeployCount: 0,
        totalDeploySCDeployed: 0,
      });
    }
  }, [isAuthorized, fetchAggregatedDeployData]);

  return {
    todayDeployCount: data.todayDeployCount,
    thisWeekDeployCount: data.thisWeekDeployCount,
    totalDeploySCDeployed: data.totalDeploySCDeployed,
    isLoading,
    error,
    fetchAggregatedDeployData,
  };
};
