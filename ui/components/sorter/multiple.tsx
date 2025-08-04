import React, { FC, useMemo } from "react";
import { cn } from "@/utils";
import Popover from "../popover";
import SorterSelect from "./sorter-select";
import { SortMode } from ".";

export type SortOption = { key: string; label: string; text: string };

type MultiSorterProps = Omit<ComponentProps, "children"> & {
  onSort?: (id: string) => (mode: SortMode) => void;
  options: SortOption[];
  mode?: SortMode;
  sort?: string;
  children: (label: string) => React.ReactNode;
};

const MultiSorter: FC<MultiSorterProps> = ({
  className,
  onSort,
  options,
  sort = "",
  mode = "none",
  children,
}) => {
  const currentOption = useMemo(
    () => options.find((item) => item.key === sort) ?? options[0],
    [options]
  );
  const currentMode = useMemo(() => {
    if (sort === currentOption.key) {
      return mode;
    } else return "none";
  }, [sort, mode, currentOption]);

  return (
    <div>
      <Popover
        content={
          <SorterSelect
            sort={sort}
            mode={mode}
            onSort={onSort}
            options={options}
          />
        }
        contentClassName="left-0"
      >
        {() => (
          <div
            className={cn(
              "flex justify-center items-center space-x-1 cursor-pointer",
              className
            )}
          >
            {children(currentOption.label)}
            <div className="flex flex-col -space-y-[2px] text-white">
              <div
                className={cn(
                  "flex items-center justify-center bg-transparent duration-75 rounded-none w-[6px] h-1",
                  currentMode === "desc" ? "opacity-80" : "opacity-20"
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
        )}
      </Popover>
    </div>
  );
};

export default MultiSorter;
