import { cn } from "@/utils";
import { VariantProps, cva } from "class-variance-authority";
import React, { FC } from "react";

const loadingVariants = cva("bg-white-300 animate-pulse rounded-sm", {
  variants: {
    variant: {
      default: "w-[120px] h-5",
      button: "w-[113px] h-[42px] rounded-2xl",
      avatar: "w-[62px] h-[62px] rounded-full",
      icons: "w-10 h-10 tablet:w-8 tablet:h-8 rounded-xl",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type BaseType = ComponentProps & {
  loading: boolean;
  count?: number;
};

export interface LoadingProps
  extends BaseType,
    VariantProps<typeof loadingVariants> {}

const Loading: FC<LoadingProps> = ({
  className,
  children,
  variant,
  loading,
  count = 1,
}) => {
  return (
    <>
      {loading
        ? new Array(count)
            .fill(" ")
            .map((_, idx) => (
              <p
                key={`loading_${idx}`}
                className={cn(loadingVariants({ variant, className }))}
              ></p>
            ))
        : children}
    </>
  );
};

export default Loading;
