import React, { FC } from "react";
import { GradientText } from "../text";
import { cn } from "@/utils";

const PageTitle: FC<ComponentProps & { subTitle?: string }> = ({
  children,
  subTitle,
  className,
}) => {
  return (
    <div
      className={cn(
        "text-[50px] small:text-[44px] mobile:text-[35px] font-semibold uppercase text-center",
        className
      )}
    >
      <GradientText>{children}</GradientText>
      {subTitle && (
        <p className="text-base font-normal font-poppins text-center">
          {subTitle}
        </p>
      )}
    </div>
  );
};

export default PageTitle;
