"use client";
import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { SortMode } from "@/ui/components/sorter";
import EmptyStatus from "@/ui/widget/empty";
import { useClientRender } from "@/utils/hooks/useClientRender";
import ReferralItem, { LoadingRerralItem } from "@/ui/widget/referral-item";
import { useAppSelector } from "@/lib/store";
import LeaderboardHeader from "./leaderboard-header";
import CupIcon from "@/ui/components/icon/referral/CupIcon";
import LeaderboardPagination from "./leaderboard-pagination";
import { cn } from "@/utils";
import { usePagination } from "@/utils/hooks/usePagination";
import { useTab } from "@/utils/hooks/useTab";
import { TabItemHorizontal } from "@/ui/widget/tabs";
import { REWARDS } from "@/utils/constant";

const TAB_ITEMS = [
  { index: 1, label: "My Referrals", value: "referrals" },
  { index: 2, label: "Leaderboard", value: "leaderboard" },
];
const tabNames = TAB_ITEMS.map((item) => item.value);

const Leaderboard = () => {
  const { tabIndex, onTab } = useTab(tabNames);

  const searchParams = useSearchParams();
  const { referrals_lead, referrals_my, isLoading } = useAppSelector(
    (state) => state.referral
  );

  const referrals_my_set = useMemo(() => new Set(referrals_my), [referrals_my]);
  const { address, chainId } = useAccount();
  const isClient = useClientRender();
  const { domain, sort, mode } = useMemo(
    () => ({
      sort: searchParams.get("sort"),
      mode: (searchParams.get("mode") ?? "none") as SortMode,
      domain: searchParams.get("domain") ?? "",
    }),
    [searchParams]
  );

  const leadberboardReferrals = useMemo(() => {
    const filteredData = referrals_lead.map((item, index) => ({
      index: index + 1,
      ...item,
    }));

    if (sort) {
      switch (sort) {
        case "byReferrals":
          return filteredData.sort((a, b) => {
            const comparison = a.numberOfReferrals - b.numberOfReferrals;
            return mode === "asc" ? comparison : -comparison;
          });
        case "byEarning":
          return filteredData.sort((a, b) => {
            const comparison = a.totalEarnings - b.totalEarnings;
            return mode === "asc" ? comparison : -comparison;
          });
        default:
          return filteredData;
      }
    } else {
      return filteredData;
    }
  }, [referrals_lead, sort, mode, domain]);
  const myReferrals = useMemo(() => {
    const filteredData = referrals_lead
      .filter((item) => referrals_my_set.has(item.walletAddress))
      .map((item, index) => ({
        index: index + 1,
        ...item,
      }));

    if (sort) {
      switch (sort) {
        case "byEarning":
          return filteredData.sort((a, b) => {
            const comparison = a.totalEarnings - b.totalEarnings;
            return mode === "asc" ? comparison : -comparison;
          });
        default:
          return filteredData;
      }
    } else {
      return filteredData;
    }
  }, [referrals_lead, referrals_my_set, sort, mode, domain]);
  const leadberboardReferrals_pagination = usePagination({
    rows: leadberboardReferrals,
  });
  const myReferrals_pagination = usePagination({
    rows: myReferrals,
  });

  const selfIndex = useMemo(
    () => referrals_lead.findIndex((item) => item.walletAddress === address),
    [referrals_lead, address]
  );
  const selfReferral = useMemo(
    () =>
      referrals_lead[selfIndex] ?? {
        id: 0,
        chain: chainId,
        numberOfReferrals: 0,
        totalEarnings: 0,
        walletAddress: address,
        index: 0,
      },
    [referrals_lead, selfIndex]
  );

  return (
    <>
      <div className={cn("relative flex flex-col items-stretch gap-6")}>
        <div className="flex items-center justify-between">
          {TAB_ITEMS.map((item, index) => (
            <TabItemHorizontal
              key={`referral-tab-${item.value}`}
              onTabClick={() => onTab(index + 1)}
              selected={tabIndex === index + 1}
              label={item.label}
              keepBigFont
            />
          ))}
        </div>
        {tabIndex === 1 && (
          <div className="mt-[30px] w-full flex flex-col gap-[30px] items-center">
            <div className="w-full overflow-auto hide-scroll-bar">
              <div className="w-full min-w-[621px]">
                <LeaderboardHeader tab={"referrals"} isMine={true} />

                <div className="flex flex-col gap-5">
                  {!isClient || isLoading ? (
                    new Array(4)
                      .fill(" ")
                      .map((_, idx) => (
                        <LoadingRerralItem key={`userLoadinItem_${idx}`} />
                      ))
                  ) : myReferrals.length > 0 ? (
                    <>
                      {myReferrals_pagination.currentPageRows.map(
                        (item, idx) => {
                          if (item.walletAddress === address) return <></>;

                          let index = REWARDS.length;
                          while (
                            index > 0 &&
                            REWARDS[--index].refer > item.numberOfReferrals
                          );
                          const referband = REWARDS[index].reward;

                          return (
                            <ReferralItem
                              data={item}
                              referband={referband}
                              key={`userReferralItem_${idx}_${item.walletAddress}`}
                              tab={"referrals"}
                            />
                          );
                        }
                      )}
                    </>
                  ) : (
                    <EmptyStatus
                      className=""
                      title="You have no referrals"
                      searchButton={false}
                    />
                  )}
                </div>
              </div>
            </div>

            {myReferrals_pagination.pageCount > 0 && (
              <LeaderboardPagination
                curPage={myReferrals_pagination.currentPageIndex}
                pageCount={myReferrals_pagination.pageCount}
                onPage={myReferrals_pagination.go2Page}
              />
            )}
          </div>
        )}
        {tabIndex === 2 && (
          <div className="flex flex-col items-center gap-10">
            {/* info */}
            <div
              className={cn(
                "w-fit h-[74px] bg-[#101010] rounded-2xl p-[20px_14px] flex items-center",
                "tablet:w-[343px] tablet:h-[57px] tablet:p-[9px_10px]"
              )}
            >
              <div className="w-[583px] h-[50px] tablet:w-full tablet:h-[39px] tablet:p-[0px_12px] bg-black rounded-xl p-[8px_16px] flex items-center justify-between">
                <CupIcon className="w-[30.5px] h-[30.5px]" />
                <p className="font-poppins text-base tablet:w-[226px] text-center tablet:text-xs font-normal leading-[150%] text-text_normal">
                  {`You’ve earned $${selfReferral.totalEarnings.toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 5,
                      maximumFractionDigits: 5,
                    }
                  )} and ranked ${
                    selfIndex === -1 ? "" : selfIndex + 1
                  } out of ${referrals_lead.length} total users`}
                </p>
                <CupIcon className="w-[30.5px] h-[30.5px]" />
              </div>
            </div>

            <div className="w-full overflow-auto hide-scroll-bar">
              <div className="w-full min-w-[500px]">
                <LeaderboardHeader tab={"leaderboard"} />

                <div className="flex flex-col gap-5">
                  {!isClient || isLoading ? (
                    new Array(4)
                      .fill(" ")
                      .map((_, idx) => (
                        <LoadingRerralItem key={`userLoadinItem_${idx}`} />
                      ))
                  ) : referrals_lead.length > 0 ? (
                    <>
                      {leadberboardReferrals_pagination.currentPageRows.map(
                        (item, idx) => {
                          // if (item.walletAddress === address) return <></>;
                          return (
                            <ReferralItem
                              data={item}
                              key={`userReferralItem_${idx}_${item.walletAddress}`}
                              tab={"leaderboard"}
                            />
                          );
                        }
                      )}
                    </>
                  ) : (
                    <EmptyStatus
                      className=""
                      title="There is no referrals in this network"
                      searchButton={false}
                    />
                  )}
                </div>
              </div>
            </div>

            {leadberboardReferrals_pagination.pageCount > 0 && (
              <LeaderboardPagination
                curPage={leadberboardReferrals_pagination.currentPageIndex}
                pageCount={leadberboardReferrals_pagination.pageCount}
                onPage={leadberboardReferrals_pagination.go2Page}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Leaderboard;
