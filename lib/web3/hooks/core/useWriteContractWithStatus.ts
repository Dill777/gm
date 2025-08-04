import { useAccount, useBalance } from "wagmi";
import { useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { NETWORKS } from "@/config/chains";
import { useTransactionStatus } from "./useTransactionStatus";
import { useWriteContract } from "./useWriteContract";
// import { useTransactionCost } from "./useEstimateGas";

export const useContractWithStatus = (
  chainId: NETWORKS | null,
  args: any,
  successMessage: string,
  successCallback: () => void = () => {},
  errorMessage: string = `Transaction has canceled`
) => {
  const {
    data: hash,
    isPending,
    error,
    isError,
    reset,
    callWriteContract,
  } = useWriteContract();

  const { isLoading } = useTransactionStatus(
    hash,
    successMessage,
    successCallback,
    reset
  );

  useEffect(() => {
    if (isError) {
      console.error("Error:", error);
      toast.error(errorMessage);
    }
  }, [isError, error, errorMessage]);

  const isProcessing = useMemo(
    () => (isLoading && !!hash) || isPending,
    [isLoading, hash, isPending]
  );

  // const { estimateCost } = useTransactionCost();
  const { address } = useAccount();
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address,
  });

  const action = useCallback(async () => {
    if (isProcessing || isBalanceLoading) return;
    if (chainId) {
      // const requiredCost = await estimateCost(args);

      if (!balanceData) {
        toast.error("Insufficient Balance");
        return;
      }
      callWriteContract(args);
    }
  }, [
    chainId,
    isProcessing,
    callWriteContract,
    args,
    balanceData,
    isBalanceLoading,
    // estimateCost,
  ]);

  return { action, isProcessing, isError, error };
};
