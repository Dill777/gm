"use client";
import React, { useMemo, useState } from "react";
import Image from "@/ui/components/image";
import { cn, getDomainUrl } from "@/utils";
import { isChainSupported, isSvgSupported, NETWORKS } from "@/config/chains";
import ChainLogo from "../chain-logo";

type DomainAvatarType = {
  chainId?: NETWORKS | null;
  domainId?: string;
  className?: string;
};

const DomainAvatar = ({ chainId, domainId, className }: DomainAvatarType) => {
  const [error, setError] = useState(false);
  const isValid = useMemo(
    () =>
      !error &&
      !!Number(domainId) &&
      isChainSupported(chainId ?? 0) &&
      isSvgSupported(chainId ?? 0),
    [chainId, domainId, error]
  );
  const url = useMemo(
    () => getDomainUrl(chainId, domainId),
    [chainId, domainId]
  );

  return (
    <>
      {!isValid ? (
        <ChainLogo
          chainId={chainId}
          className={cn("w-[62px] h-[62px] shrink-0", className)}
        />
      ) : (
        <Image
          src={url}
          alt=""
          width={250}
          height={250}
          onError={() => setError(true)}
          className={cn("w-[62px] h-[62px] shrink-0 rounded-full", className)}
        />
      )}
    </>
  );
};

export default DomainAvatar;
