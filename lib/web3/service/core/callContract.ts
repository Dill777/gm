import { CONTRACT_DATA } from "@/config/contracts";
import { NETWORKS, isChainSupported } from "@/config/chains";
import { viemClients } from "@/utils/viem";
import { UseContractType } from "../../hooks/core/type";

export const callContract = async (
  call: Omit<UseContractType, "chainId">,
  chainId: NETWORKS
) => {
  if (!chainId || !isChainSupported(chainId)) {
    console.error("Not supported Chain");
    return null;
  }

  const { contract, functionName, args } = call;
  const { abi, addresses } = CONTRACT_DATA[contract];
  const _call = {
    abi: abi,
    address: addresses[chainId as keyof typeof addresses],
    functionName,
    args,
    chainId: chainId,
  };
  const client = viemClients[chainId];
  return await client.readContract(_call);
};
