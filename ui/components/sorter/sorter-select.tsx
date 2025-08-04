import { cn } from "@/utils";
import React, { FC, Fragment } from "react";
import { SortMode } from ".";
import { SortOption } from "./multiple";

const SorterSelect: FC<{
  mode?: SortMode;
  sort?: string;
  options: SortOption[];
  onSort?: (id: string) => (mode: SortMode) => void;
}> = ({ mode: currentMode, sort, options, onSort }) => {
  const handleSortMode = (key: string) => {
    let newMode: SortMode;
    if (!key) newMode = "none";
    else if (key !== sort) newMode = "asc";
    else if (currentMode === "asc") {
      newMode = "desc";
    } else if (currentMode === "desc") {
      newMode = "none";
    } else {
      newMode = "asc";
    }

    onSort && onSort(key)(newMode);
  };

  return (
    <div className="bg-main-200 rounded-xl p-2 px-4 space-y-2 w-max text-sm shadow-xl">
      <p className="hover:text-primary" onClick={() => handleSortMode("")}>
        None
      </p>
      {options.map((item, index) => (
        <Fragment key={`multisorter_${item.key}_${index}`}>
          <p
            key={`multisorter_${item.key}_${item.key}`}
            className={cn(
              "hover:text-primary",
              sort === item.key ? "text-primary" : ""
            )}
            onClick={() => handleSortMode(item.key)}
          >
            {item.text}
          </p>
        </Fragment>
      ))}
    </div>
  );
};

export default SorterSelect;
