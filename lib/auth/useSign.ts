import { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import { useAccount, useSignMessage, useConnect, useSwitchChain } from "wagmi";
import { toast } from "react-toastify";
import { getNonce } from "./nonce";
import { isChainSupported, NETWORKS } from "@/config/chains";

const useSign = () => {
  const { address, chainId, isConnected, connector } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { connectAsync, connectors } = useConnect();
  const { switchChainAsync } = useSwitchChain();
  const [isPending, setIsPending] = useState(false);

  const signUser = useCallback(async () => {
    // Enhanced validation
    if (!isConnected || !connector) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!address) {
      toast.error(
        "Wallet address not available. Please reconnect your wallet."
      );
      return;
    }

    if (!chainId) {
      toast.error(
        "Current chain is not available. Please check your wallet connection."
      );
      return;
    }

    // Check if the current chain is supported and auto-switch if not
    if (!isChainSupported(chainId)) {
      try {
        console.log("Attempting to switch to default chain:", NETWORKS.DEFAULT);
        await switchChainAsync({ chainId: NETWORKS.DEFAULT });
        toast.success("Switched to supported network");
      } catch (switchError) {
        console.error("Chain switch failed:", switchError);
        toast.error(
          "Current network is not supported. Please switch to a supported network manually."
        );
        return;
      }
    }

    setIsPending(true);
    try {
      // Ensure we have a fresh connection
      if (!connector.getAccount) {
        // Try to reconnect if connector seems stale
        try {
          const availableConnector = connectors.find(
            (c) => c.id === connector.id
          );
          if (availableConnector) {
            await connectAsync({ connector: availableConnector });
          }
        } catch (reconnectError) {
          console.warn("Reconnection failed:", reconnectError);
          // Continue with original connector
        }
      }

      const nonce = await getNonce();
      if (!nonce) {
        throw new Error("Failed to get nonce");
      }

      // Create a simple message for wallet authentication
      const message = `Sign in to gm.cheap\n\nWallet: ${address}\nChain ID: ${chainId}\nNonce: ${nonce}\n\nThis signature will be used to authenticate you on our platform.`;

      const signature = await signMessageAsync({
        message,
      });

      await signIn("credentials", {
        message,
        signature,
        address,
        redirect: false,
      });
    } catch (error: any) {
      console.error("Signing error:", error);

      if (error?.message?.includes("User rejected the request")) {
        toast.error(
          "You rejected the request. Please sign the message to continue."
        );
      } else if (error?.message?.includes("Connector not connected")) {
        toast.error(
          "Wallet connection lost. Please reconnect your wallet and try again."
        );
      } else if (error?.message?.includes("Chain not configured")) {
        toast.error(
          "Current network is not supported. Please switch to a supported network."
        );
      } else if (error?.code === 4001) {
        // User denied message signature
        toast.error("Message signature was denied. Please try again.");
      } else if (error?.code === -32603) {
        // Internal error
        toast.error(
          "Wallet internal error. Please try again or refresh the page."
        );
      } else {
        toast.error(
          error?.message || "An unexpected error occurred during signing"
        );
      }
    } finally {
      setIsPending(false);
    }
  }, [
    address,
    chainId,
    isConnected,
    connector,
    signMessageAsync,
    connectAsync,
    connectors,
    switchChainAsync,
  ]);

  return { signUser, isPending };
};

export default useSign;
