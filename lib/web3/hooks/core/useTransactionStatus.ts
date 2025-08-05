import { useEffect } from "react";
import { toast } from "react-toastify";
import { useWaitForTransactionReceipt } from "wagmi";

export const useTransactionStatus = (
  hash: `0x${string}` | undefined,
  successMessage: string,
  successCallback: () => void,
  reset: () => void,
  showToast: boolean = true
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
      if (showToast) {
        toast.success(successMessage);
      }
      reset();
      if (successCallback) successCallback();
    }
  }, [isSuccess, successMessage, successCallback, reset, showToast]);

  return { isLoading, receipt, isSuccess };
};
