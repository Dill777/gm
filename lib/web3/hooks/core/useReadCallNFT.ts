import { useCallback } from "react";
import { CONTRACTS_NFT, CONTRACT_DATA_NFT } from "@/config/contracts";
import { NFTS } from "@/config/nfts";
import { viemClients } from "@/utils/viem";
import { NFT_ABI } from "@/config/abis";
import { useAccount } from "wagmi";

export const useReadCallNFTContract = () => {
  const { address } = useAccount();
  // const address = "0x4FB7cD1cf8CFee6B9440f5ccDD2Cb43f73d5Aaa3";

  const callNFTContract = useCallback(async (nft_type: NFTS) => {
    if (!address) {
      console.error("No user address");
      return null;
    }

    const { addresses, chains } = CONTRACT_DATA_NFT[CONTRACTS_NFT.NFT];

    const _call = {
      abi: NFT_ABI,
      address: addresses[nft_type as keyof typeof addresses],
      functionName: "balanceOf",
      args: [address],
    };

    const client = viemClients[chains[nft_type as keyof typeof chains]];
    console.log(chains[nft_type as keyof typeof chains]);
    console.log(_call, client);
    return await client.readContract(_call);
  }, []);

  return { callNFTContract };
};
