import React, { FC } from "react";
import { SVGProps } from "..";

export const TwitterIcon: FC<SVGProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M18.0097 2.4082H21.2145L14.213 10.4105L22.4497 21.2998H16.0004L10.9491 14.6955L5.16924 21.2998H1.96251L9.45135 12.7405L1.5498 2.4082H8.16284L12.7288 8.4448L18.0097 2.4082ZM16.885 19.3816H18.6608L7.19791 4.22567H5.29228L16.885 19.3816Z"
      fill="white"
    />
  </svg>
);
