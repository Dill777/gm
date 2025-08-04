import { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useAccount, useSignMessage } from "wagmi";
import { toast } from "react-toastify";
import { getNonce } from "./nonce";

const useSign = () => {
  const { address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isPending, setIsPending] = useState(false);

  const signUser = useCallback(async () => {
    if (!address || !chainId) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsPending(true);
    try {
      const nonce = await getNonce();
      if (!nonce) {
        throw new Error("Failed to get nonce");
      }

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });

      const preparedMessage = message.prepareMessage();
      const signature = await signMessageAsync({
        message: preparedMessage,
      });

      await signIn("credentials", {
        message: JSON.stringify(message),
        signature,
        redirect: false,
      });
    } catch (error: any) {
      if (error?.message?.includes("User rejected the request")) {
        console.error("MetaMask - User rejected the request.");
        toast.error(
          "You rejected the request. Please sign the message to continue."
        );
      } else {
        console.error("An unexpected error occurred:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsPending(false);
    }
  }, [address, chainId, signMessageAsync]);

  return { signUser, isPending };
};

export default useSign;
