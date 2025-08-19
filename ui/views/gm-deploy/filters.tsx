"use client";
import React, { useState } from "react";
import { cn } from "@/utils";
import Image from "@/ui/components/image";
import { Input } from "@/ui/components/input";
import Select from "@/ui/components/select";

interface GMDeployFiltersProps {
  onSearchChange?: (searchTerm: string) => void;
  onFilterChange?: (filter: string) => void;
}

const GMDeployFilters = ({
  onSearchChange,
  onFilterChange,
}: GMDeployFiltersProps) => {
  const [activeFilter, setActiveFilter] = useState("Mainnets");
  const [searchChains, setSearchChains] = useState("");

  const filters = ["Mainnets", "Testnets", "Favourites", "Hot", "All"];

  // Transform filters array into options format for Select component
  const filterOptions = filters.map((filter) => ({
    value: filter,
    label: filter,
  }));

  const handleSearchChainsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setSearchChains(value);
    onSearchChange?.(value);
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  };

  const handleFilterSelectChange = (value: string) => {
    setActiveFilter(value);
    onFilterChange?.(value);
  };

  const handleSearchSubmit = () => {
    // Handle search logic here
    console.log("Searching for chains:", searchChains);
    onSearchChange?.(searchChains);
  };

  return (
    <div className="flex items-center justify-between mb-8 gap-4">
      {/* Desktop filters - horizontal layout */}
      <div className="flex desktop:hidden items-center gap-4">
        {filters.map((filter) => (
          <div
            key={`filter_${filter}`}
            onClick={() => handleFilterClick(filter)}
            className={cn(
              "bg-white rounded-xl overflow-hidden border shadow-shadow2",
              activeFilter === filter ? "border-primary" : "border-white"
            )}
          >
            <div
              className={cn(
                "relative flex items-center justify-between gap-2 px-6 py-3 w-fit min-w-max bg-transparent cursor-pointer group",
                "mobile:space-x-0 mobile:px-1.5 mobile:justify-evenly",
                activeFilter === filter && "bg-primary/20"
              )}
            >
              <span
                className={cn(
                  "w-2 h-2 rounded-full bg-text_body group-hover:bg-primary",
                  activeFilter === filter && "bg-primary"
                )}
              />
              <p
                className={cn(
                  "text-sm font-medium group-hover:text-primary",
                  "tablet:text-xs text-text_body",
                  activeFilter === filter && "text-primary"
                )}
              >
                {filter}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile/Tablet filters - dropdown select */}
      <div className="hidden desktop:block relative z-50 flex-1">
        <Select
          options={filterOptions}
          value={activeFilter}
          onChange={handleFilterSelectChange}
          placeholder="Select filter"
          className={cn(
            "border-transparent rounded-2xl bg-white px-3 py-[9px]",
            "text-sm font-medium text-text3/60",
            "min-w-[120px] h-[43px]"
          )}
        />
      </div>

      <div className="bg-gradient_cheap_primary rounded-2xl p-[1px] overflow-hidden">
        <div className="relative bg-white rounded-2xl overflow-hidden">
          <Input
            value={searchChains}
            onChange={handleSearchChainsChange}
            type="search"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchSubmit();
            }}
            placeholder="Search chains"
            className={cn(
              "border-none rounded-2xl px-3 py-[9px] pr-8",
              "placeholder:text-text_body outline-none bg-transparent",
              "text-sm text-black"
            )}
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={handleSearchSubmit}
          >
            <Image src="/img/search.svg" alt="search" width={16} height={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GMDeployFilters;
