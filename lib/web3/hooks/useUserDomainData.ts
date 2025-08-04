import { useCallback, useMemo } from "react";
import { isEmpty } from "lodash";
import { RegisterDomainType, UserDomainConfigType } from "@/lib/model/domain";
import { CONTRACTS } from "@/config/contracts";
import { useNetworksCall } from "./core/useNetworksCall";
import { useMultiReadCall } from "./core/useMultiReadCall";
import { UserDomainType } from "@/lib/store/slices/user-domains";

export const useUserDomainData = (address: string) => {
  const { multicall } = useMultiReadCall();

  const userLookupCall = useMemo(
    () => ({
      contract: CONTRACTS.REGISTRY,
      functionName: "userLookupByAddress",
      args: [address],
    }),
    [address]
  );

  const { callContract: fetchUserDomains } =
    useNetworksCall<UserDomainConfigType>(userLookupCall);

  const fetchUserDomainData = useCallback(async () => {
    if (!isEmpty(address)) {
      const userDomainIds = await fetchUserDomains();
      const domainDataPromise = userDomainIds.map(async (item) => {
        if (!item.data) {
          return null;
        }
        const primaryDomain = item.data.primaryDomain;
        const _domainsCallDataByNetwork = item.data.allOwnedDomains.map(
          (domainId) => {
            return {
              domainId,
              contract: CONTRACTS.REGISTRY,
              functionName: "registryLookupById",
              args: [Number(domainId)],
            };
          }
        );

        const registryInfo = await multicall(
          _domainsCallDataByNetwork,
          item.chainId
        );

        const userDomainDataPromise = _domainsCallDataByNetwork.map(
          async (_data, idx) => {
            const registration = registryInfo
              ? (registryInfo[idx].result as RegisterDomainType)
              : ({} as RegisterDomainType);
            const domainId = _data.domainId.toString();
            const chainId = item.chainId;

            return {
              ...registration,
              domainId,
              chainId: chainId,
              isPrimary: domainId === primaryDomain.toString(),
              expirationDate: registration?.expirationDate.toString() ?? "",
            } as UserDomainType;
          }
        );

        return await Promise.all(userDomainDataPromise);
      });

      const data = (await Promise.all(domainDataPromise))
        .filter(Boolean)
        .flat();
      return data as UserDomainType[];
    } else {
      return null;
    }
  }, [address, userLookupCall]);

  return { fetchUserDomainData };
};
