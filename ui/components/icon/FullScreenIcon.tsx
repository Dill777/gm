import React, { FC } from "react";
import { SVGProps } from ".";

export const FullScreenIcon: FC<SVGProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="15"
    viewBox="0 0 14 15"
    fill="none"
    className={className}
  >
    <path
      d="M12.25 5.75V2.25H8.75"
      stroke="#FDFCFF"
      strokeWidth="0.875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.75 9.25V12.75H5.25"
      stroke="#FDFCFF"
      strokeWidth="0.875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.25 2.25L7.875 6.625"
      stroke="#FDFCFF"
      strokeWidth="0.875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.125 8.375L1.75 12.75"
      stroke="#FDFCFF"
      strokeWidth="0.875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
