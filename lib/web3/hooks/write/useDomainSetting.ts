import { useMemo } from "react";
import { useAccount } from "wagmi";
import { NETWORKS } from "@/config/chains";
import { CONTRACTS } from "@/config/contracts";
import { useContractWithStatus } from "../core/useWriteContractWithStatus";

export const useSetPrimaryDomain = (
  domainId: string,
  chainId: NETWORKS | null,
  successCallback?: () => void
) => {
  const args = useMemo(
    () => ({
      contract: CONTRACTS.REGISTRY,
      functionName: "setPrimaryDomain",
      args: [Number(domainId)],
      chainId,
    }),
    [domainId, chainId]
  );

  return useContractWithStatus(
    chainId,
    args,
    "Transaction successful! Domain is setup as Primary",
    successCallback
  );
};

export const useDomainTransfer = (
  domainId: string,
  chainId: NETWORKS | null,
  transferAddress: string,
  successCallback: () => void
) => {
  const { address } = useAccount();

  const args = useMemo(
    () => ({
      contract: CONTRACTS.REGISTRY,
      functionName: "transferFrom",
      args: [address, transferAddress, domainId],
      chainId,
    }),
    [address, transferAddress, domainId, chainId]
  );

  return useContractWithStatus(
    chainId,
    args,
    "Transaction successful! Your Domain has been transferred",
    successCallback
  );
};

export const useDomainBurn = (
  domainId: string,
  chainId: NETWORKS | null,
  successCallback: () => void
) => {
  const args = useMemo(
    () => ({
      contract: CONTRACTS.REGISTRY,
      functionName: "burnDomain",
      args: [domainId],
      chainId,
    }),
    [domainId, chainId]
  );

  return useContractWithStatus(
    chainId,
    args,
    "Transaction successful! Your Domain has been burned",
    successCallback
  );
};

export const useDomainRenew = (
  domainId: string,
  chainId: NETWORKS | null,
  renewPrice: bigint,
  count: number,
  successCallback?: () => void
) => {
  const args = useMemo(
    () => ({
      contract: CONTRACTS.REGISTRY,
      functionName: "renewDomain",
      chainId,
      value: renewPrice * BigInt(count),
      args: [domainId, count],
    }),
    [renewPrice, domainId, chainId, count]
  );

  return useContractWithStatus(
    chainId,
    args,
    "Transaction successful! Your Domain has been renewed",
    successCallback
  );
};
