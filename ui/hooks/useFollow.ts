import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { setFollow } from "@/lib/store/slices/user";
import { followDomain } from "@/lib/api/domain/profile";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import useFetchProfile from "@/lib/store/hooks/useFetchProfile";
import { getChainByID, isChainSupported } from "@/config/chains";

export const useFollow = (
  domainId?: string,
  domainName: string = "",
  isNeedUpdateProfile = false
) => {
  const dispatch = useAppDispatch();
  const { user, userDomainConfig, userPrimaryDomainDB, followingByUser } =
    useAppSelector((state) => state.user);
  const { chainId: userChainId } = useAccount();
  const { domain, chainId } = useAppSelector((state) => state.profile);

  const { fetchDomainProfileByDB } = useFetchProfile(domain, chainId);

  const [isProcessing, setIsProcessing] = useState(false);

  const { openConnectModal } = useConnectModal();

  const handleFollow = async (mode: "follow" | "unfollow") => {
    if (isProcessing) return;
    if (!user?.id) {
      openConnectModal && openConnectModal();
      return;
    }
    if (domainId) {
      if (userPrimaryDomainDB && userDomainConfig?.primaryDomain) {
        setIsProcessing(true);
        const res = await followDomain(domainId, userPrimaryDomainDB.id);
        if (res.data) {
          if (isNeedUpdateProfile) fetchDomainProfileByDB();
          const message =
            mode === "follow"
              ? `You followed ${domainName}`
              : `You unfollowed ${domainName}`;
          toast.success(message);
          dispatch(
            setFollow({ to: domainId, from: userPrimaryDomainDB?.id, mode })
          );
        }
        setIsProcessing(false);
      } else {
        if (isChainSupported(userChainId ?? 0) && userChainId) {
          const chainName = getChainByID(userChainId).shortName;
          toast.error(`You don't have any domain in ${chainName}`);
        } else {
          toast.error(
            "You don't have any domain in current network. Change the Network"
          );
        }
      }
    }
  };

  const isFollowed = useMemo(
    () =>
      (followingByUser?.findIndex((item) => item.toId === domainId) ?? -1) > -1,
    [followingByUser, domainId]
  );

  return { handleFollow, isProcessing, isFollowed };
};
