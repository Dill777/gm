"use client";

import React from "react";
import Modal from "@/ui/components/modal";
import useAuth from "@/lib/auth/useAuth";
import useSign from "@/lib/auth/useSign";
import InteractionButton from "../interaction-button";
import { useClientRender } from "@/utils/hooks/useClientRender";

const UnAuthWallet = () => {
  const { isNeedToResign } = useAuth();
  const isClient = useClientRender();
  const { isPending, signUser } = useSign();

  return (
    <div>
      <Modal
        isOpen={!!isNeedToResign && isClient}
        handleClose={() => {}}
        hideCloseButton
        backdropClassName="bg-black/80"
      >
        <div className="flex flex-col justify-between space-y-5 px-3 mobile:text-center">
          <div className="font-medium">
            Please <span className="text-verified">Sign in</span> our platform
            using your wallet
          </div>

          <InteractionButton
            isPending={isPending}
            onClick={signUser}
            className="font-medium"
          >
            Sign In
          </InteractionButton>
        </div>
      </Modal>
    </div>
  );
};

export default UnAuthWallet;
