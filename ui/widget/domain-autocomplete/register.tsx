"use client";

import React, { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Autocomplete } from "@mui/material";
import { useDomainSearch } from "@/ui/widget/domain-autocomplete";
import { loader } from "./auto-loader";
import { cn } from "@/utils";
import Image from "@/ui/components/image";

const DomainRegisterAutoComplete = () => {
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
    <div className={cn("flex items-center justify-center w-full")}>
      <Autocomplete
        open={searchedDomain !== "" && isAutoCompleteOpen}
        onBlur={() => onAutoComplete(false)}
        onFocus={() => onAutoComplete(true)}
        options={options}
        className="w-fit small:w-full"
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
          <div
            ref={params.InputProps.ref}
            className={cn(
              "w-[544px] h-[57px] small:w-full",
              "rounded-2xl border-[3px] border-stroke/80",
              "relative flex items-center justify-between p-[8px_0px_8px_14px]"
            )}
          >
            <input
              {...params.inputProps}
              value={searchInputText}
              onChange={onInputUpdate}
              onKeyDown={(e) => {
                if (e.key === "Enter") navigateDomain(searchedDomain);
              }}
              placeholder="Search domains"
              className={cn(
                "w-full h-full p-[4px_2px] text-base font-normal placeholder:text-white-500 text-[#858584]",
                "border-none outline-none bg-transparent"
              )}
            />
            {/* <button
              type="submit"
              onClick={() => navigateDomain(searchedDomain)}
              className="absolute w-[190px] tablet:w-[180px] small:w-[55px] h-full right-0 bg-primary rounded-full inline-flex items-center justify-center"
            >
              <SearchIcon className="text-black w-8 h-8" />
            </button> */}
          </div>
        )}
      />
    </div>
  );
};

export default DomainRegisterAutoComplete;
