import React from "react";

import { twMerge } from "tailwind-merge";

export interface TitleProps extends ComponentProps {
  name: string;
  description?: string;
}

export default function Title({ name, description, className }: TitleProps) {
  return (
    <div className={twMerge("text-center mb-[50px] small:mb-10", className)}>
      <h1 className="uppercase font-space_grotesk text-[56px] tablet_md:text-[48px] small:text-[36px] mobile:text-[32px] font-bold">
        {name}
      </h1>
      {description && (
        <p className="normalize text-base small:text-sm font-normal">
          {description}
        </p>
      )}
    </div>
  );
}
