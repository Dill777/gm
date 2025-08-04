import { useCallback, useMemo } from "react";
import { CONTRACT_DATA } from "@/config/contracts";
import { viemClients } from "@/utils/viem";
import { mainnets, NETWORKS } from "@/config/chains";
import { UseContractType } from "./type";

export type ReturnContractType<T> = {
  chainId: NETWORKS;
  data: T;
};
// useNetworksCall
export const useNetworksCall = <T>({
  contract,
  functionName,
  args = null,
  onlyMainnet = false,
}: UseContractType & { onlyMainnet?: boolean }) => {
  // Memoize the inputs to the effect
  const memoizedInputs = useMemo(
    () => ({ contract, functionName, args }),
    [contract, functionName, args]
  );

  const callContract = useCallback(async () => {
    const clients = onlyMainnet
      ? Object.keys(viemClients).filter((id) => mainnets.includes(Number(id)))
      : Object.keys(viemClients);

    const contractDataPromises = clients.map(async (id) => {
      const chainId = Number(id) as NETWORKS;
      const client = viemClients[chainId];
      const { abi, addresses } = CONTRACT_DATA[contract];
      try {
        const data = (await client.readContract({
          address: addresses[chainId as keyof typeof addresses],
          abi: abi,
          functionName,
          args,
        })) as T;
        return { chainId, data };
      } catch (e) {
        return { chainId, data: null };
      }
    });

    return await Promise.all(contractDataPromises);
  }, [memoizedInputs]);

  return { callContract };
};
