"use client";
import React, { FC, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sorter, { SortMode } from "@/ui/components/sorter";
import { useClientRender } from "@/utils/hooks/useClientRender";
import { cn } from "@/utils";

const LeaderboardHeader: FC<{
  tab?: "referrals" | "leaderboard";
  isMine?: boolean;
}> = ({ tab, isMine }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isClient = useClientRender();
  const { sort, mode } = useMemo(
    () => ({
      sort: searchParams.get("sort"),
      mode: (searchParams.get("mode") ?? "none") as SortMode,
    }),
    [searchParams]
  );

  const handleSort = (id: string) => (mode: SortMode) => {
    const urlParams = new URLSearchParams(searchParams);
    if (mode === "none") {
      urlParams.delete("sort");
      urlParams.delete("mode");
    } else {
      urlParams.set("sort", id);
      urlParams.set("mode", mode);
    }
    router.push(`/referrals?${urlParams}`, { scroll: false });
  };

  const getMode = (id: string) => {
    if (isClient && sort === id) {
      return mode;
    } else return "none";
  };

  return (
    <div className={cn("w-full flex items-center justify-between py-5")}>
      <div
        className={cn(
          "flex items-center justify-start",
          "gap-[37px] tablet:gap-[32px]",
          tab === "referrals" && "w-[237px]",
          tab === "leaderboard" && "w-[404px] tablet:w-[250px]",
          "small:w-[170px] small:gap-[27.95px]"
        )}
      >
        <p className={cn("text-main-900 text-base", "small:text-sm")}>#</p>
        <p
          className={cn(
            "text-main-900 text-base text-left font-poppins font-semibold leading-[140%]",
            "small:text-sm"
          )}
        >
          User Address
        </p>
      </div>

      {tab === "referrals" && (
        <div
          className={cn(
            "w-[85px] flex items-center justify-end",
            "small:w-[55px]"
          )}
        >
          <p
            className={cn(
              "text-main-900 text-base font-poppins font-semibold leading-[140%]",
              "small:text-sm"
            )}
          >
            Rewards
          </p>
        </div>
      )}

      <div
        className={cn(
          "w-[85px] flex items-center justify-start",
          "small:w-[55px]"
        )}
      >
        <Sorter
          onSort={handleSort("byReferrals")}
          mode={getMode("byReferrals")}
          className="justify-center"
        >
          <p
            className={cn(
              "text-main-900 text-base font-poppins font-semibold leading-[140%]",
              "small:text-sm"
            )}
          >
            Referrals
          </p>
        </Sorter>
      </div>

      <div
        className={cn(
          "w-[160px] flex items-center justify-start",
          "small:w-[134px]"
        )}
      >
        <Sorter
          onSort={handleSort("byEarning")}
          mode={getMode("byEarning")}
          className="justify-end"
        >
          <p
            className={cn(
              "text-main-900 text-base font-poppins font-semibold text-center",
              "small:text-sm"
            )}
          >
            Total earnings
          </p>
        </Sorter>
      </div>
    </div>
  );
};

export default LeaderboardHeader;
