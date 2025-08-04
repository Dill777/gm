"use client";

import React, { useMemo } from "react";
import { ReferralRewards, ReferralSumary } from "@/ui/views/referral";
import { toast } from "react-toastify";
import { cn, copyToClipboard } from "@/utils";
import { useClientRender } from "@/utils/hooks/useClientRender";
import { useAppSelector } from "@/lib/store";
import { REWARDS } from "@/utils/constant";

interface Props {
  className?: string;
}
const Info = ({ className }: Props) => {
  const isClient = useClientRender();
  const { user } = useAppSelector((state) => state.user);
  const { totalEarnings, numberOfReferrals } = useAppSelector(
    (state) => state.referral
  );
  const referUrl = useMemo(
    () =>
      isClient
        ? user && user.referralCode
          ? `${window.location.origin}?ref=${user.referralCode}`
          : `${window.location.origin}`
        : "",
    [user, isClient]
  );
  const { currentLevel, nextLevel } = useMemo(() => {
    let index = REWARDS.length;
    while (index > 0 && REWARDS[--index].refer > numberOfReferrals);
    const currentLevel =
      index === 0
        ? REWARDS[0].refer <= numberOfReferrals
          ? REWARDS[0]
          : { level: 0, refer: 0, reward: 0, color: "", percent: 0 }
        : REWARDS[index];
    const nextLevel =
      REWARDS[currentLevel.level === 5 ? 4 : currentLevel.level];
    return {
      currentLevel,
      nextLevel,
    };
  }, [numberOfReferrals]);

  const onCopy = () => {
    if (user) {
      copyToClipboard(referUrl);
      toast.success("Copied to clipboard");
    }
  };
  const onShare = () => {
    let description =
      "🟢 Big news for @znsconnect!\n" +
      "\n" +
      "🟢 Mint your domain and enjoy up to 25%25 rewards directly in your wallet!\n" +
      "\n" +
      "Visit:";

    let url = referUrl;
    let hashtags = "zns,znsconnect";
    window.open(
      `https://twitter.com/intent/tweet?text=${description}&url=${url}&hashtags=${hashtags}`,
      "_blank"
    );
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-col items-stretch",
          "gap-[50px] tablet:gap-[25px]",
          className ?? ""
        )}
      >
        <ReferralSumary
          totalReferrals={numberOfReferrals}
          toNextLevel={nextLevel.refer - numberOfReferrals}
          totalEarnings={totalEarnings}
          referUrl={referUrl}
          onCopy={onCopy}
          onShare={onShare}
        />
        <ReferralRewards
          totalReferrals={numberOfReferrals}
          currentLevel={currentLevel}
          nextLevel={nextLevel}
        />
      </div>
    </>
  );
};

export default Info;
