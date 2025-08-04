import { useCallback } from "react";
import { useAccount } from "wagmi";
import { CONTRACT_DATA } from "@/config/contracts";
import { NETWORKS, isChainSupported } from "@/config/chains";
import { viemClients } from "@/utils/viem";
import { UseContractType } from "./type";
import { Interface } from "ethers";
import { useQuery } from "@tanstack/react-query";

export const useTransactionCost = () => {
  const { chainId: activeChainID, address } = useAccount();

  const estimateCost = useCallback(
    async (call: Omit<UseContractType, "chainId">, chainId?: NETWORKS) => {
      const chain = (chainId ? chainId : activeChainID) as NETWORKS;
      if (!chain || !isChainSupported(chain)) {
        console.error("Not supported Chain");
        return null;
      }

      const { contract, functionName, args, value } = call;
      const { abi, addresses } = CONTRACT_DATA[contract];

      const contractInterface = new Interface(abi);

      const data = contractInterface.encodeFunctionData(
        functionName,
        args
      ) as `0x${string}`;

      const _value = value ? { value: value } : {};
      const _call = {
        account: address,
        chainId: chain,
        to: addresses[chain as keyof typeof addresses],
        data: data,
        ..._value,
      };

      const client = viemClients[chain];

      const gasPrice = await client.getGasPrice();

      try {
        const gasLimit = await client.estimateGas(_call);
        const gasFee = gasLimit * gasPrice;
        const totalCost = BigInt(value ?? 0) + gasFee;
        return totalCost;
      } catch (e) {
        return null;
      }
    },
    [activeChainID, address]
  );

  return { estimateCost };
};

export const useCostWithGas = (
  call: Omit<UseContractType, "chainId">,
  chainId?: NETWORKS
) => {
  const { estimateCost } = useTransactionCost();
  const { data } = useQuery({
    queryKey: ["getGas", call, chainId],
    queryFn: async () => {
      return estimateCost(call, chainId);
    },
    staleTime: 60000,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return { value: data };
};
