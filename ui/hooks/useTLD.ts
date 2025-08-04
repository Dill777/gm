import { useMemo } from "react";
import { NETWORKS } from "@/config/chains";
import { tlds } from "@/config/tld";

export const useTLD = (chainId?: NETWORKS | string) => {
  return useMemo(() => {
    return (
      tlds.find((tld) => tld.chainId === (chainId as NETWORKS))?.label ?? ""
    );
  }, [chainId]);
};
