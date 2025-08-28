import { useCallback, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { NETWORKS } from "@/config/chains";
import { getUserDeployStats } from "@/lib/api/deploy";
import useAuth from "@/lib/auth/useAuth";
import { CONTRACTS_DEPLOY, CONTRACT_DATA_DEPLOY } from "@/config/contracts";

export interface DeployDataResult {
  fee: string;
  totalDeployments: number;
  lastDeploy: Date | null;
  lastDeployFormatted: string;
  todayDeployStatus: boolean;
}

export interface BatchDeployData {
  [chainId: number]: DeployDataResult;
}

// Helper function to check if Deploy is supported on the current chain
const isDeploySupportedOnChain = (chainId?: NETWORKS): boolean => {
  if (!chainId) return false;
  return chainId in CONTRACT_DATA_DEPLOY[CONTRACTS_DEPLOY.DEPLOY].addresses;
};

// Helper function to format last deploy date
const formatLastDeploy = (lastDeploy: Date | null): string => {
  if (!lastDeploy) return "Never";

  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - lastDeploy.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return "Yesterday";
  }

  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  return lastDeploy.toLocaleDateString();
};

// Get all supported chain IDs for Deploy
const getSupportedChainIds = (): NETWORKS[] => {
  return Object.keys(
    CONTRACT_DATA_DEPLOY[CONTRACTS_DEPLOY.DEPLOY].addresses
  ).map((id) => Number(id) as NETWORKS);
};

export const useBatchDeployData = () => {
  const { address, isConnected } = useAccount();
  const { isAuthorized } = useAuth();

  const [data, setData] = useState<BatchDeployData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBatchDeployData =
    useCallback(async (): Promise<BatchDeployData> => {
      if (!address || !isConnected || !isAuthorized) {
        const emptyData: BatchDeployData = {};
        setData(emptyData);
        return emptyData;
      }

      setIsLoading(true);
      setError(null);

      try {
        const supportedChainIds = getSupportedChainIds();
        const batchData: BatchDeployData = {};

        // Fetch data for all supported chains in parallel
        const chainDataPromises = supportedChainIds.map(async (chainId) => {
          try {
            if (!isDeploySupportedOnChain(chainId)) {
              return {
                chainId,
                data: {
                  fee: "0",
                  totalDeployments: 0,
                  lastDeploy: null,
                  lastDeployFormatted: "Not Available",
                  todayDeployStatus: false,
                },
              };
            }

            // Fetch data from database API
            const result = await getUserDeployStats(address, chainId);

            let deployData: DeployDataResult;

            if (!result.isError && result.data) {
              const lastDeploy = result.data.lastDeploy
                ? new Date(result.data.lastDeploy)
                : null;
              deployData = {
                fee: "0", // Fee not needed for display
                totalDeployments: result.data.totalCount || 0,
                lastDeploy,
                lastDeployFormatted: formatLastDeploy(lastDeploy),
                todayDeployStatus: result.data.todayStatus || false,
              };
            } else {
              // Default data if API call fails
              deployData = {
                fee: "0",
                totalDeployments: 0,
                lastDeploy: null,
                lastDeployFormatted: "Never",
                todayDeployStatus: false,
              };
            }

            return { chainId, data: deployData };
          } catch (error) {
            console.error(
              `Error fetching Deploy data for chain ${chainId}:`,
              error
            );
            return {
              chainId,
              data: {
                fee: "0",
                totalDeployments: 0,
                lastDeploy: null,
                lastDeployFormatted: "Never",
                todayDeployStatus: false,
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
        console.error("Error fetching batch Deploy data:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);

        const emptyData: BatchDeployData = {};
        setData(emptyData);
        return emptyData;
      } finally {
        setIsLoading(false);
      }
    }, [address, isConnected, isAuthorized]);

  // Auto-fetch data when user becomes authorized
  useEffect(() => {
    if (isConnected && address && isAuthorized) {
      fetchBatchDeployData();
    } else {
      // Reset data when user is not authorized
      setData({});
    }
  }, [isConnected, address, isAuthorized, fetchBatchDeployData]);

  // Function to get data for a specific chain
  const getDeployDataForChain = useCallback(
    (chainId: NETWORKS): DeployDataResult => {
      return (
        data[chainId] || {
          fee: "0",
          totalDeployments: 0,
          lastDeploy: null,
          lastDeployFormatted: "Never",
          todayDeployStatus: false,
        }
      );
    },
    [data]
  );

  // Function to refresh data for a specific chain (for individual card refresh)
  const refreshDeployDataForChain = useCallback(
    async (chainId: NETWORKS): Promise<DeployDataResult> => {
      if (!address || !isConnected || !isAuthorized) {
        return {
          fee: "0",
          totalDeployments: 0,
          lastDeploy: null,
          lastDeployFormatted: "Never",
          todayDeployStatus: false,
        };
      }

      try {
        if (!isDeploySupportedOnChain(chainId)) {
          return {
            fee: "0",
            totalDeployments: 0,
            lastDeploy: null,
            lastDeployFormatted: "Not Available",
            todayDeployStatus: false,
          };
        }

        // Fetch fresh data for this specific chain
        const result = await getUserDeployStats(address, chainId);

        let deployData: DeployDataResult;

        if (!result.isError && result.data) {
          const lastDeploy = result.data.lastDeploy
            ? new Date(result.data.lastDeploy)
            : null;
          deployData = {
            fee: "0",
            totalDeployments: result.data.totalCount || 0,
            lastDeploy,
            lastDeployFormatted: formatLastDeploy(lastDeploy),
            todayDeployStatus: result.data.todayStatus || false,
          };
        } else {
          deployData = {
            fee: "0",
            totalDeployments: 0,
            lastDeploy: null,
            lastDeployFormatted: "Never",
            todayDeployStatus: false,
          };
        }

        // Update the batch data with the new data for this chain
        setData((prevData) => ({
          ...prevData,
          [chainId]: deployData,
        }));

        return deployData;
      } catch (error) {
        console.error(
          `Error refreshing Deploy data for chain ${chainId}:`,
          error
        );
        const defaultData = {
          fee: "0",
          totalDeployments: 0,
          lastDeploy: null,
          lastDeployFormatted: "Never",
          todayDeployStatus: false,
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
    fetchBatchDeployData,
    getDeployDataForChain,
    refreshDeployDataForChain,
  };
};
