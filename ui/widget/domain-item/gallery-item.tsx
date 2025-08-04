"use client";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import { AiOutlineEdit } from "react-icons/ai";
import { MdFavoriteBorder, MdOutlineFavorite } from "react-icons/md";
import Link from "@/ui/components/link";
import { useTLD } from "@/ui/hooks/useTLD";
import { Button } from "@/ui/components/button";
import useFavourite from "@/ui/hooks/useFavourite";
import { cn } from "@/utils";
import { useClientRender } from "@/utils/hooks/useClientRender";
import { UserDomainType } from "@/lib/store/slices/user-domains";
import DomainAvatar from "../domain-avatar";
import DomainText from "../domain-text";

export const GalleryDomainItem = ({
  domainName = "",
  domainId,
  owner,
  chainId,
}: UserDomainType) => {
  const tld = useTLD(chainId);
  const { address } = useAccount();
  const isClient = useClientRender();
  const fullDomain = useMemo(() => `${domainName}.${tld}`, [domainName, tld]);
  const domainData = useMemo(
    () => ({ domainName, chainId }),
    [domainName, chainId]
  );

  const { isFavourite, onFavourite } = useFavourite(domainData);

  const profileLink = useMemo(() => {
    return `/${fullDomain}`;
  }, [fullDomain]);

  return (
    <div
      className={cn(
        "flex relative items-center justify-between",
        "px-5 py-2 space-x-2 bg-black/40 rounded-2xl cursor-pointer hover:bg-main-100"
      )}
    >
      <div className="flex items-center space-x-4">
        <DomainAvatar
          chainId={chainId}
          domainId={domainId}
          className="mobile:w-8 mobile:h-8 cursor-pointer rounded-full object-cover shrink-0"
        />
        <Link
          className="text-[22px] mobile:text-base font-medium break-all"
          href={profileLink}
        >
          <DomainText chainId={chainId} domainName={domainName} />
        </Link>
      </div>

      <div className="flex items-center justify-end space-x-5 mobile:space-x-3">
        {address && address == owner ? (
          <Button
            href={`/manage/${domainName}.${tld}`}
            variant="outline"
            size="none"
            className="rounded-lg px-4 py-2 space-x-2 hover:opacity-90 text-sm mobile:p-0 mobile:border-none"
          >
            <AiOutlineEdit className="w-5 h-5" />
            <span className="small:hidden">Edit</span>
          </Button>
        ) : (
          <Button
            href={`/${domainName}.${tld}`}
            size="nm"
            className="text-[13px] w-[113px] small:hidden"
          >
            <span className="small:hidden">Profile</span>
          </Button>
        )}

        <button onClick={onFavourite}>
          {!isClient ? (
            <></>
          ) : isFavourite ? (
            <MdOutlineFavorite className="w-5 h-5 text-favorite" />
          ) : (
            <MdFavoriteBorder className="w-5 h-5 text-favorite" />
          )}
        </button>
      </div>
    </div>
  );
};
