import { useCallback } from "react";
import { useAccount } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "@/lib/auth/useAuth";

export const useInvalidateQuery = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { chainId } = useAccount();

  const invalidateCredit = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["userCredit", user?.address, chainId],
    });
  }, [queryClient, user, chainId]);

  const invalidateUserPDomain = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["userPrimaryDomain", user?.address, chainId],
    });
  }, [queryClient, user, chainId]);

  const invalidateUserStore = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["currentUserStore", user?.address],
    });
  }, [queryClient, user]);

  const invalidateUserDomains = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["publicUserDomainData", user?.address],
    });
  }, [queryClient, user]);

  return {
    invalidateCredit,
    invalidateUserStore,
    invalidateUserPDomain,
    invalidateUserDomains,
  };
};
