import React, { forwardRef } from "react";
import { cn } from "@/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "header" | "footer" | "main";
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ as: Component = "div", children, className, ...rest }, ref) => (
    <Component
      className={cn(
        "max-w-[1440px] h-full w-full mx-auto px-16 desktop:px-12 tablet:px-8 mobile:px-6 final:px-4",
        className
      )}
      ref={ref}
      {...rest}
    >
      {children}
    </Component>
  )
);

Container.displayName = "Container";
export default Container;
