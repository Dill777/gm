"use client";
import React, { FC, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Autocomplete } from "@mui/material";
import { MdOutlineSearch as SearchIcon } from "react-icons/md";
import { useDomainSearch } from "@/ui/widget/domain-autocomplete";
import { loader } from "./auto-loader";
import { NETWORKS } from "@/config/chains";
import { cn } from "@/utils";
import Image from "@/ui/components/image";

const MobileHeaderAutoComplete: FC<{ handleMenuHide: () => void }> = ({
  handleMenuHide,
}) => {
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

  const navigate = (_domain: string, _chain?: NETWORKS) => {
    handleMenuHide();
    navigateDomain(_domain, _chain);
  };

  return (
    <div className="relative border border-white-400 rounded-full">
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
                if (e.key === "Enter") navigate(searchedDomain);
              }}
              placeholder="Search Domain Names"
              className="w-full h-10 pl-4 pr-12 py-[10px] text-xs font-normal placeholder:text-white-500 border-none outline-none bg-transparent"
            />
            <button
              type="submit"
              onClick={() => navigate(searchedDomain)}
              className="absolute right-0 bg-primary rounded-full text-center w-10 h-10 inline-flex items-center justify-center"
            >
              <SearchIcon className="text-black w-5 h-5" />
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default MobileHeaderAutoComplete;
