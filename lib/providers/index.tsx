import React, { FC, PropsWithChildren } from "react";
import ToastContainer from "@/ui/components/toast";
import { Provider as ModalProvider } from "@/ui/components/modal";
import { StoreProvider } from "../store";
import NextAuthProvider from "./auth";
import WagmiProvider from "./wagmi";
import RainbowPrivder from "./rainbow";
import ReactQueryProvider from "./react-query";
import Updaters from "./app-updaters";

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <NextAuthProvider>
      <StoreProvider>
        <ReactQueryProvider>
          <WagmiProvider>
            <RainbowPrivder>
              <Updaters />
              {children}
              <ToastContainer />
              <ModalProvider />
            </RainbowPrivder>
          </WagmiProvider>
        </ReactQueryProvider>
      </StoreProvider>
    </NextAuthProvider>
  );
};

export default Providers;
