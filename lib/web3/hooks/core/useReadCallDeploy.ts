import { useCallback } from "react";
import { useAccount } from "wagmi";
import { CONTRACT_DATA_DEPLOY, CONTRACTS_DEPLOY } from "@/config/contracts";
import { NETWORKS, isChainSupported } from "@/config/chains";
import { viemClients } from "@/utils/viem";
import { DEPLOY_ABI } from "@/config/abis";

export type UseContractDeployReadType = {
  contract: CONTRACTS_DEPLOY;
  functionName: string;
  args?: any;
  chainId?: NETWORKS;
};

export const useReadDeployContract = () => {
  const { chainId: activeChainID } = useAccount();

  const callDeployContract = useCallback(
    async (
      call: Omit<UseContractDeployReadType, "chainId">,
      chainId?: NETWORKS
    ) => {
      const chain = (chainId ? chainId : activeChainID) as NETWORKS;
      if (!chain || !isChainSupported(chain)) {
        console.error("Not supported Chain");
        return null;
      }

      const { contract, functionName, args } = call;
      const { addresses } = CONTRACT_DATA_DEPLOY[contract];
      const contractAddress = addresses[chain as keyof typeof addresses];

      // Check if contract address exists for this chain
      if (!contractAddress) {
        console.error(`Deploy contract not deployed on chain ${chain}`);
        return null;
      }

      const _call = {
        abi: DEPLOY_ABI,
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

  return { callDeployContract };
};
