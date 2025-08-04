import { useCallback } from "react";
import { useAccount } from "wagmi";
import { CONTRACT_DATA_HIP } from "@/config/contracts";
import { NETWORKS, isChainSupported } from "@/config/chains";
import { viemClients } from "@/utils/viem";
import { UseContractHIPType } from "./type";
import { HIP_ABI } from "@/config/abis";

export const useReadHIPContract = () => {
  const { chainId: activeChainID } = useAccount();

  const callHIPContract = useCallback(
    async (call: Omit<UseContractHIPType, "chainId">, chainId?: NETWORKS) => {
      const chain = (chainId ? chainId : activeChainID) as NETWORKS;
      if (!chain || !isChainSupported(chain) || chain !== NETWORKS.INKMAINNET) {
        console.error("Not supported Chain");

        return null;
      }

      const { contract, functionName, args } = call;
      const { addresses } = CONTRACT_DATA_HIP[contract];
      const _call = {
        abi: HIP_ABI,
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

  return { callHIPContract };
};
