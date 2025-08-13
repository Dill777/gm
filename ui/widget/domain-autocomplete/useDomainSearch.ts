"use client";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { chains, getChainColor, mainnets, NETWORKS } from "@/config/chains";
import { useDomainAvaliables } from "@/lib/web3/hooks/view/useDomainAvaliables";
import { toDomainUrl, validateForDomain } from "@/utils/string-helper";
import { useDebouncedCall } from "@/utils/useDebouncedCall";
import { tlds } from "@/config/tld";

export const useDomainSearch = () => {
  const router = useRouter();
  const [searchInputText, setSearchInputText] = useState("");
  const [isAutoCompleteOpen, setIsAutoCompleteOpen] = useState(true);

  const searchedDomain = useMemo(() => {
    return toDomainUrl(searchInputText);
  }, [searchInputText]);

  const { isLoading, domainAvaliables } = useDomainAvaliables(
    searchedDomain,
    true
  );

  const options = useMemo(() => {
    const availableDomains = domainAvaliables || [];
    return mainnets
      .filter((chain) => !chains.find((c) => c.id === chain)?.gmOnly)
      .map((chain) => {
        const domain = availableDomains.find((item) => item.chainId === chain);
        const tld = tlds.find((tld) => tld.chainId === chain)?.label;
        const chainColor = getChainColor(chain);
        const iconUrl = chains.find((c) => c.id === chain)?.iconUrl ?? "";

        return {
          label: `${searchedDomain}.${tld}`,
          domain: searchedDomain,
          tld,
          chain: chain,
          status: !domain?.data.domainName,
          color: chainColor,
          iconUrl,
        };
      });
  }, [searchedDomain, domainAvaliables]);

  const debouncedAlert = useDebouncedCall(
    () => {
      toast.error("Search limited to first 24 characters for security");
    },
    1000,
    {
      leading: true,
      trailing: false,
    }
  );
  const debouncedNotEnglish = useDebouncedCall(
    () => {
      toast.error("Please switch to English keyboard!");
    },
    300,
    {
      leading: true,
      trailing: false,
    }
  );

  const onInputUpdate = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isAutoCompleteOpen) setIsAutoCompleteOpen(true);
      let inputText = e.target.value;

      // Regex to match non-English characters or emojis, excluding common symbols
      const nonEnglishRegex = /[^a-zA-Z0-9\s.,!?;:'"()\-]/;
      if (nonEnglishRegex.test(inputText)) {
        debouncedNotEnglish();
        return;
      }

      const isValid = validateForDomain(inputText);
      if (inputText.length > 24) {
        debouncedAlert();
        return;
      }
      if (isValid) {
        setSearchInputText(inputText);
      }
    },
    [isAutoCompleteOpen, debouncedAlert]
  );

  const navigateDomain = useCallback((_domain: string, _chain?: NETWORKS) => {
    const urlParams = new URLSearchParams();
    urlParams.set("tab", "smart");
    urlParams.set("domain", _domain);
    if (_chain) urlParams.set("chain", _chain.toString());
    if (_domain === "") {
      window.open(`https://zns.bio/search?tab=smart`, "_blank");
    } else {
      window.open(`https://zns.bio/search?${urlParams}`, "_blank");
    }
    setIsAutoCompleteOpen(false);
    setSearchInputText(_domain);
  }, []);

  const onAutoComplete = useCallback((isComplete: boolean) => {
    setIsAutoCompleteOpen(isComplete);
  }, []);

  return {
    options,
    isLoading,
    searchInputText,
    searchedDomain,
    isAutoCompleteOpen,
    setSearchInputText,
    onAutoComplete,
    navigateDomain,
    onInputUpdate,
  };
};
