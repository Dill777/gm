"use client";
import React, { useMemo, useState } from "react";
import Image from "@/ui/components/image";
import { cn } from "@/utils";
import { chains, isChainSupported, NETWORKS } from "@/config/chains";

type ChainLogoType = {
  chainId?: NETWORKS | null;
  className?: string;
};

const ChainLogo = ({ chainId, className }: ChainLogoType) => {
  const [error, setError] = useState(false);
  const isValid = useMemo(
    () => !error && isChainSupported(chainId ?? 0),
    [chainId, error]
  );
  const url = useMemo(
    () => chains.find((c) => c.id === chainId)?.iconUrl ?? "",
    [chainId]
  );

  return (
    <>
      {!isValid ? (
        <Image
          src={"/img/zns-logo.svg"}
          alt="ZNS LOGO"
          width={250}
          height={250}
          className={cn("w-8 h-8 shrink-0", className)}
        />
      ) : (
        <Image
          src={url}
          alt=""
          width={250}
          height={250}
          onError={() => setError(true)}
          className={cn("w-8 h-8 shrink-0 rounded-full", className)}
        />
      )}
    </>
  );
};

export default ChainLogo;
