"use client";
import React, { FC, PropsWithChildren } from "react";
import {
  RainbowKitProvider,
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
} from "@rainbow-me/rainbowkit";
import { SiweMessage } from "siwe";
import { signIn, signOut } from "next-auth/react";
import { getNonce } from "../auth/nonce";
import useAuth from "../auth/useAuth";

const authenticationAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    const nonce = await getNonce();
    return nonce;
  },
  createMessage: ({ nonce, address, chainId }) => {
    return new SiweMessage({
      domain: window.location.host,
      address,
      statement: "Sign in with Ethereum to the app.",
      uri: window.location.origin,
      version: "1",
      chainId,
      nonce,
    });
  },
  //@ts-ignore
  getMessageBody: ({ message }) => {
    return message.prepareMessage();
  },
  verify: async ({ message, signature }) => {
    const verifyResult = await signIn("credentials", {
      message: JSON.stringify(message),
      signature,
      redirect: false,
    });
    return Boolean(verifyResult?.ok);
  },
  signOut: async () => {
    await signOut({ redirect: false });
  },
});

const RainbowProvider: FC<PropsWithChildren> = ({ children }) => {
  const { status } = useAuth();
  return (
    <>
      <RainbowKitAuthenticationProvider
        adapter={authenticationAdapter}
        status={status}
      >
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </>
  );
};

export default RainbowProvider;
