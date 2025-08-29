import { useCallback, useState } from "react";
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

// Helper function to check if Deploy is supported on the current chain
const isDeploySupportedOnChain = (chainId?: NETWORKS): boolean => {
  if (!chainId) return false;
  return chainId in CONTRACT_DATA_DEPLOY[CONTRACTS_DEPLOY.DEPLOY].addresses;
};

// Helper function to format last deploy date
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

export const useSingleChainDeployData = () => {
  const { address, isConnected } = useAccount();
  const { isAuthorized } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch data for a specific chain
  const fetchDeployDataForChain = useCallback(
    async (chainId: NETWORKS): Promise<DeployDataResult> => {
      if (!address || !isConnected || !isAuthorized) {
        return {
          fee: "0",
          totalDeployments: 0,
          lastDeploy: null,
          lastDeployFormatted: "Not Available",
          todayDeployStatus: false,
        };
      }

      if (!isDeploySupportedOnChain(chainId)) {
        return {
          fee: "0",
          totalDeployments: 0,
          lastDeploy: null,
          lastDeployFormatted: "Not Available",
          todayDeployStatus: false,
        };
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch data from database API for this specific chain
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

        return deployData;
      } catch (error) {
        console.error(
          `Error fetching Deploy data for chain ${chainId}:`,
          error
        );
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(errorMessage);

        // Return default data on error
        return {
          fee: "0",
          totalDeployments: 0,
          lastDeploy: null,
          lastDeployFormatted: "Never",
          todayDeployStatus: false,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [address, isConnected, isAuthorized]
  );

  return {
    fetchDeployDataForChain,
    isLoading,
    error,
  };
};
