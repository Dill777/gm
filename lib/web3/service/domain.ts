import { CONTRACTS } from "@/config/contracts";
import { callContract } from "./core/callContract";
import { NETWORKS } from "@/config/chains";
import { RegisterDomainType, UserDomainConfigType } from "@/lib/model/domain";

export const getDomainId = async (domain: string, chainId: NETWORKS) => {
  const domainId = await callContract(
    {
      contract: CONTRACTS.REGISTRY,
      functionName: "domainLookup",
      args: [domain],
    },
    chainId
  );

  return domainId;
};

export const getUserConfigByAddress = async (
  address: string,
  chainId: NETWORKS
) => {
  const userConfig = await callContract(
    {
      contract: CONTRACTS.REGISTRY,
      functionName: "userLookupByAddress",
      args: [address],
    },
    chainId
  );

  return userConfig as UserDomainConfigType | null;
};

export const getTotalDomains = async (chainId: NETWORKS) => {
  const totalDomains = await callContract(
    {
      contract: CONTRACTS.REGISTRY,
      functionName: "getTotalRegisteredDomains",
    },
    chainId
  );

  return totalDomains as bigint[];
};

export const getDomainById = async (domainId: number, chainId: NETWORKS) => {
  const domainInfo = await callContract(
    {
      contract: CONTRACTS.REGISTRY,
      functionName: "registryLookupById",
      args: [domainId],
    },
    chainId
  );

  return domainInfo as RegisterDomainType;
};
