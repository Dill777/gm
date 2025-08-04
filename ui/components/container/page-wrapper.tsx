import React, { FC } from "react";
import { cn } from "@/utils";

const PageWrapper: FC<ComponentProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex flex-col pt-[120px] mobile:pt-[90px] space-y-12 small:space-y-8",
        className
      )}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
