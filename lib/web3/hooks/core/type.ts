import { NETWORKS } from "@/config/chains";
import { CONTRACTS, CONTRACTS_HIP, CONTRACTS_NFT } from "@/config/contracts";

export type UseContractType = {
  contract: CONTRACTS;
  functionName: string;
  args?: any;
  chainId?: NETWORKS;
  value?: any;
};

export type UseContractHIPType = {
  contract: CONTRACTS_HIP;
  functionName: string;
  referral?: string;
  args?: any;
  chainId?: NETWORKS;
  value?: bigint;
};

export type UseContractNFTType = {
  contract: CONTRACTS_NFT;
  functionName: string;
  args?: any;
};
