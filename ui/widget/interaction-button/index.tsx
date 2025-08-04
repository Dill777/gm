"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Button, ButtonProps } from "@/ui/components/button";
import { LoadingIcon } from "@/ui/components/icon/LoadingIcon";
import { cn } from "@/utils";
import { NETWORKS } from "@/config/chains";
import { useClientRender } from "@/utils/hooks/useClientRender";

export interface InteractionButtonProps extends ButtonProps {
  isPending?: boolean;
  requiredChain?: NETWORKS;
  requiredConnect?: boolean;
  keepContent?: boolean;
  error?: { isError: boolean; text: string };
}

const InteractionButton: FC<InteractionButtonProps> = ({
  onClick,
  className,
  children,
  requiredChain,
  isPending = false,
  requiredConnect = false,
  keepContent = false,
  error,
  ...props
}) => {
  const isClient = useClientRender();
  const { chainId, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { switchChainAsync } = useSwitchChain();

  const handleClick = async () => {
    try {
      if (requiredChain && chainId !== requiredChain) {
        await switchChainAsync({ chainId: requiredChain });
      }
    } catch (e) {}
  };

  if (!isClient || (!address && (requiredConnect || requiredChain))) {
    return (
      <Button {...props} onClick={openConnectModal} className={cn(className)}>
        {children}
      </Button>
    );
  }

  if (isPending) {
    return (
      <Button {...props} className={cn(className, "space-x-2 cursor-wait")}>
        <>
          <span>Submiting...</span>
          <LoadingIcon />
        </>
      </Button>
    );
  }

  if (requiredChain && requiredChain !== chainId) {
    return (
      <Button
        {...props}
        className={cn("truncate text-sm", className)}
        onClick={handleClick}
      >
        {keepContent ? children : "Switch Network"}
      </Button>
    );
  }

  if (error?.isError) {
    return (
      <Button {...props} className={cn(className, "opacity-50")} disabled>
        {error.text}
      </Button>
    );
  }

  return (
    <Button {...props} onClick={onClick} className={className}>
      {children}
    </Button>
  );
};

export default InteractionButton;
