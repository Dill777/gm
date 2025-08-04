import React, { FC } from "react";
import { SVGProps } from "..";

export const WrapcastColorIcon: FC<SVGProps> = ({ className }) => (
  <svg
    width="42"
    height="42"
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="42" height="42" rx="21" fill="black" />
    <path
      d="M27.1196 14L25.1874 21.2563L23.249 14H18.7881L16.8312 21.3097L14.8806 14H9.7998L14.521 30.0436H18.9043L21.0003 22.5936L23.0962 30.0436H27.489L32.1998 14H27.1196Z"
      fill="white"
    />
  </svg>
);
