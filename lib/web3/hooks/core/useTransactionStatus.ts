import { useEffect } from "react";
import { toast } from "react-toastify";
import { useWaitForTransactionReceipt } from "wagmi";

export const useTransactionStatus = (
  hash: `0x${string}` | undefined,
  successMessage: string,
  successCallback: () => void,
  reset: () => void
) => {
  const {
    isSuccess,
    isLoading,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success(successMessage);
      reset();
      if (successCallback) successCallback();
    }
  }, [isSuccess]);

  return { isLoading, receipt, isSuccess };
};
