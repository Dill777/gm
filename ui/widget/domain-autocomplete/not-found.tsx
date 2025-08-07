"use client";
import React, { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Autocomplete } from "@mui/material";
import { MdOutlineSearch as SearchIcon } from "react-icons/md";
import { useDomainSearch } from "@/ui/widget/domain-autocomplete";
import { loader } from "./auto-loader";
import { cn } from "@/utils";
import Image from "@/ui/components/image";

const NotfoundAutoComplete = () => {
  const searchParams = useSearchParams();

  const search = useMemo(
    () => searchParams.get("domain") ?? "",
    [searchParams]
  );

  const {
    searchInputText,
    searchedDomain,
    isLoading,
    isAutoCompleteOpen,
    options,
    navigateDomain,
    onInputUpdate,
    onAutoComplete,
    setSearchInputText,
  } = useDomainSearch();

  useEffect(() => {
    if (search) {
      setSearchInputText(search);
      onAutoComplete(false);
    }
  }, [search]);

  return (
    <div className="relative w-full max-w-[488px] mx-auto">
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
                "self-stretch flex items-center justify-between px-5 py-2.5 h-[47px] rounded-xl",
                "bg-light_bg1/60 cursor-pointer"
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
                <p className="font-inter text-sm text-text3/60 text-ellipsis overflow-hidden whitespace-nowrap">
                  {option.domain}
                  <span style={{ color: option.color }}>.{option.tld}</span>
                </p>
              </div>
              {loader(isLoading, option.status)}
            </div>
          );
        }}
        renderInput={(params) => (
          <div ref={params.InputProps.ref} className="w-full">
            <div
              className={cn(
                "w-full h-[58px] p-[1px]",
                "rounded-full relative overflow-hidden",
                "flex items-center justify-center",
                "bg-gradient_cheap_primary backdrop-blur-[2px]"
              )}
            >
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <div className="w-full h-full rounded-full flex items-center">
                  <input
                    {...params.inputProps}
                    value={searchInputText}
                    onChange={onInputUpdate}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") navigateDomain(searchedDomain);
                    }}
                    placeholder="Search Domain Names"
                    className="w-full h-full p-[12px_2rem] text-black text-sm border-none outline-none flex-1 bg-transparent"
                  />
                  <button
                    type="submit"
                    onClick={() => navigateDomain(searchedDomain)}
                    className="flex items-center justify-center bg-primary text-sm m-[7px] p-[12px_13px] rounded-3xl text-white text-center"
                  >
                    <SearchIcon className="w-5 h-5" />
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default NotfoundAutoComplete;
