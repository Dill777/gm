import { useMemo } from "react";
import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_DATA } from "@/config/contracts";
import { NETWORKS, isChainSupported } from "@/config/chains";
import { UseContractType } from "./type";

export const useContract = ({
  contract,
  functionName,
  args = null,
  chainId,
}: UseContractType) => {
  const { chainId: activeChainID } = useAccount();

  const chain = useMemo(
    () => (chainId ? chainId : activeChainID) as NETWORKS,
    [chainId, activeChainID]
  );

  const { abi, address } = useMemo(() => {
    const { abi, addresses } = CONTRACT_DATA[contract];
    return { abi, address: addresses[chain as keyof typeof addresses] };
  }, [chain, contract]);

  const { data, queryKey, isLoading } = useReadContract({
    abi: abi,
    address: address,
    functionName,
    args,
    chainId: chain,
  });

  if (!isChainSupported(chain)) {
    return { data: null, queryKey: null, isLoading: false };
  }

  return { data, queryKey, isLoading };
};
