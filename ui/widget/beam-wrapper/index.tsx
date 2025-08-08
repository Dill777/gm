"use client";
import React, { useEffect } from "react";
import {
  animate,
  useMotionTemplate,
  useMotionValue,
  motion,
} from "framer-motion";
import { cn } from "@/utils";

type BeamWrapperType = ComponentProps & {
  roundClass?: string;
};
export default function BeamWrapper({
  children,
  className,
  roundClass,
}: BeamWrapperType) {
  const turn = useMotionValue(0);

  useEffect(() => {
    animate(turn, 1, {
      ease: "linear",
      duration: 5,
      repeat: Infinity,
    });
  }, []);

  const backgroundImage = useMotionTemplate`conic-gradient(from ${turn}turn, #0177E700 75%, #0177E7 100%)`;

  return (
    <div className={cn(className)}>
      {children}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-10 rounded-lg",
          roundClass
        )}
      >
        <motion.div
          style={{
            backgroundImage,
          }}
          className={cn(
            "mask-with-browser-support absolute -inset-[2px] rounded-lg border border-transparent bg-origin-border",
            roundClass
          )}
        />
      </div>
    </div>
  );
}
