import React, { FC } from "react";
import { SVGProps } from ".";

export const ArrowDownIcon: FC<SVGProps> = ({ className }) => (
  <svg
    width="11"
    height="6"
    viewBox="0 0 11 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className ?? ""}
  >
    <path
      d="M1 0.75L4.8636 4.6136C5.21508 4.96508 5.78492 4.96508 6.1364 4.6136L10 0.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
