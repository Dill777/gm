import { useEffect, useState } from "react";
import { CONTRACTS } from "@/config/contracts";
import { RegisterDomainType } from "@/lib/model/domain";
import { useDebouncedCall } from "@/utils/useDebouncedCall";
import { ReturnContractType, useNetworksCall } from "../core/useNetworksCall";

export const useDomainAvaliables = (
  domainName: string,
  onlyMainnet?: boolean
) => {
  const [domainAvaliables, setDomainAvaliables] = useState<
    ReturnContractType<RegisterDomainType>[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const { callContract: checkDomainAvaliable } =
    useNetworksCall<RegisterDomainType>({
      contract: CONTRACTS.REGISTRY,
      functionName: "registryLookupByName",
      args: [domainName],
      onlyMainnet,
    });

  const debouncedCheckDomain = useDebouncedCall(async () => {
    const data = await checkDomainAvaliable();
    const filteredData = data.filter(
      (item) => item.data !== null
    ) as ReturnContractType<RegisterDomainType>[];
    setDomainAvaliables(filteredData);
    setIsLoading(false);
  });

  useEffect(() => {
    (async () => {
      if (domainName === "") return;
      setIsLoading(true);
      debouncedCheckDomain();
    })();
  }, [domainName]);

  return { isLoading, domainAvaliables };
};
