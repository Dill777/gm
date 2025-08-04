import React from "react";
import { cn } from "@/utils";

export interface TabItemProps {
  onTabClick: () => void;
  label: string;
  icon: React.ElementType;
  selected: boolean;
}

const TabItem: React.FC<TabItemProps> = ({
  onTabClick,
  label,
  icon: Icon,
  selected,
}) => {
  return (
    <div
      onClick={onTabClick}
      className={cn(
        selected
          ? "text-black bg-primary_gradient_text small:text-primary border-b-2 border-primary"
          : "text-main-400 hover:text-white",
        "flex items-center justify-start w-full space-x-[15px] px-[20px] py-[14px] rounded-2xl cursor-pointer small:space-x-2 small:bg-none small:rounded-none",
        "tablet:justify-center tablet:px-2",
        "final:flex-col final:justify-center final:space-x-0 final:space-y-1"
      )}
    >
      <Icon className="w-[20px] h-[20px] small:w-[25px] small:h-[25px]" />
      <p className="text-base final:text-xs small:hidden font-medium uppercase truncate">
        {label}
      </p>
    </div>
  );
};

export default TabItem;
