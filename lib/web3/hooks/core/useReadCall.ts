import { useCallback } from "react";
import { useAccount } from "wagmi";
import { CONTRACT_DATA } from "@/config/contracts";
import { NETWORKS, isChainSupported } from "@/config/chains";
import { viemClients } from "@/utils/viem";
import { UseContractType } from "./type";

export const useReadCall = () => {
  const { chainId: activeChainID } = useAccount();

  const callContract = useCallback(
    async (call: Omit<UseContractType, "chainId">, chainId?: NETWORKS) => {
      const chain = (chainId ? chainId : activeChainID) as NETWORKS;
      if (!chain || !isChainSupported(chain)) {
        console.error("Not supported Chain");
        return null;
      }

      const { contract, functionName, args } = call;
      const { abi, addresses } = CONTRACT_DATA[contract];
      const _call = {
        abi: abi,
        address: addresses[chain as keyof typeof addresses],
        functionName,
        args,
        chainId: chain,
      };
      const client = viemClients[chain];
      return await client.readContract(_call);
    },
    [activeChainID]
  );

  return { callContract };
};
