import React, { FC } from "react";
import { cn } from "@/utils";

interface GradientTextProps extends ComponentProps {
  gradientColor?: string;
  className?: string;
}

const GradientText: FC<GradientTextProps> = ({
  gradientColor,
  className,
  children,
}) => {
  return (
    <p
      className={cn(
        "bg-clip-text text-transparent",
        gradientColor ? gradientColor : "inline bg-primary_gradient_text",
        className
      )}
    >
      {children}
    </p>
  );
};

export default GradientText;
