"use client";
import { FC, PropsWithChildren, useMemo } from "react";
import { WagmiProvider as Provider } from "wagmi";
import { createWagmiConfig } from "@/utils/wagmi";

const WagmiProvider: FC<PropsWithChildren> = ({ children }) => {
  const wagmiConfig = useMemo(() => createWagmiConfig(), []);

  return <Provider config={wagmiConfig}>{children}</Provider>;
};

export default WagmiProvider;
