"use client";
import React from "react";
import Image from "@/ui/components/image";
import { Autocomplete } from "@mui/material";
import { MdOutlineSearch as SearchIcon } from "react-icons/md";
import { useDomainSearch } from "@/ui/widget/domain-autocomplete";
import { loader } from "./auto-loader";
import { cn } from "@/utils";

const SearchBar = ({ className }: { className?: string }) => {
  const {
    searchInputText,
    searchedDomain,
    isLoading,
    isAutoCompleteOpen,
    options,
    navigateDomain,
    onInputUpdate,
    onAutoComplete,
  } = useDomainSearch();

  return (
    <div
      className={cn("relative flex-1 max-w-[320px] h-[44px]", className ?? "")}
    >
      <Autocomplete
        open={searchedDomain !== "" && isAutoCompleteOpen}
        onBlur={() => onAutoComplete(false)}
        onFocus={() => onAutoComplete(true)}
        options={options}
        renderOption={(_, option) => {
          return (
            <div
              key={option.label}
              className={cn(
                "self-stretch flex items-center justify-between px-5 py-5 h-[47px] rounded-xl",
                "bg-[#101010] hover:bg-[#10101088] cursor-pointer"
              )}
              onClick={() => navigateDomain(option.domain, option.chain)}
            >
              <div className="flex items-center justify-start gap-2 w-[calc(100%_-_100px)]">
                <Image
                  src={option.iconUrl}
                  alt={`chain-avatar-${option.chain}`}
                  width={22}
                  height={22}
                  className={
                    "bg-[lightgray] bg-center bg-cover bg-no-repeat rounded-full w-[22px] h-[22px]"
                  }
                />
                <p className="font-inter text-sm text-text_normal text-ellipsis overflow-hidden whitespace-nowrap">
                  {option.domain}
                  <span style={{ color: option.color }}>.{option.tld}</span>
                </p>
              </div>
              {loader(isLoading, option.status)}
            </div>
          );
        }}
        renderInput={(params) => (
          <div ref={params.InputProps.ref}>
            <input
              {...params.inputProps}
              value={searchInputText}
              onChange={onInputUpdate}
              type="search"
              onKeyDown={(e) => {
                if (e.key === "Enter") navigateDomain(searchedDomain);
              }}
              placeholder="Search domain names"
              className={cn(
                "w-full h-full p-3 pr-8",
                "placeholder:text-text_body border-none outline-none bg-bg2 rounded-2xl",
                "text-sm font-poppins font-normal leading-[150%]"
              )}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => navigateDomain(searchedDomain)}
            >
              <Image
                src="/img/search.svg"
                alt="search"
                width={16}
                height={16}
              />
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default SearchBar;
