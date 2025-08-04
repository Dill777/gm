import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useReadCallNFTContract } from "@/lib/web3/hooks/core/useReadCallNFT";
import { NFTS } from "@/config/nfts";

export const useCheckBalanceNFT = (
  nft_type: NFTS,
  successCallback?: () => void
) => {
  const { callNFTContract } = useReadCallNFTContract();
  const [hasNFT, setHasNFT] = useState(false);

  useEffect(() => {
    const getBalance = async () => {
      try {
        const balance = await callNFTContract(nft_type);
        const hasBalance = balance && Number(balance) > 0;
        setHasNFT(!!hasBalance);
        if (hasBalance && successCallback) {
          successCallback();
        }
      } catch (error) {
        console.error("Error checking NFT balance:", error);
        toast.error("Failed to check NFT balance");
      }
    };
    getBalance();
  }, [nft_type, callNFTContract, successCallback]);

  return { hasNFT };
};
