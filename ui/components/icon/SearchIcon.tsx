import React, { FC } from "react";
import { SVGProps } from ".";

export const SearchIcon: FC<SVGProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
    className={className}
  >
    <path
      d="M21.5 21L17.15 16.65M19.5 11C19.5 15.4183 15.9183 19 11.5 19C7.08172 19 3.5 15.4183 3.5 11C3.5 6.58172 7.08172 3 11.5 3C15.9183 3 19.5 6.58172 19.5 11Z"
      stroke="#A2A2A2"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
