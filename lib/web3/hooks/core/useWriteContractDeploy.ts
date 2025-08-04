import { useCallback } from "react";
import { useAccount, useWriteContract as useWagmiWriteContract } from "wagmi";
import { CONTRACT_DATA_DEPLOY, CONTRACTS_DEPLOY } from "@/config/contracts";
import { NETWORKS, isChainSupported } from "@/config/chains";
import { DEPLOY_ABI } from "@/config/abis";

export type UseContractDeployType = {
  contract: CONTRACTS_DEPLOY;
  functionName: string;
  args?: any;
  chainId?: NETWORKS;
  value?: bigint;
};

export const useWriteContractDeploy = () => {
  const { chainId: activeChainID } = useAccount();

  const { data, error, isPending, isError, isSuccess, reset, writeContract } =
    useWagmiWriteContract();

  const callWriteContractDeploy = useCallback(
    async (
      call: Omit<UseContractDeployType, "chainId">,
      chainId?: NETWORKS,
      referral?: string
    ) => {
      const chain = (chainId ? chainId : activeChainID) as NETWORKS;
      if (!isChainSupported(chain)) {
        console.error("Not supported Chain");
        return null;
      }

      const { contract, functionName, value } = call;
      const { addresses } = CONTRACT_DATA_DEPLOY[contract];
      const contractAddress = addresses[chain as keyof typeof addresses];

      // Check if contract address exists for this chain
      if (!contractAddress) {
        console.error(`Deploy contract not deployed on chain ${chain}`);
        return null;
      }

      writeContract({
        abi: DEPLOY_ABI,
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
    callWriteContractDeploy,
    isPending,
    isError,
    isSuccess,
  };
};
