import { useCallback, useEffect, useMemo, useState } from "react";
import { formatEther } from "viem";
import { CONTRACTS } from "@/config/contracts";
import { NETWORKS, getChainByID } from "@/config/chains";
import { RegisterDomainType } from "@/lib/model/domain";
import { useMultiReadCall } from "./core/useMultiReadCall";

type DomainDataType = {
  id: string;
  price: string;
  symbol: string;
};

export const useDomain = (domain: string = "", chainId?: NETWORKS | null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DomainDataType>({
    id: "",
    price: "",
    symbol: "",
  });

  const calls = useMemo(
    () => [
      {
        contract: CONTRACTS.REGISTRY,
        functionName: "domainLookup",
        args: [domain],
      },
      {
        contract: CONTRACTS.REGISTRY,
        functionName: "priceToRegister",
        args: [domain.length],
      },
    ],
    [domain]
  );

  const { multicall } = useMultiReadCall();

  useEffect(() => {
    (async () => {
      if (domain !== "" && chainId) {
        const { nativeCurrency } = getChainByID(chainId);
        setIsLoading(true);
        const _data = await multicall(calls, chainId);
        setIsLoading(false);
        if (!_data) {
          return;
        }
        const [id, price] = _data;

        const domainId = id.result as string;
        const priceInEther = formatEther((price.result ?? 0) as bigint);

        return setData({
          id: domainId,
          price: priceInEther,
          symbol: nativeCurrency?.symbol ?? "",
        });
      }
    })();
  }, [calls, chainId]);

  return { isLoading, ...data };
};

export const useDomainInfo = (
  domain: string = "",
  chainId?: NETWORKS | null
) => {
  const calls = useMemo(
    () => [
      {
        contract: CONTRACTS.REGISTRY,
        functionName: "domainLookup",
        args: [domain],
      },
      {
        contract: CONTRACTS.REGISTRY,
        functionName: "registryLookupByName",
        args: [domain],
      },
      {
        contract: CONTRACTS.REGISTRY,
        functionName: "priceToRenew",
        args: [domain.length],
      },
    ],
    [domain]
  );

  const { multicall } = useMultiReadCall();

  const fetchDomainInfo = useCallback(async () => {
    if (domain !== "" && chainId) {
      const _data = await multicall(calls, chainId);

      if (!_data) {
        return null;
      }
      const [id, registerData, reNewPrice] = _data;

      const domainId = (id?.result as bigint).toString();
      const domainData = registerData.result as RegisterDomainType;
      domainData.expirationDate = (domainData?.expirationDate).toString();
      const _reNewPrice = (reNewPrice.result ?? 0) as bigint;

      const owner = domainData.owner;
      return {
        id: domainId,
        registerData: domainData,
        reNewPrice: Number(_reNewPrice).toString(),
        owner,
      };
    }
  }, [calls, chainId, domain]);

  return { fetchDomainInfo };
};
