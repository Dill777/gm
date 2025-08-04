import { useMemo } from "react";
import { parseEther } from "viem";
import { NETWORKS } from "@/config/chains";
import { CONTRACTS } from "@/config/contracts";
import usePriceCredit from "../usePriceCredit";
import { useContractWithStatus } from "../core/useWriteContractWithStatus";
import { useAccount } from "wagmi";

export const useMintGiftCard = (
  chainId: NETWORKS | null,
  address: string,
  count: number,
  message: string = "",
  successCallback?: () => void
) => {
  const { priceInUSD } = usePriceCredit();

  const creditPrice = useMemo(() => {
    return priceInUSD !== 0 ? count / priceInUSD : 0;
  }, [priceInUSD, count]);

  const args = useMemo(
    () => ({
      contract: CONTRACTS.GIFTCARD,
      functionName: "mintGiftCard",
      chainId,
      value: parseEther(creditPrice.toString()),
      args: [address],
    }),
    [address, chainId, creditPrice]
  );

  return useContractWithStatus(chainId, args, message, successCallback);
};

export const useBurnGiftCard = (
  chainId: NETWORKS | null,
  tokenId: string,
  successCallback?: () => void
) => {
  const args = useMemo(
    () => ({
      contract: CONTRACTS.GIFTCARD,
      functionName: "burnGiftCard",
      chainId,
      args: [tokenId],
    }),
    [tokenId, chainId]
  );

  return useContractWithStatus(
    chainId,
    args,
    "Gift card redeemed successfully",
    successCallback
  );
};

export const useTransferGiftCard = (
  chainId: NETWORKS | null,
  tokenId: string,
  recipient: string,
  message: string = "Gift card transferred successfully",
  successCallback?: () => void
) => {
  const { address } = useAccount();

  const args = useMemo(
    () => ({
      contract: CONTRACTS.GIFTCARD,
      functionName: "safeTransferFrom",
      chainId,
      args: [address, recipient, tokenId],
    }),
    [address, recipient, tokenId, chainId]
  );

  return useContractWithStatus(chainId, args, message, successCallback);
};
