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
    <div className="relative border border-white-200 bg-white rounded-xl w-full">
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
              onKeyDown={(e) => {
                if (e.key === "Enter") navigateDomain(searchedDomain);
              }}
              placeholder="Search Domain Names"
              className="w-full h-[55px]  p-6 text-base  font-normal text-black placeholder:text-main-400 border-none outline-none bg-transparent"
            />
            <button
              type="submit"
              onClick={() => navigateDomain(searchedDomain)}
              className="absolute w-[155px] small:w-[102px] h-full right-0 bg-primary rounded-xl inline-flex items-center justify-center"
            >
              <SearchIcon className="text-black w-8 h-8" />
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default NotfoundAutoComplete;
