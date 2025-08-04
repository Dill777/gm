import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { CONTRACTS } from "@/config/contracts";
import { useReadCall } from "./core/useReadCall";

const usePriceCredit = () => {
  const [priceInUSD, setPriceInUSD] = useState(0);
  const { chainId } = useAccount();

  const call = useMemo(
    () => ({
      contract: CONTRACTS.REGISTRY,
      functionName: "getOraclePrice",
    }),
    []
  );

  const { callContract } = useReadCall();

  useEffect(() => {
    (async () => {
      if (chainId) {
        const data = await callContract(call, chainId);
        const _price = (!!data ? data : BigInt(0)) as bigint;
        const creaditNumber = Number(formatEther(_price));

        setPriceInUSD(creaditNumber);
      }
    })();
  }, [chainId]);

  return { priceInUSD };
};

export default usePriceCredit;
