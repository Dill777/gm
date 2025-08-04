import { useMemo } from "react";
import { tlds } from "@/config/tld";

export const useValidDomain = (domain: string) => {
  return useMemo(() => {
    const firstDotIndex = domain.indexOf(".");
    if (firstDotIndex === -1 || firstDotIndex === domain.length - 1) {
      return { isValid: false, domain: null, chain: null };
    }

    // Get the TLD part which is the last part after the first dot
    const domainName = domain.slice(0, firstDotIndex);
    const possibleTld = domain.slice(firstDotIndex + 1).toLowerCase();
    // Find the TLD in the list
    const currentTld = tlds.find(
      (t) => t.tld.toLowerCase() === possibleTld.toLowerCase()
    );

    if (!currentTld) {
      return { isValid: false, domain: null, chain: null };
    } else {
      return {
        isValid: !!domainName && !!currentTld.chainId,
        tld: currentTld.label,
        domain: domainName,
        chain: currentTld.chainId,
      };
    }
  }, [domain]);
};
