import React, { FC } from "react";
import { SVGProps } from "..";
import { cn } from "@/utils";

export const TwitterColorIcon: FC<SVGProps> = ({ className }) => (
  <div
    className={cn(
      "flex items-center justify-center rounded-[56px] bg-[#20201E]",
      className
    )}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
    >
      <path
        d="M10.691 1.11133H12.6588L8.35965 6.02503L13.4173 12.7115H9.45721L6.3555 8.65618L2.80645 12.7115H0.837403L5.43582 7.45572L0.583984 1.11133H4.64463L7.4483 4.81802L10.691 1.11133ZM10.0003 11.5336H11.0907L4.05213 2.22732H2.882L10.0003 11.5336Z"
        fill="white"
      />
    </svg>
  </div>
);
