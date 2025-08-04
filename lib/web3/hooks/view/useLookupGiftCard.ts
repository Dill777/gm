import { useCallback, useMemo } from "react";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { CONTRACTS } from "@/config/contracts";
import { useMultiReadCall } from "../core/useMultiReadCall";
import { useReadCall } from "../core/useReadCall";

const useLookupGiftCard = () => {
  const { address, chainId } = useAccount();
  const { callContract } = useReadCall();
  const { multicall } = useMultiReadCall();

  const call = useMemo(
    () => ({
      contract: CONTRACTS.GIFTCARD,
      functionName: "getUserOwnedGiftCards",
      args: [address],
    }),
    [address]
  );
  const fetchUserGiftsCards = useCallback(async () => {
    if (address) {
      const data = await callContract(call, chainId);
      const giftcards = (!!data ? data : []) as bigint[];

      const contractCallCredits: any = giftcards.map(
        (giftCardId) =>
          ({
            contract: CONTRACTS.GIFTCARD,
            functionName: "giftCardBalances",
            args: [giftCardId],
          } as const)
      );
      const creditData = await multicall(contractCallCredits, chainId);
      if (!creditData) {
        return null;
      }

      const userGiftCards = giftcards.map((id: bigint, index: number) => ({
        id: id.toString(),
        credits: formatEther(
          (creditData[index]?.result as bigint) ?? BigInt(0)
        ),
      }));
      return userGiftCards;
    }
    return null;
  }, [callContract, call, chainId, address]);

  return { fetchUserGiftsCards };
};

export default useLookupGiftCard;
