import React from "react";
import { cn } from "@/utils";
import { TabItemProps } from "./tab-item";

type TabItemHorizontalProps = Omit<TabItemProps, "icon"> & {
  subTitle?: string | null;
  keepBigFont?: boolean;
};

const TabItemHorizontal: React.FC<TabItemHorizontalProps> = ({
  label,
  selected,
  subTitle,
  onTabClick,
  keepBigFont,
}) => {
  return (
    <div
      onClick={onTabClick}
      className={cn(
        "flex items-center justify-center w-full cursor-pointer p-[15px] laptop:px-0",
        selected ? "border-b-2 border-primary" : "border-b-2 border-main-400/30"
      )}
    >
      <p
        className={cn(
          "text-center font-poppins font-medium leading-[24px] relative",
          keepBigFont ? "text-base" : "text-base",
          !keepBigFont && "laptop:text-xs mobile:text-xs",
          selected ? "text-[#C9FC01]" : "text-[#F4F4F5]"
        )}
      >
        {label}

        {false && subTitle && (
          <span className="absolute -top-3 px-2 rounded-3xl bg-gray-400 text-base tablet:text-xs mobile:text-[10px] mobile:-right-[10px] mobile:px-1">
            {subTitle}
          </span>
        )}
      </p>
    </div>
  );
};

export default TabItemHorizontal;
