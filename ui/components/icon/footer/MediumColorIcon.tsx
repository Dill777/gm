import React, { FC } from "react";
import { SVGProps } from "..";
import { cn } from "@/utils";

export const MediumColorIcon: FC<SVGProps> = ({ className }) => (
  <div
    className={cn(
      "bg-[url('/img/footer/medium.png')] bg-[lightgray_-3.321px_-2.963px] bg-cover bg-no-repeat",
      className
    )}
    style={{ backgroundSize: "110% 110%" }}
  ></div>
);
