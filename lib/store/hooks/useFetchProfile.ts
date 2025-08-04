import { useCallback, useMemo } from "react";
import { fetchDomain } from "@/lib/api/domain";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  DomainInfoType,
  setDomainInfo,
  setInited,
  setOwnerStore,
  setProfile,
} from "@/lib/store/slices/profile";
import { useDomainInfo } from "@/lib/web3/hooks/useDomain";
import { NETWORKS } from "@/config/chains";
import { getUser } from "@/lib/api/user";

const useFetchProfile = (
  validDomain: string | null,
  chain: NETWORKS | null
) => {
  const dispatch = useAppDispatch();
  const {
    domain: storeDomain,
    chainId: storeChainId,
    domainInfo,
  } = useAppSelector((state) => state.profile);

  const domainOwner = useMemo(() => domainInfo?.owner ?? "", [domainInfo]);

  const { fetchDomainInfo } = useDomainInfo(validDomain ?? "", chain);

  const needUpdate = useMemo(
    () => storeDomain !== validDomain || chain !== storeChainId,
    [storeChainId, storeDomain, chain, validDomain]
  );

  const fetchDomainProfileByDB = useCallback(
    async (domainInfo?: DomainInfoType) => {
      const data = {
        chainId: chain as NETWORKS,
        domainName: validDomain ?? "",
      };

      const { data: domainData } = await fetchDomain(data, domainInfo);
      if (domainData) {
        dispatch(
          setProfile({
            ...domainData,
            createdAt: domainData.createdAt.toDateString(),
          })
        );
      }
    },
    [chain, validDomain]
  );

  const fetchDomainInfoByContract = useCallback(async () => {
    dispatch(setInited({ key: "info", value: false }));
    const domainInfo = await fetchDomainInfo();
    if (domainInfo) {
      dispatch(setDomainInfo(domainInfo));
      return domainInfo;
    }
    return null;
  }, [fetchDomainInfo]);

  const fetchOwnerStore = useCallback(async () => {
    if (domainOwner) {
      dispatch(setInited({ key: "info", value: false }));
      const ownerStore = await getUser(domainOwner);
      if (ownerStore) {
        dispatch(
          setOwnerStore({
            ...ownerStore,
            dateJoined: ownerStore.dateJoined.toString(),
          })
        );
      }
    }
  }, [domainOwner]);

  return {
    domainOwner,
    needUpdate,
    fetchOwnerStore,
    fetchDomainProfileByDB,
    fetchDomainInfoByContract,
  };
};

export default useFetchProfile;
