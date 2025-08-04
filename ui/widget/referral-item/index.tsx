import React, { FC, useMemo } from "react";
import { useAccount } from "wagmi";
import RankItem from "./rank-item";
import { StoreReferral } from "@/lib/store/slices/referral";
import { cn, formatPrice } from "@/utils";
import { shortenWalletAddress } from "@/utils/string-helper";
import Image from "@/ui/components/image";

type ReferralItemProps = {
  data: StoreReferral & { index: number };
  isMine?: boolean;
  referband?: number;
  avatar?: string;
  tab: "referrals" | "leaderboard";
};
const ReferralItem: FC<ReferralItemProps> = ({
  data,
  referband,
  avatar,
  isMine,
  tab,
}) => {
  const { chain } = useAccount();

  const { numberOfReferrals, totalEarnings } = useMemo(
    () => ({
      numberOfReferrals: data.numberOfReferrals,
      totalEarnings: data.totalEarnings,
    }),
    [data]
  );

  const symbol = useMemo(() => chain?.nativeCurrency.symbol ?? "", [chain]);

  const userAddress = useMemo(
    () => shortenWalletAddress(data.walletAddress ?? "", 4),
    [data]
  );

  return (
    <div
      className={cn(
        "bg-[rgba(16,16,16,0.70)] backdrop-blur-[17px] rounded-[20px]",
        "py-[22px] small:py-[17px]",
        "flex items-center justify-between"
      )}
    >
      <div
        className={cn(
          "flex items-center pl-5 gap-5",
          tab === "leaderboard" ? "w-[404px] tablet:w-[250px]" : "w-[237px]",
          "small:w-[170px]",
          tab === "referrals" && "gap-3"
        )}
      >
        <RankItem index={data.index} tab={tab} />
        {tab === "referrals" && (
          <Image
            width={30}
            height={30}
            src={avatar ?? "/img/x/zns.jpg"}
            alt={`referral-avatar`}
            className="w-[30px] h-[30px] rounded-full text-[10px] text-text_body"
          />
        )}
        <p
          className={cn(
            "font-sans font-medium leading-[140%] lowercase text-white",
            "w-[150px]",
            tab === "referrals" ? "text-sm" : "text-[22px]",
            "small:w-[100px] small:text-base"
          )}
        >
          {userAddress}
        </p>
      </div>

      {tab === "referrals" && (
        <div
          className={cn(
            "font-poppins font-bold leading-[140%] text-primary",
            "w-[85px] text-base",
            "small:w-[55px] small:text-xs",
            "flex items-center justify-end"
          )}
        >
          {referband}%
        </div>
      )}

      <div
        className={cn(
          "font-poppins font-bold leading-[140%] text-success",
          "w-[85px] text-base",
          "small:w-[55px] small:text-xs",
          "flex items-center justify-start"
        )}
      >
        {numberOfReferrals}
      </div>

      <div
        className={cn(
          "font-poppins font-medium leading-[140%] text-white",
          "w-[160px] text-base",
          "small:w-[134px] small:text-xs",
          "flex items-center justify-start"
        )}
      >{`${formatPrice(totalEarnings, 4)} ${symbol}`}</div>
    </div>
  );
};

export { default as LoadingRerralItem } from "./loading-item";
export default ReferralItem;
