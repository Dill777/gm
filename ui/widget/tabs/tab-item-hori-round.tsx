import React from "react";
import { cn } from "@/utils";
import { TabItemProps } from "./tab-item";

type TabItemHorizontalProps = Omit<TabItemProps, "icon"> & {
  subTitle?: string | null;
  keepFont?: boolean;
};

const TabItemHorizontalRound: React.FC<TabItemHorizontalProps> = ({
  label,
  selected,
  subTitle,
  keepFont,
  onTabClick,
}) => {
  return (
    <div
      onClick={onTabClick}
      className={cn(
        "flex items-center justify-center space-x-4 p-[15px] small:px-1  w-1/3 cursor-pointer tablet:space-x-1",
        selected
          ? "border-b-2 border-primary text-primary"
          : "border-b-2 border-main-400/30"
      )}
    >
      <p
        className={cn(
          "font-medium text-base relative truncate",
          !keepFont && "tablet:text-sm mobile:text-xs"
        )}
      >
        {label}

        {subTitle === null && (
          <span className="absolute -top-3 px-2 rounded-3xl bg-gray-400 text-base tablet:text-xs mobile:text-[10px] mobile:-right-[10px] mobile:px-1">
            {subTitle}
          </span>
        )}
      </p>
    </div>
  );
};

export default TabItemHorizontalRound;
