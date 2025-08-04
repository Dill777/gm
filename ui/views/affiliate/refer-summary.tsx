"use client";
import React, { ReactNode, useMemo } from "react";
import { toast } from "react-toastify";
import { GradientText } from "@/ui/components/text";
import CodeSnippet from "@/ui/components/code-snippet";
import InteractionButton from "@/ui/widget/interaction-button";
import { cn, copyToClipboard } from "@/utils";
import { useClientRender } from "@/utils/hooks/useClientRender";
import { useAppSelector } from "@/lib/store";
import Link from "@/ui/components/link";
import { ShareIcon } from "@/ui/components/icon/ShareIcon";
import Image from "@/ui/components/image";
import { CopyIcon } from "@/ui/components/icon/social-link/CopyIcon";
import PeopleIcon from "@/ui/components/icon/referral/PeopleIcon";
import CreditCardIcon from "@/ui/components/icon/referral/CreditCardIcon";

const codeString = `// 1 invites - 5%
// 10 invites - 10%
// 30 invites - 15%
// 60 invites - 20%
// 100 invites - 25%
uint256[5] referTicks =[500, 1000, 1500, 2000, 2500]
`;

const Summary = ({ children }: { children: ReactNode | ReactNode[] }) => {
  return (
    <>
      <div
        className={cn(
          "w-[353px] h-[154px] rounded-xl bg-[#1B1B1B]",
          "p-[44.67px_100px_45.33px_32px]",
          "relative overflow-hidden",
          "mobile_md:w-[319px] mobile_md:p-[44.67px_66px_45.33px_32px]"
        )}
      >
        {/* background */}
        <div
          className="absolute top-[-2051px] left-[-216px] w-[1464.205px] h-[7422.088px] shrink-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), radial-gradient(34.87% 38.23% at 20.71% 26.77%, rgba(202, 252, 1, 0.15) 0%, rgba(202, 252, 1, 0.00) 100%), #1B1B1B",
          }}
        ></div>
        <div
          className="absolute top-[-1699px] left-[-216px] w-[1464.205px] h-[7422.088px] shrink-0 mix-blend-multiply opacity-10"
          style={{
            background:
              "url('/img/referral/stat_bg.jpg') lightgray 50% / cover no-repeat",
          }}
        ></div>

        {children}
      </div>
    </>
  );
};

const ReferSummary = () => {
  const isClient = useClientRender();
  const { user } = useAppSelector((state) => state.user);
  const { referrals_lead, referrals_my } = useAppSelector(
    (state) => state.referral
  );
  const referrals_my_set = useMemo(() => new Set(referrals_my), [referrals_my]);
  const { totalReferrals, totalEarnings } = useMemo(
    () =>
      referrals_lead.reduce(
        (prev, cur) => {
          return referrals_my_set.has(cur.walletAddress)
            ? {
                totalReferrals: prev.totalReferrals + cur.numberOfReferrals,
                totalEarnings: prev.totalEarnings + cur.totalEarnings,
              }
            : {
                totalReferrals: prev.totalReferrals,
                totalEarnings: prev.totalEarnings,
              };
        },
        { totalReferrals: 0, totalEarnings: 0 }
      ),
    [referrals_my]
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

  const onCopy = () => {
    if (user) {
      copyToClipboard(referUrl);
      toast.success("Copied to clipboard");
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between self-stretch p-[40px_40px_40px_77px] bg-bg3 rounded-[10px]",
        "laptop:justify-center laptop:p-[40px] tablet_md:p-[20px_12px]"
      )}
    >
      {/* Medal */}
      <div className="w-[194px] h-[194px] laptop:hidden">
        <Image
          src={"/img/referral/medal.svg"}
          alt={"referral-page-medal.svg"}
          width={194}
          height={194}
        />
      </div>

      {/* data */}
      <div className={cn("flex flex-col gap-10", "tablet:w-full")}>
        {/* stats */}
        <div
          className={cn("flex items-center gap-[27px]", "tablet_md:flex-col")}
        >
          <Summary>
            <div className="flex items-center justify-start gap-[13px]">
              <div className="w-16 h-16 rounded-full z-10 flex items-center justify-center bg-[rgba(16,16,16,0.70)]">
                <PeopleIcon className="w-10 h-10" />
              </div>
              <div className="z-10 flex flex-col items-start">
                <p className="text-text_body text-sm font-poppins font-medium uppercase">
                  Total Referrals
                </p>
                <p className="text-text_normal font-semibold text-[32px]">
                  {totalReferrals}
                </p>
              </div>
            </div>
          </Summary>
          <Summary>
            <div className="flex items-center justify-start gap-[13px]">
              <div className="w-16 h-16 rounded-full z-10 flex items-center justify-center bg-[rgba(16,16,16,0.70)]">
                <CreditCardIcon className="w-10 h-10" />
              </div>
              <div className="z-10 flex flex-col items-start">
                <p className="text-text_body text-sm font-poppins font-medium uppercase">
                  Total Earnings
                </p>
                <p className="text-text_normal font-semibold text-[32px]">
                  ${totalEarnings.toFixed(0)}
                </p>
              </div>
            </div>
          </Summary>
        </div>

        {/* link */}
        <div className="flex flex-col gap-3">
          <p className="text-text_body font-poppins text-sm normal-case font-medium leading-[20px] tracking-[0.14px]">
            YOUR REFERRAL LINK
          </p>
          <div className={cn("flex items-center gap-3", "tablet:flex-col")}>
            <div className="tablet:self-stretch flex-1 bg-black flex items-center justify-between p-[3px_3px_3px_16px] rounded-xl">
              <p
                className={cn(
                  "text-text_normal font-poppins text-base normal-case font-medium leading-[150%]",
                  "overflow-ellipsis whitespace-nowrap overflow-hidden",
                  "small:w-[120px]"
                )}
              >
                {referUrl}
              </p>
              <div
                className={cn(
                  "w-[132px] h-[44px] p-[11.5px_19.5px] flex items-center justify-center gap-[5px]",
                  "bg-[#282B1E] rounded-[10px]",
                  "cursor-pointer"
                )}
                onClick={onCopy}
              >
                <CopyIcon className="w-[14px] h-[14px]" />
                <p className="font-poppins text-sm font-medium text-text_normal">
                  Copy link
                </p>
              </div>
            </div>
            <InteractionButton
              requiredConnect
              onClick={onCopy}
              size="md"
              className={cn(
                "w-[132px] h-[50px] px-6 font-medium text-text_normal text-sm flex items-center justify-center gap-[5px]",
                "mobile:w-full"
              )}
              style={{
                background:
                  "linear-gradient(110deg, #C9FC01 25.34%, #265800 47.09%)",
              }}
            >
              <ShareIcon className="text_normal" /> Share
            </InteractionButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferSummary;
