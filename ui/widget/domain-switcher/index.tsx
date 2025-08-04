"use client";

import React, { useMemo } from "react";
import Image from "@/ui/components/image";
import Popover from "@/ui/components/popover";
import { useAppSelector } from "@/lib/store";
import { ArrowDownIcon } from "@/ui/components/icon/ArrowDownIcon";
import { useTLD } from "@/ui/hooks/useTLD";
import { getChainByID } from "@/config/chains";
import { UserDomainType } from "@/lib/store/slices/user-domains";
import Link from "next/link";
import SearchIcon from "@/ui/components/icon/search/SearchIcon";
import { cn } from "@/utils";

const DomainSwitcher = ({
  manage,
  className,
  contentClassName,
}: {
  manage?: boolean;
  className?: string;
  contentClassName?: string;
}) => {
  const {
    chainId: currentChainId,
    domain: currentDomain,
    tld: currentDomainTld,
    ownerDomains,
  } = useAppSelector((state) => state.profile);
  const currentChain = getChainByID(currentChainId || undefined);

  return (
    <>
      <Popover
        content={<DomainList domains={ownerDomains} manage={manage} />}
        contentClassName="mt-1 w-full"
        className={contentClassName ?? ""}
      >
        {() => (
          <button
            className={cn(
              "flex w-[250px] h-[37px] p-[16px_15px_16px_12px] mobile_md:p-[16px_15px_16px_12px] justify-between items-center rounded-[8px] bg-[#262626] mr-5 mobile_md:mr-2",
              className ?? ""
            )}
          >
            <div className="flex items-center gap-[8px]">
              <Image
                src={currentChain.iconUrl || ""}
                alt={currentChain.name}
                width={18}
                height={18}
                className={
                  "bg-[lightgray] bg-center bg-cover bg-no-repeat rounded-full w-[18px] h-[18px]"
                }
              />
              <div
                className={cn(
                  "text-[#F4F4F5] font-poppins text-sm mobile_md:text-base font-medium leading-[20px] tracking-[0.14px]",
                  "w-[170px] mobile_md:w-[calc(100vw-100px)] overflow-hidden text-ellipsis whitespace-nowrap text-left"
                )}
              >
                {!!currentDomain ? `${currentDomain}.${currentDomainTld}` : ""}
              </div>
            </div>
            <ArrowDownIcon />
          </button>
        )}
      </Popover>
    </>
  );
};

const DomainList = ({
  domains,
  manage,
}: {
  domains: UserDomainType[] | null;
  manage?: boolean;
}) => {
  return (
    <>
      <div className="flex w-full p-[17px_16px] flex-col justify-start items-center gap-[18px] rounded-[12px] border-2 border-[#25212B] bg-black">
        <div className="flex h-[24px] flex-col justify-between items-start self-stretch">
          <div className="flex justify-between items-center self-stretch">
            <span className="text-[rgba(235,237,237,0.90)] font-poppins text-base font-medium leading-[24px]">
              Switch domain
            </span>
            <div className="w-[29px] h-[24px] flex items-center justify-center rounded-[6px] bg-[#262626]">
              <Link href="/search">
                <SearchIcon className="w-[12.5px] h-[12.5px]" />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex py-3 flex-col max-h-[300px] overflow-y-auto overflow-x-hidden justify-start items-center self-stretch rounded-[16px] bg-[#101010]">
          {domains &&
            domains.map((domain) => (
              <DomainListItem
                key={domain.domainId}
                domain={domain}
                manage={manage}
              />
            ))}
        </div>
      </div>
    </>
  );
};

const DomainListItem = ({
  domain,
  manage,
}: {
  domain: UserDomainType;
  manage?: boolean;
}) => {
  const chain = getChainByID(domain.chainId);
  const tld = useTLD(domain.chainId);

  return (
    <>
      <Link
        href={
          manage
            ? `/${domain.domainName}.${tld}?manage=true`
            : `/${domain.domainName}.${tld}`
        }
        className="w-full"
      >
        <button className="flex items-center gap-[8px] hover:bg-bg2 py-2 px-5">
          <Image
            src={chain.iconUrl || ""}
            alt={chain.name}
            width={18}
            height={18}
            className={
              "bg-[lightgray] bg-center bg-cover bg-no-repeat rounded-full"
            }
          />
          <div
            className={cn(
              "text-[#F4F4F5] font-poppins text-sm font-medium leading-[20px] tracking-[0.14px]",
              "w-[198px] text-left overflow-hidden text-ellipsis whitespace-nowrap"
            )}
          >
            {`${domain.domainName}.${tld}`}
          </div>
        </button>
      </Link>
    </>
  );
};

export default DomainSwitcher;
