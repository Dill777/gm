"use client";

import React from "react";
import { Button } from "@/ui/components/button";
import CopyLinkIcon from "@/ui/components/icon/CopyLinkIcon";
import ShareLinkIcon from "@/ui/components/icon/referral/ShareLinkIcon";
import { cn } from "@/utils";

interface SummaryProps {
  totalReferrals: number;
  toNextLevel: number;
  totalEarnings: number;
  referUrl: string;
  onCopy: () => void;
  onShare: () => void;
}
const Summary = ({
  totalReferrals,
  toNextLevel,
  totalEarnings,
  referUrl,
  onCopy,
  onShare,
}: SummaryProps) => {
  return (
    <>
      <div className={cn("flex flex-col gap-[10px] items-stretch")}>
        <Info
          totalReferrals={totalReferrals}
          toNextLevel={toNextLevel}
          totalEarnings={totalEarnings}
        />
        <Link referUrl={referUrl} onCopy={onCopy} onShare={onShare} />
      </div>
    </>
  );
};

interface InfoProps {
  totalReferrals: number;
  toNextLevel: number;
  totalEarnings: number;
}
const Info = ({ totalReferrals, toNextLevel, totalEarnings }: InfoProps) => {
  return (
    <>
      <div className="flex items-center gap-[10px] tablet:flex-col tablet:items-stretch">
        <div className="flex flex-1 items-start rounded-2xl bg-bg3 gap-[10px] p-[30px]">
          <div className="flex flex-1 flex-col gap-[10px]">
            <p className="text-primary font-space_grotesk font-semibold text-3xl leading-[135%]">
              {totalReferrals}
            </p>
            <p className="font-poppins text-base font-normal leading-[135%] text-text_body3">
              Total Referrals
            </p>
          </div>

          <div className="bg-stroke/80 rounded-2xl p-[6px_16px] flex items-center justify-center">
            <p className="font-poppins text-sm font-normal leading-[135%] text-text_body3">
              <span className="text-white font-semibold">{toNextLevel}</span> to
              next level
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-start rounded-2xl bg-bg3 gap-[10px] p-[30px]">
          <div className="flex flex-1 flex-col gap-[10px]">
            <p className="text-primary font-space_grotesk font-semibold text-3xl leading-[135%]">
              {totalEarnings?.toLocaleString("en-US", {
                minimumFractionDigits: 5,
                maximumFractionDigits: 5,
              })}
            </p>
            <p className="font-poppins text-base font-normal leading-[135%] text-text_body3">
              Total Earnings
            </p>
          </div>

          <div className="bg-primary/10 rounded-2xl p-[6px_16px] flex items-center justify-center">
            <p className="font-poppins text-sm font-normal leading-[135%] text-primary">
              Totally Earn
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

interface LinkProps {
  referUrl: string;
  onCopy: () => void;
  onShare: () => void;
}
const Link = ({ referUrl, onCopy, onShare }: LinkProps) => {
  return (
    <>
      <div className="bg-bg3 flex flex-col items-stretch rounded-2xl gap-[10px] p-6">
        <p className="text-text_body3 font-poppins text-base font-normal leading-[135%]">
          Referral link
        </p>
        <div className="flex gap-[10px]">
          <div className="border border-white/30 rounded-[14px] h-[50px] pl-6 flex-1 flex items-center justify-start">
            <p
              className={cn(
                "text-base font-poppins text-white text-ellipsis overflow-hidden whitespace-nowrap",
                "w-[450px] small:w-[350px] mobile_md:w-[200px] mobile:w-[150px]"
              )}
            >
              {referUrl}
            </p>
          </div>
          <Button
            className="w-[50px] h-[50px] flex items-center justify-center rounded-2xl p-0"
            onClick={onCopy}
          >
            <CopyLinkIcon />
          </Button>
          <Button
            className={cn(
              "h-[50px] flex items-center justify-center gap-[10px] bg-bg2 rounded-2xl p-[10px_24px]",
              "tablet:hidden",
              "text-white"
            )}
            onClick={onShare}
          >
            <ShareLinkIcon />
            Share
          </Button>
        </div>

        <Button
          className={cn(
            "h-[50px] flex items-center justify-center gap-[10px] bg-bg2 rounded-2xl p-[10px_24px]",
            "hidden tablet:flex"
          )}
          onClick={onShare}
        >
          <ShareLinkIcon className="w-[19.5px] h-[19.5px]" />
          <p className="font-poppins text-white text-base font-medium leading-normal">
            Share
          </p>
        </Button>
      </div>
    </>
  );
};

export default Summary;
