import React, { FC } from "react";
import { SVGProps } from ".";

export const ShareIcon: FC<SVGProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    className={className}
  >
    <path
      d="M11.6668 7.00033L7.9335 2.91699V4.95866C6.06683 4.95866 2.3335 6.18366 2.3335 11.0837C2.3335 10.4029 3.4535 9.04199 7.9335 9.04199V11.0837L11.6668 7.00033Z"
      stroke={className === "text_normal" ? "#F4F4F5" : "#243300"}
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
