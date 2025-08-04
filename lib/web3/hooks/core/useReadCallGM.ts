import { useCallback } from "react";
import { useAccount } from "wagmi";
import { CONTRACT_DATA_GM, CONTRACTS_GM } from "@/config/contracts";
import { NETWORKS, isChainSupported } from "@/config/chains";
import { viemClients } from "@/utils/viem";
import { GM_ABI } from "@/config/abis";

export type UseContractGMReadType = {
  contract: CONTRACTS_GM;
  functionName: string;
  args?: any;
  chainId?: NETWORKS;
};

export const useReadGMContract = () => {
  const { chainId: activeChainID } = useAccount();

  const callGMContract = useCallback(
    async (
      call: Omit<UseContractGMReadType, "chainId">,
      chainId?: NETWORKS
    ) => {
      const chain = (chainId ? chainId : activeChainID) as NETWORKS;
      if (!chain || !isChainSupported(chain)) {
        console.error("Not supported Chain");
        return null;
      }

      const { contract, functionName, args } = call;
      const { addresses } = CONTRACT_DATA_GM[contract];
      const contractAddress = addresses[chain as keyof typeof addresses];

      // Check if contract address exists for this chain
      if (!contractAddress) {
        console.error(`GM contract not deployed on chain ${chain}`);
        return null;
      }

      const _call = {
        abi: GM_ABI,
        address: contractAddress,
        functionName,
        args,
        chainId: chain,
      };
      const client = viemClients[chain];
      return await client.readContract(_call);
    },
    [activeChainID]
  );

  return { callGMContract };
};
