import React, { FC } from "react";
import { SVGProps } from "..";

export const ShareIcon: FC<SVGProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className={className}
  >
    <path
      d="M13.3327 8.00065L9.06602 3.33398V5.66732C6.93268 5.66732 2.66602 7.06732 2.66602 12.6673C2.66602 11.8893 3.94602 10.334 9.06602 10.334V12.6673L13.3327 8.00065Z"
      stroke="#A2A2A2"
      strokeWidth="0.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
