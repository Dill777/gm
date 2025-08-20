"use client";

import { Transport } from "viem";
import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import {
  rainbowWallet,
  walletConnectWallet,
  bitgetWallet,
  metaMaskWallet,
  gateWallet,
  tokenPocketWallet,
  rabbyWallet,
  // binanceWallet,
} from "@rainbow-me/rainbowkit/wallets";
import binanceWallet from "@binance/w3w-rainbow-connector-v2";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";

import { CHAINS, chains } from "@/config/chains";
import { CLIENT_CONFIG, publicClient } from "./viem";

export const transports = CHAINS.reduce((ts, chain) => {
  if (ts) {
    return {
      ...ts,
      [chain.id]: http(),
    };
  }
  return {
    [chain.id]: http(),
  };
}, {} as Record<number, Transport>);

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        binanceWallet,
        rabbyWallet,
        walletConnectWallet,
        rainbowWallet,
        tokenPocketWallet,
        gateWallet,
        bitgetWallet,
      ],
    },
  ],
  {
    appName: "ZNS Connect",
    projectId: "fee68566c73e3310c5d5a89c2230fba6",
  }
);

export function createWagmiConfig() {
  return createConfig({
    chains,
    ssr: true,
    syncConnectedChain: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    transports,
    ...CLIENT_CONFIG,
    connectors,
    multiInjectedProviderDiscovery: true,
  });
}

export { publicClient };
