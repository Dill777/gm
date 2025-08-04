import { cn } from "@/utils";
import React, { FC } from "react";

export type SortMode = "asc" | "desc" | "none";
type SorterProps = ComponentProps & {
  mode: SortMode;
  onSort?: (mode: SortMode) => void;
};
const Sorter: FC<SorterProps> = ({
  onSort,
  children,
  className,
  mode = "none",
}) => {
  const handleSortMode = () => {
    let newMode: SortMode;

    if (mode === "asc") {
      newMode = "desc";
    } else if (mode === "desc") {
      newMode = "none";
    } else {
      newMode = "asc";
    }

    onSort && onSort(newMode);
  };

  return (
    <div
      className={cn(
        "flex justify-center items-center space-x-1 cursor-pointer",
        className
      )}
      onClick={handleSortMode}
    >
      {children}
      <div className="flex flex-col -space-y-[2px] text-white">
        <div
          className={cn(
            "flex items-center justify-center bg-transparent duration-75 rounded-none w-[6px] h-1",
            mode === "desc" ? "opacity-80" : "opacity-20"
          )}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 320 512"
            className="w-6 h-6 flex items-center justify-center bg-transparent duration-75 rounded-none"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"></path>
          </svg>
        </div>
        <div
          className={cn(
            "flex items-center justify-center bg-transparent duration-75 rounded-none w-[6px] h-1",
            mode === "asc" ? "opacity-80" : "opacity-20"
          )}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 320 512"
            className="w-6 h-6 flex items-center justify-center bg-transparent duration-75 rounded-none"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Sorter;
