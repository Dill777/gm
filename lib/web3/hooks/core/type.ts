import { NETWORKS } from "@/config/chains";
import { CONTRACTS } from "@/config/contracts";

export type UseContractType = {
  contract: CONTRACTS;
  functionName: string;
  args?: any;
  chainId?: NETWORKS;
  value?: any;
};
