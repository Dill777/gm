import Image from "@/ui/components/image";
import { cn } from "@/utils";
import React, { FC, useMemo } from "react";

type RankProps = { index: number; tab: "referrals" | "leaderboard" };
const RankItem: FC<RankProps> = ({ index, tab }) => {
  const rankImage = useMemo(() => `/img/rank/${index}.png`, [index]);

  return (
    <div
      className={cn(
        tab === "leaderboard"
          ? "shrink-0 w-9 h-9 flex items-center justify-center"
          : "w-fit h-fit pr-2"
      )}
    >
      {index === 0 ? (
        <></>
      ) : index < 4 && tab === "leaderboard" ? (
        <Image
          src={rankImage}
          width={20}
          height={20}
          alt={`rank ${index}`}
          className="w-7 h-7 shrink-0"
        />
      ) : (
        <p
          className={cn(
            tab === "leaderboard"
              ? "p-1 w-6 h-6 shrink-0 rounded-full bg-main-200 text-main-900 text-sm inline-flex items-center justify-center"
              : "w-5 text-white text-sm font-normal font-poppins leading-[135%]"
          )}
        >
          {tab === "leaderboard" ? index : index < 10 ? `0${index}` : index}
        </p>
      )}
    </div>
  );
};

export default RankItem;
