import { useEffect } from "react";
import { useAccount } from "wagmi";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch } from "@/lib/store";
import {
  setLoadingUser,
  setStoreUser,
  setUserDomainInfo,
} from "@/lib/store/slices/user";
import { useUserDomainInfo } from "@/lib/web3/hooks/view/useUserDomainInfo";
import useAuth from "@/lib/auth/useAuth";
import { isChainSupported } from "@/config/chains";
import { getCurrentUser, updateReferCode } from "../../api/user";

const useUserUpdater = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { address, chainId } = useAccount();
  const { fetchUserDomainInfo } = useUserDomainInfo(address);

  // Fetch User Primary Domain Contract Data
  const { data: userPrimaryContractData } = useQuery({
    queryKey: ["userPrimaryDomain", user?.address, chainId],
    queryFn: async () => {
      if (!!user?.address && isChainSupported(chainId ?? 0)) {
        dispatch(
          setLoadingUser({ key: "isLoadingPrimaryDomainContract", value: true })
        );
        try {
          const domainInfo = await fetchUserDomainInfo();
          if (domainInfo) {
            return domainInfo;
          }
        } catch (error) {
          console.error("Error fetching user primary domain data:", error);
          return null;
        }
      }
      return null;
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    dispatch(
      setUserDomainInfo({
        userDomainConfig: userPrimaryContractData?.userDomainConfig,
        userPrimaryDomain: userPrimaryContractData?.userPrimaryDomain,
      })
    );
  }, [userPrimaryContractData]);

  // Fetching User DB Info
  const { data: userStoreData } = useQuery({
    queryKey: ["currentUserStore", user?.address],
    queryFn: async () => {
      if (user?.address) {
        // Indicate loading state
        dispatch(setLoadingUser({ key: "isLoadingUserStore", value: true }));
        // Fetch user's information from the database
        const userDB = await getCurrentUser();

        if (userDB) {
          return serializeUser(userDB);
        }
      }
      return null;
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Helper function to serialize user data
  const serializeUser = (userDB: User) => ({
    ...userDB,
    dateJoined: userDB.dateJoined.toDateString(),
  });

  // Update Redux store with fetched user data
  useEffect(() => {
    dispatch(setStoreUser(userStoreData ?? null));
  }, [userStoreData]);

  // Update Refer Code
  useEffect(() => {
    if (user?.address) {
      const referCode = localStorage.getItem("refCode") ?? "";
      if (referCode) {
        updateReferCode(referCode);
      }
    }
  }, [user?.address]);

  // const referCode = localStorage.getItem("refCode") ?? "";
};

export default useUserUpdater;
