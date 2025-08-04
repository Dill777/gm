import { useCallback } from "react";
import { useAccount } from "wagmi";
import { useAppDispatch } from "@/lib/store";
import { setGiftCards } from "@/lib/store/slices/user";

import useLookupGiftCard from "@/lib/web3/hooks/view/useLookupGiftCard";

export const useFetchGiftCard = () => {
  const dispatch = useAppDispatch();
  const { address, chainId } = useAccount();
  const { fetchUserGiftsCards } = useLookupGiftCard();

  const updateStoreGift = useCallback(async () => {
    if (address && chainId) {
      const giftCards = await fetchUserGiftsCards();
      if (giftCards) dispatch(setGiftCards(giftCards));
    } else {
      dispatch(setGiftCards([]));
    }
  }, [address, chainId, fetchUserGiftsCards]);

  return { updateStoreGift };
};
