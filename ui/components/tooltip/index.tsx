import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils";

export interface TooltipProps {
  content: string;
  className?: string;
  wrapperClassName?: string;
  children?: React.ReactNode;
  direction?: "right" | "left";
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  className,
  wrapperClassName,
  direction = "left",
  children,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div
      className={cn("relative inline-block", wrapperClassName)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
            x: direction === "left" ? "0" : "100%",
          }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            "absolute bg-black/50 text-xs border border-main-200 p-2 rounded-lg text-nowrap z-[1] -bottom-[105%] -right-[50%] w-max h-max",
            className
          )}
        >
          {content.split("\n").map((value, index) => (
            <p key={index}>
              {value}
              <br />
            </p>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Tooltip;
