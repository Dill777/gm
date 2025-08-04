"use client";
import React from "react";
import { Autocomplete } from "@mui/material";
import { MdOutlineSearch as Search } from "react-icons/md";
import { useDomainSearch } from "./useDomainSearch";
import { loader } from "./auto-loader";
import { cn } from "@/utils";
import Image from "@/ui/components/image";

const DomainAutoComplete = () => {
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
            placeholder="Search domain names"
            className="w-full h-[56px] px-6 py-4 text-lg font-normal rounded-2xl border-none outline-none text-black mobile:h-[50px]"
          />
          <button
            type="submit"
            className="absolute right-0 bg-primary h-full w-[110px] rounded-2xl text-black font-semibold text-lg inline-flex items-center justify-center"
            onClick={() => navigateDomain(searchedDomain)}
          >
            <Search className="text-black w-8 h-8" />
          </button>
        </div>
      )}
    />
  );
};

export default DomainAutoComplete;
