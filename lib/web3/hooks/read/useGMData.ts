import { useCallback, useMemo } from "react";
import { useAccount } from "wagmi";
import { useReadGMContract } from "../core/useReadCallGM";
import { CONTRACTS_GM, CONTRACT_DATA_GM } from "@/config/contracts";
import { NETWORKS } from "@/config/chains";
import { formatEther } from "viem";
import { getUserGMStats } from "@/lib/api/gm";

export interface GMDataResult {
  fee: string;
  lastGM: Date | null;
  lastGMFormatted: string;
  todayGMStatus: boolean;
  gmStreak: number;
  totalGMs: number; // Now from database instead of contract
}

// Helper function to check if GM is supported on the current chain
const isGMSupportedOnChain = (chainId?: NETWORKS): boolean => {
  if (!chainId) return false;
  return chainId in CONTRACT_DATA_GM[CONTRACTS_GM.GM].addresses;
};

export const useGMData = (
  chainId?: NETWORKS
): {
  fetchGMData: () => Promise<GMDataResult>;
  fetchGMFee: () => Promise<string>;
  fetchLastGM: () => Promise<Date | null>;
  fetchTotalGMs: () => Promise<number>;
  isGMSupported: boolean;
} => {
  const { address } = useAccount();
  const { callGMContract } = useReadGMContract();

  const isGMSupported = isGMSupportedOnChain(chainId);

  const feeCall = useMemo(
    () => ({
      contract: CONTRACTS_GM.GM,
      functionName: "fee",
    }),
    []
  );

  const lastGMCall = useMemo(
    () => ({
      contract: CONTRACTS_GM.GM,
      functionName: "lastGM",
      args: [address],
    }),
    [address]
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

  const fetchLastGM = useCallback(async () => {
    try {
      if (address && chainId && isGMSupported) {
        const data = await callGMContract(lastGMCall, chainId);
        // Contract returns day number (days since Unix epoch), not timestamp
        if (!data) return null;
        const dayNumber = Number(BigInt(data.toString()));
        if (dayNumber === 0) return null;

        // Convert day number back to date
        // dayNumber * 86400 = seconds since epoch for that day
        const timestamp = dayNumber * 86400 * 1000; // Convert to milliseconds
        return new Date(timestamp);
      }
    } catch (e) {
      console.error("Error fetching last GM:", e);
      return null;
    }
    return null;
  }, [callGMContract, lastGMCall, chainId, address, isGMSupported]);

  // Fetch total GMs from database instead of contract
  const fetchTotalGMs = useCallback(async () => {
    try {
      if (address && chainId && isGMSupported) {
        const result = await getUserGMStats(address, chainId);

        if (!result.isError) {
          return result.data.totalCount || 0;
        } else {
          console.error(
            "Failed to fetch GM stats from database:",
            result.error
          );
          return 0;
        }
      }
    } catch (e) {
      console.error("Error fetching total GMs from database:", e);
      return 0;
    }
    return 0;
  }, [address, chainId, isGMSupported]);

  // Helper function to get current day number (for comparison)
  const getCurrentDayNumber = (): number => {
    return Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  };

  // Helper function to format date for display
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

  // Helper function to check if GM was sent today - now using database data
  const checkTodayGMStatus = async (): Promise<boolean> => {
    if (!address || !chainId || !isGMSupported) return false;

    try {
      const result = await getUserGMStats(address, chainId);

      if (!result.isError) {
        return result.data.todayStatus || false;
      }
    } catch (e) {
      console.error("Error checking today's GM status:", e);
    }
    return false;
  };

  // Helper function to calculate GM streak (simplified - just based on last GM)
  const calculateGMStreak = (lastGM: Date | null): number => {
    if (!lastGM) return 0;

    const currentDayNumber = getCurrentDayNumber();
    const lastGMDayNumber = Math.floor(
      lastGM.getTime() / (1000 * 60 * 60 * 24)
    );

    const daysDifference = currentDayNumber - lastGMDayNumber;

    // If last GM was today, streak is active
    if (daysDifference === 0) return 1;

    // If last GM was yesterday, could be a continuing streak
    // In a real implementation, you'd want to track the actual streak
    // by looking at consecutive days from event logs
    if (daysDifference === 1) return 1;

    // More than 1 day gap means streak is broken
    return 0;
  };

  const fetchGMData = useCallback(async (): Promise<GMDataResult> => {
    try {
      if (!isGMSupported) {
        // Return default data for unsupported chains
        return {
          fee: "0",
          lastGM: null,
          lastGMFormatted: "Not Available",
          todayGMStatus: false,
          gmStreak: 0,
          totalGMs: 0,
        };
      }

      // Fast database-only data fetching for display purposes
      const [totalGMs, dbStats] = await Promise.all([
        fetchTotalGMs(),
        address && chainId ? getUserGMStats(address, chainId) : null,
      ]);

      let lastGM: Date | null = null;
      let todayGMStatus = false;
      let gmStreak = 0;

      // Get data from database (fast)
      if (dbStats && !dbStats.isError) {
        lastGM = dbStats.data.lastGM ? new Date(dbStats.data.lastGM) : null;
        todayGMStatus = dbStats.data.todayStatus || false;
        // Use the calculated streak from the database
        gmStreak = dbStats.data.gmStreak || 0;
      }

      const lastGMFormatted = formatLastGM(lastGM);

      return {
        fee: "0", // Fee not needed for display - will be fetched when making transaction
        lastGM,
        lastGMFormatted,
        todayGMStatus,
        gmStreak,
        totalGMs,
      };
    } catch (e) {
      console.error("Error fetching GM data:", e);
      return {
        fee: "0",
        lastGM: null,
        lastGMFormatted: "Never",
        todayGMStatus: false,
        gmStreak: 0,
        totalGMs: 0,
      };
    }
  }, [fetchTotalGMs, isGMSupported, address, chainId]);

  return { fetchGMData, fetchGMFee, fetchLastGM, fetchTotalGMs, isGMSupported };
};
