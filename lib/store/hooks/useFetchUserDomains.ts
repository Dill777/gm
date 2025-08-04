"use client";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch } from "@/lib/store";
import { setUserDomainData, setLoading } from "@/lib/store/slices/user-domains";
import { useUserDomainData } from "@/lib/web3/hooks/useUserDomainData";
import useAuth from "@/lib/auth/useAuth";

export const useFetchUserDomain = () => {
  const dispatch = useAppDispatch();

  const { user } = useAuth();
  const address = useMemo(() => user?.address, [user]);
  const { fetchUserDomainData } = useUserDomainData(address ?? "");

  const { data: userDomainData } = useQuery({
    queryKey: ["publicUserDomainData", user?.address],
    queryFn: async () => {
      setLoading(true);
      const userDomainData = await fetchUserDomainData();
      setLoading(false);
      return userDomainData;
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Update Redux store with fetched user Domains Data
  useEffect(() => {
    dispatch(setUserDomainData(userDomainData ?? null));
  }, [userDomainData]);

  return null;
};
