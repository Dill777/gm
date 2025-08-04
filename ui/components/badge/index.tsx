import React, { FC, PropsWithChildren } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/utils";

const badgeVariants = cva(
  "rounded-full inline-flex items-center justify-center text-[10px] rounded-full",
  {
    variants: {
      variant: {
        default: "bg-verified",
        white: "bg-white",
        success: "bg-success",
      },
      size: {
        default: "h-[15px] w-[15px]",
        md: "h-[18px] w-[18px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type badgeProps = VariantProps<typeof badgeVariants> & {
  className?: string;
};

const Badge: FC<PropsWithChildren<badgeProps>> = ({
  variant,
  size,
  className,
  children,
}) => {
  return (
    <span className={cn(badgeVariants({ variant, size, className }))}>
      {children}
    </span>
  );
};

export default Badge;
