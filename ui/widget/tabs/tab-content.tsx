import React, { FC } from "react";
import { GradientText } from "@/ui/components/text";
import { cn } from "@/utils";
import { LoadingIcon } from "@/ui/components/icon/LoadingIcon";
import Helper from "@/ui/components/tooltip/helper";

type TabContentProps = ComponentProps & {
  title?: string;
  helperText?: string;
  subTitle?: React.ReactNode;
  loading?: boolean;
  hasBorder?: boolean;
};

const TabContent: FC<TabContentProps> = ({
  title = "",
  subTitle = "",
  helperText,
  children,
  className,
  loading = false,
  hasBorder = true,
}) => {
  return (
    <div className="w-full">
      {!!title && (
        <div
          className={cn(
            "flex relative uppercase text-[36px] font-medium font-space_grotesk pb-3 small:text-center items-center mobile:text-3xl tablet:justify-center space-x-1",
            hasBorder ? "border-b-2 border-primary/30" : ""
          )}
        >
          <div className="relative">
            <GradientText>{title}</GradientText>

            {!loading && !!subTitle && (
              <p className="absolute text-primary border border-primary/50 rounded-full -top-1 -right-3.5 mobile:-right-5 text-xs p-1 w-5 h-5 flex items-center justify-center">
                <span className="leading-none">{subTitle}</span>
              </p>
            )}
          </div>
          {helperText && (
            <Helper
              content={helperText}
              className="pl-2 small:right-full small:!-translate-x-0 small:bottom-full normal-case"
            />
          )}
          {loading && <LoadingIcon className="text-white-900 ml-2" />}
        </div>
      )}
      <div className={cn("flex flex-col pt-5", className)}>{children}</div>
    </div>
  );
};

export default TabContent;
