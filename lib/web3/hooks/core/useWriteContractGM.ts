import { useCallback } from "react";
import { useAccount, useWriteContract as useWagmiWriteContract } from "wagmi";
import { CONTRACT_DATA_GM, CONTRACTS_GM } from "@/config/contracts";
import { NETWORKS, isChainSupported } from "@/config/chains";
import { GM_ABI } from "@/config/abis";

export type UseContractGMType = {
  contract: CONTRACTS_GM;
  functionName: string;
  args?: any;
  chainId?: NETWORKS;
  value?: bigint;
};

export const useWriteContractGM = () => {
  const { chainId: activeChainID } = useAccount();

  const { data, error, isPending, isError, isSuccess, reset, writeContract } =
    useWagmiWriteContract();

  const callWriteContractGM = useCallback(
    async (
      call: Omit<UseContractGMType, "chainId">,
      chainId?: NETWORKS,
      referral?: string
    ) => {
      const chain = (chainId ? chainId : activeChainID) as NETWORKS;
      if (!isChainSupported(chain)) {
        console.error("Not supported Chain");
        return null;
      }

      const { contract, functionName, value } = call;
      const { addresses } = CONTRACT_DATA_GM[contract];
      const contractAddress = addresses[chain as keyof typeof addresses];

      // Check if contract address exists for this chain
      if (!contractAddress) {
        console.error(`GM contract not deployed on chain ${chain}`);
        return null;
      }

      writeContract({
        abi: GM_ABI,
        address: contractAddress,
        functionName,
        value: value || BigInt(0),
        args: [referral],
        chainId: chain,
      });
    },
    [writeContract, activeChainID]
  );

  return {
    data,
    reset,
    error,
    callWriteContractGM,
    isPending,
    isError,
    isSuccess,
  };
};
