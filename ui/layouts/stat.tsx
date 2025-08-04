"use client";

import React, { useEffect, useRef } from "react";

import { animate, useInView } from "framer-motion";

// export const CountUpStats = () => {
//   return (
//     <div className="mx-auto max-w-3xl px-4 py-20 md:py-24">
//       <h2 className="mb-8 text-center text-base text-indigo-900 sm:text-lg md:mb-16">
//         BUILD TRUST WITH YOUR USERS WITH A<span className="text-indigo-500"> BEAUTIFUL LANDING PAGE</span>
//       </h2>

//       <div className="flex flex-col items-center justify-center sm:flex-row">
//         <Stat num={45} suffix="%" subheading="Lorem ipsum dolor sit amet consectetur" />
//         <div className="h-[1px] w-12 bg-indigo-200 sm:h-12 sm:w-[1px]" />
//         <Stat num={15.5} decimals={1} suffix="K+" subheading="Lorem ipsum dolor sit amet consectetur" />
//         <div className="h-[1px] w-12 bg-indigo-200 sm:h-12 sm:w-[1px]" />
//         <Stat num={20} suffix="B+" subheading="Lorem ipsum dolor sit amet consectetur" />
//       </div>
//     </div>
//   );
// };

export interface StatProps {
  num: number;
  suffix: string;
  decimals?: number;
  sutTitle: string;
}

export default function Stat({
  num,
  suffix,
  decimals = 0,
  sutTitle,
}: StatProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (!isInView) return;

    animate(0, num, {
      duration: 2.5,
      onUpdate(value) {
        if (!ref.current) return;

        ref.current.textContent = Number(
          value.toFixed(decimals)
        ).toLocaleString();
      },
    });
  }, [num, decimals, isInView]);

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-base tablet_md:text-sm font-normal">{sutTitle}</p>
      {!!num && (
        <p className="font-space_grotesk text-[32px] tablet_md:text-[28px] mobile_md:text-2xl font-bold text-primary">
          {/* <span ref={ref}></span> */}
          {num.toLocaleString()}
          {suffix}
        </p>
      )}
    </div>
  );
}
