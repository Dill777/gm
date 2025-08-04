import { useCallback, useMemo } from "react";
import { formatEther } from "viem";
import { useAppSelector } from "@/lib/store";
import { CONTRACTS } from "@/config/contracts";
import { getChainByID } from "@/config/chains";
import { useMultiReadCall } from "../core/useMultiReadCall";
import { Domain } from "@/lib/model/domain";

export const useCartData = () => {
  const carts = useAppSelector((state) => state.setting.carts);

  const calls = useMemo(() => {
    return carts.map((item) => {
      const { domainName } = item;
      const domain = domainName ?? "";
      return {
        call: [
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
          {
            contract: CONTRACTS.REGISTRY,
            functionName: "priceToRenew",
            args: [domain.length],
          },
        ],
        ...item,
      };
    });
  }, [carts]);

  const { multicall } = useMultiReadCall();

  const fetchCartDomainDetail = useCallback(async () => {
    const contractDataPromises = calls.map(async (call) => {
      const {
        call: callData,
        domainName,
        chainId,
        year,
        isCategory,
        categoryKey,
      } = call;

      const data = await multicall(callData, chainId);
      if (!data) {
        return null;
      }

      const [id, price, reNewPrice] = data;
      const domainId = (id.result ?? "") as string;
      const { nativeCurrency } = getChainByID(chainId);
      const priceInEther = formatEther((price.result ?? 0) as bigint);
      const reNewPriceInEther = formatEther((reNewPrice.result ?? 0) as bigint);

      return {
        id: domainId.toString(),
        domainName: domainName,
        chainId: chainId,
        price: priceInEther,
        reNewPrice: reNewPriceInEther,
        symbol: nativeCurrency.symbol,
        year,
        isCategory,
        categoryKey,
      };
    });

    return await Promise.all(contractDataPromises);
  }, [calls]);
  return { fetchCartDomainDetail };
};

export const useDomainData = () => {
  const { multicall } = useMultiReadCall();

  const fetchDomainDetail = useCallback(async (domains: Domain[]) => {
    const calls = domains.map((item) => {
      const { domainName } = item;
      const domain = domainName ?? "";
      return {
        call: [
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
        ...item,
      };
    });

    const contractDataPromises = calls.map(async (call) => {
      const { call: callData, domainName, chainId } = call;

      const data = await multicall(callData, chainId);
      if (!data) {
        return null;
      }

      const [id, price] = data;
      const domainId = id.result as string;
      const { nativeCurrency } = getChainByID(chainId);
      const priceInEther = formatEther((price.result ?? 0) as bigint);

      return {
        id: domainId.toString(),
        domainName: domainName,
        chainId: chainId,
        price: priceInEther,
        symbol: nativeCurrency.symbol,
      };
    });

    return await Promise.all(contractDataPromises);
  }, []);
  return { fetchDomainDetail };
};
