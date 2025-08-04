"use client";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useAppDispatch } from "@/lib/store";
import { getReferrals } from "@/lib/api/referral";
import {
  initReferrals,
  setReferralInfo,
  setLoading as setReferralLoading,
  setReferralsLead,
  setReferralsMy,
} from "@/lib/store/slices/referral";
import { NETWORKS, isChainSupported } from "@/config/chains";
import { useDebouncedCall } from "@/utils/useDebouncedCall";

const Updater = () => {
  const { chainId, address } = useAccount();
  const dispatch = useAppDispatch();

  const debouncedFetchFollowingData = useDebouncedCall(async () => {
    if (chainId) {
      const data = await getReferrals(chainId as NETWORKS, address);
      dispatch(setReferralsLead(data.lead));
      dispatch(setReferralsMy(data.my));
      dispatch(
        setReferralInfo({
          totalEarnings: data.totalEarnings,
          numberOfReferrals: data.numberOfReferrals,
        })
      );
      dispatch(setReferralLoading(false));
    }
  });

  useEffect(() => {
    if (chainId && isChainSupported(chainId)) {
      dispatch(setReferralLoading(true));
      debouncedFetchFollowingData();
    } else {
      dispatch(initReferrals());
    }
  }, [chainId]);

  return null;
};

export default Updater;
