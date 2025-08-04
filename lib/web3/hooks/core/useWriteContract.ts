import { useCallback } from "react";
import { useAccount, useWriteContract as useWagmiWriteContract } from "wagmi";
import { CONTRACT_DATA } from "@/config/contracts";
import { NETWORKS, isChainSupported } from "@/config/chains";
import { UseContractType } from "./type";

export const useWriteContract = () => {
  const { chainId: activeChainID } = useAccount();

  const { data, error, isPending, isError, isSuccess, reset, writeContract } =
    useWagmiWriteContract();

  const callWriteContract = useCallback(
    ({
      contract,
      functionName,
      args = null,
      value,
      chainId,
    }: UseContractType) => {
      const chain = (chainId ? chainId : activeChainID) as NETWORKS;
      if (!isChainSupported(chain)) {
        console.error("Not supported Chain");
        return null;
      }

      const { abi, addresses } = CONTRACT_DATA[contract];
      writeContract({
        abi: abi,
        address: addresses[chain as keyof typeof addresses],
        functionName,
        value,
        args,
        chainId: chain,
      });
    },
    [writeContract, activeChainID]
  );

  return {
    data,
    reset,
    error,
    callWriteContract,
    isPending,
    isError,
    isSuccess,
  };
};
