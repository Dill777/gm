import { PropsWithChildren } from "react";
export interface ExtraTWClassProps {
  className?: string;
}

export type ComponentProps = PropsWithChildren<ExtraTWClassProps>;

export interface SVGProps extends ComponentProps {
  width: number;
  height: number;
}
