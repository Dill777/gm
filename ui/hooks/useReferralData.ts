"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getReferrals } from "@/lib/api/referral";
import { NETWORKS, isChainSupported } from "@/config/chains";

interface ReferralData {
  totalEarnings: number;
  numberOfReferrals: number;
  leaderboard: Array<{
    id: number;
    chain: string;
    walletAddress: string;
    totalEarnings: number;
    numberOfReferrals: number;
  }>;
  isLoading: boolean;
}

export const useReferralData = () => {
  const { chainId, address } = useAccount();
  const [data, setData] = useState<ReferralData>({
    totalEarnings: 0,
    numberOfReferrals: 0,
    leaderboard: [],
    isLoading: false,
  });

  useEffect(() => {
    const fetchReferralData = async () => {
      if (chainId && isChainSupported(chainId) && address) {
        setData((prev) => ({ ...prev, isLoading: true }));

        try {
          const referrals = await getReferrals(chainId as NETWORKS, address);

          setData({
            totalEarnings: referrals.totalEarnings,
            numberOfReferrals: referrals.numberOfReferrals,
            leaderboard: referrals.lead,
            isLoading: false,
          });
        } catch (error) {
          console.error("Error fetching referral data:", error);
          setData((prev) => ({ ...prev, isLoading: false }));
        }
      } else {
        // Reset data when chain not supported or not connected
        setData({
          totalEarnings: 0,
          numberOfReferrals: 0,
          leaderboard: [],
          isLoading: false,
        });
      }
    };

    fetchReferralData();
  }, [chainId, address]);

  return data;
};
