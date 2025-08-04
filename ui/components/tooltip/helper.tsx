import React from "react";
import Tooltip, { TooltipProps } from ".";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { cn } from "@/utils";

const Helper: React.FC<TooltipProps> = ({ content, className }) => {
  return (
    <Tooltip
      content={content}
      direction="right"
      className={cn(
        "max-w-[250px] text-wrap bottom-0 right-0 mobile:max-w-[200px] mobile:bottom-full mobile:!translate-x-1/2",
        className
      )}
    >
      <IoMdHelpCircleOutline className="w-5 h-5" />
    </Tooltip>
  );
};

export default Helper;
