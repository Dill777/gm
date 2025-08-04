import { useCallback } from "react";
import { CONTRACTS } from "@/config/contracts";
import { useReadCall } from "../core/useReadCall";

import {
  RegisterDomainType,
  UserDomainConfigType,
  convertUserDomainConfig,
} from "@/lib/model/domain";
import { NETWORKS } from "@/config/chains";

export const useUserDomainInfo = (
  address: string | undefined,
  chainId?: NETWORKS
) => {
  const { callContract } = useReadCall();
  const fetchUserDomainInfo = useCallback(async () => {
    if (address) {
      const userData = (await callContract(
        {
          contract: CONTRACTS.REGISTRY,
          functionName: "userLookupByAddress",
          args: [address],
        },
        chainId
      )) as UserDomainConfigType | null;
      if (!userData) return null;
      const primaryDomainId = userData.primaryDomain;
      const domain = (await callContract(
        {
          contract: CONTRACTS.REGISTRY,
          functionName: "registryLookupById",
          args: [primaryDomainId],
        },
        chainId
      )) as RegisterDomainType;

      domain.expirationDate = domain.expirationDate.toString();

      if (!domain) return null;
      return {
        userDomainConfig: convertUserDomainConfig(userData),
        userPrimaryDomain: domain,
      };
    }
  }, [address, chainId, callContract]);

  return { fetchUserDomainInfo };
};
