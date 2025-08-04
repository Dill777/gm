import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { NETWORKS } from "@/config/chains";
import { RegisterDomainType } from "@/lib/model/domain";

export type UserDomainType = RegisterDomainType & {
  domainId: string;
  chainId: NETWORKS;
  isPrimary: boolean;
};

export interface UserDomainStatus {
  domains: UserDomainType[] | null;
  isLoading: boolean;
}

const initialState: UserDomainStatus = {
  domains: null,
  isLoading: false,
};

export const userDomainsSlices = createSlice({
  name: "userDomains",
  initialState,
  reducers: {
    setUserDomainData: (
      state,
      action: PayloadAction<UserDomainType[] | null>
    ) => {
      state.domains = action.payload;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUserDomainData, setLoading } = userDomainsSlices.actions;
