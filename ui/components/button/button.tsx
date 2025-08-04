"use client";
import * as React from "react";
import Link from "next/link";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/utils";

function isExternalLink(href: string | undefined) {
  return href?.includes("://");
}

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full",
  {
    variants: {
      variant: {
        none: "",
        default: "text-p_950 bg-primary",
        error: "bg-error",
        danger: "bg-danger",
        success: "bg-success",
        warning: "bg-warning text-black",
        verified: "bg-verified",
        outlineVerified: "border border-verified text-verified",
        dark: "text-main-400 bg-main-300",
        outline: "border border-primary text-primary",
        loading: "animate-pulse bg-white-300",
        darkGradient:
          "border border-main-300 bg-primary_gradient_button text-primary",
        primaryGraident:
          "border border-main-300 bg-primary_gradient_tab text-primary",
        blueGraident:
          "border border-main-300 bg-primary_gradient_button text-primary",
        redGraident:
          "border border-main-300 bg-primary_gradient_button text-primary",
      },
      size: {
        none: "",
        default: "py-4 px-[38px]",
        md: "p-3 rounded-xl",
        sm: "py-[10px] px-10",
        xs: "py-2 px-3 rounded-md",
        nm: "w-fit rounded-2xl py-3 px-[26px] font-medium",
        rectangle: "w-[132px] h-[35px] rounded-md p-1",
        landingLG:
          "rounded-[53px] h-[60px] mobile:h-[45px] text-2xl desktop:text-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type BaseType = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

export interface ButtonProps
  extends BaseType,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  action?: () => void;
}

const Button = React.forwardRef<
  HTMLButtonElement & HTMLAnchorElement,
  ButtonProps
>(
  (
    { className, variant, href, size, rel, target, loading, onClick, ...props },
    ref
  ) => {
    const isExternal = isExternalLink(href);
    const Component = href ? Link : "button";
    const handleClick = (
      e: React.MouseEvent<HTMLButtonElement> &
        React.MouseEvent<HTMLAnchorElement>
    ) => {
      if (!loading) {
        onClick && onClick(e);
      }
    };

    return (
      <Component
        className={cn(
          loading && "cursor-wait opacity-85",
          buttonVariants({ variant, size, className })
        )}
        href={href ?? ""}
        onClick={handleClick}
        target={target || isExternal ? "_blank" : undefined}
        rel={rel || isExternal ? "noopener noreferrer" : undefined}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
