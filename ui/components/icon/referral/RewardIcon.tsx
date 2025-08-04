import { cn } from "@/utils";

interface Props {
  vertical?: boolean;
  fill: string;
  stroke: string;
  top?: string;
  left?: string;
  className?: string;
}
export const RewardIcon = ({
  vertical,
  fill,
  stroke,
  top,
  left,
  className,
}: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      className={cn(
        vertical
          ? "-translate-x-1/2 -translate-y-1/2 left-1/2"
          : "-translate-x-1/2 -translate-y-1/2 top-1/2",
        className ?? ""
      )}
      style={vertical ? { top } : { left }}
    >
      <circle cx="5.5" cy="5.5" r="4.5" fill={fill} />
      <circle cx="5.5" cy="5.5" r="4.5" stroke={stroke} strokeWidth="2" />
    </svg>
  );
};
