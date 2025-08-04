import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { NETWORKS } from "@/config/chains";
import { Domain, Follow } from "@prisma/client";
import { RegisterDomainType } from "@/lib/model/domain";
import { StoreUser } from "./user";
import { UserDomainType } from "@/lib/store/slices/user-domains";

export type DomainInfoType = {
  id: string;
  registerData: RegisterDomainType | null;
  reNewPrice: string;
  owner: string;
};

export type StoreProfile = Omit<Domain, "createdAt"> & { createdAt: string };
type AccountVerified = keyof Pick<
  Domain,
  "discord" | "twitter" | "wrapcast" | "linkedin" | "telegram"
>;

export type CombindedProfile = StoreProfile & {
  following?: (Partial<Follow> & {
    to?: Partial<Domain>;
    from?: Partial<Domain>;
  })[];
  followers?: (Partial<Follow> & {
    to?: Partial<Domain>;
    from?: Partial<Domain>;
  })[];
};

export interface ProfileState {
  domain: string | null;
  tld: string;
  chainId: NETWORKS | null;
  profile: CombindedProfile | null;
  domainInfo?: DomainInfoType | null;
  ownerStore?: StoreUser;
  ownerDomains: UserDomainType[] | null;
  isInitedInfo: boolean;
  isInitedDomain: boolean;
  isInitedProfile: boolean;
  isInitedOwnerDomain: boolean;
  isInitedOwnerStore: boolean;
}

const initialState: ProfileState = {
  chainId: null,
  domain: "",
  tld: "",
  profile: null,
  domainInfo: undefined,
  isInitedDomain: false,
  isInitedInfo: false,
  isInitedProfile: false,
  isInitedOwnerDomain: false,
  isInitedOwnerStore: false,
  ownerDomains: [],
};

export const profileSlices = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setDomainData: (
      state,
      action: PayloadAction<Pick<ProfileState, "chainId" | "domain" | "tld">>
    ) => {
      state.domain = action.payload.domain;
      state.chainId = action.payload.chainId;
      state.tld = action.payload.tld;
      state.isInitedDomain = true;
    },
    setOwnerStore: (state, action: PayloadAction<StoreUser>) => {
      state.ownerStore = action.payload;
      state.isInitedOwnerStore = true;
    },
    setProfile: (state, action: PayloadAction<CombindedProfile>) => {
      state.profile = action.payload;
      state.isInitedProfile = true;
    },
    setDomainInfo: (state, action: PayloadAction<DomainInfoType | null>) => {
      state.domainInfo = action.payload;
      state.isInitedInfo = true;
    },
    setDomainVerify: (state, action: PayloadAction<AccountVerified>) => {
      if (state.profile) {
        const updatedProfile = { ...state.profile };
        updatedProfile[`${action.payload}Verified`] = true;
        state.profile = updatedProfile;
      }
    },
    setInited: (
      state,
      action: PayloadAction<{
        key: "domain" | "info" | "profile" | "ownerDomains" | "ownerStore";
        value: boolean;
      }>
    ) => {
      switch (action.payload.key) {
        case "domain":
          state.isInitedDomain = action.payload.value;
          break;
        case "info":
          state.isInitedInfo = action.payload.value;
          break;
        case "profile":
          state.isInitedProfile = action.payload.value;
          break;
        case "ownerDomains":
          state.isInitedOwnerDomain = action.payload.value;
          break;
        case "ownerStore":
          state.isInitedOwnerStore = action.payload.value;
          break;
      }
    },
    updateExpirationDate: (state, action: PayloadAction<number>) => {
      if (state.domainInfo && state.domainInfo.registerData) {
        const years = action.payload;
        const millisecondsInAYear = 365 * 24 * 60 * 60;
        const newExpirationDate =
          Number(state.domainInfo.registerData.expirationDate) +
          years * millisecondsInAYear;
        state.domainInfo.registerData.expirationDate =
          newExpirationDate.toString();
      }
    },
    setOwnDomainData: (
      state,
      action: PayloadAction<UserDomainType[] | null>
    ) => {
      state.ownerDomains = action.payload;
      state.isInitedOwnerDomain = true;
    },

    updateProfileMainImage: (state, action: PayloadAction<string>) => {
      if (state.profile) {
        state.profile = { ...state.profile, mainImgUrl: action.payload };
      }
    },
    initProfileStore: () => initialState,
  },
});

export const {
  setInited,
  setProfile,
  setDomainInfo,
  setOwnerStore,
  setDomainData,
  setDomainVerify,
  setOwnDomainData,
  initProfileStore,
  updateExpirationDate,
  updateProfileMainImage,
} = profileSlices.actions;
