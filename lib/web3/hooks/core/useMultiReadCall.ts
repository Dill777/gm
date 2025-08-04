import { useCallback } from "react";
import { useAccount } from "wagmi";
import { CONTRACT_DATA } from "@/config/contracts";
import { viemClients } from "@/utils/viem";
import { NETWORKS, isChainSupported } from "@/config/chains";
import { UseContractType } from "./type";

export const useMultiReadCall = () => {
  const { chainId: activeChainID } = useAccount();
  const multicall = useCallback(
    async (calls: Omit<UseContractType, "chainId">[], chainId?: NETWORKS) => {
      const chain = (chainId ? chainId : activeChainID) as NETWORKS;
      if (!chain || !isChainSupported(chain)) {
        console.error("Not supported Chain");
        return null;
      }
      const contractsToCall = calls.map((call) => {
        const { contract, functionName, args } = call;
        const { abi, addresses } = CONTRACT_DATA[contract];
        return {
          abi: abi,
          address: addresses[chain as keyof typeof addresses],
          functionName,
          args,
          chainId: chain,
        };
      });
      const client = viemClients[chain];

      try {
        // Try to use multicall first
        return await client.multicall({
          contracts: contractsToCall,
        });
      } catch (error) {
        console.warn(
          `Multicall failed on chain ${chain}, falling back to individual calls`,
          error
        );

        // Fall back to individual calls
        const results = await Promise.all(
          contractsToCall.map(async (contract) => {
            try {
              const result = await client.readContract(contract);
              return { result, status: "success" };
            } catch (error) {
              console.error(
                `Individual call failed for ${contract.functionName}`,
                error
              );
              return { error, status: "failure" };
            }
          })
        );

        return results;
      }
    },
    [activeChainID]
  );

  return { multicall };
};
