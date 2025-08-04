import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Follow, User } from "@prisma/client";
import { RegisterDomainType } from "@/lib/model/domain";
import { StoreProfile } from "./profile";

export type StoreUser =
  | (Omit<User, "dateJoined"> & { dateJoined?: string })
  | null;

type LoadingType =
  | "isLoadingUserStore"
  | "isLoadingCreditData"
  | "isLoadingPrimaryDomainContract"
  | "isLoadingPrimaryDomainDB"
  | "isLoadingFollowerOfUserData"
  | "isLoadingFollowData";

export type UserConfigStoreType = {
  allOwnedDomains: string[];
  numberOfReferrals: string;
  primaryDomain: string;
  totalEarnings: string;
};

export type GiftCard = {
  id: string;
  credits: string;
};

export interface UserStates {
  user: StoreUser;
  userCredit: number;
  userPrimaryDomain?: RegisterDomainType;
  userDomainConfig?: UserConfigStoreType;
  userPrimaryDomainDB?: StoreProfile;
  giftCards: GiftCard[];
  followerByUser: Follow[];
  followingByUser: Follow[];
  isLoadingUserStore: boolean;
  isLoadingFollowData: boolean;
  isLoadingFollowerOfUserData: boolean;
  isLoadingCreditData: boolean;
  isLoadingPrimaryDomainDB: boolean;
  isLoadingPrimaryDomainContract: boolean;
  followersOfUser: Follow[];
}

const initialState: UserStates = {
  user: null,
  userCredit: 0,
  userPrimaryDomain: undefined,
  userPrimaryDomainDB: undefined,
  giftCards: [],
  followingByUser: [],
  followerByUser: [],
  followersOfUser: [],
  isLoadingUserStore: false,
  isLoadingFollowData: false,
  isLoadingFollowerOfUserData: false,
  isLoadingCreditData: false,
  isLoadingPrimaryDomainDB: false,
  isLoadingPrimaryDomainContract: false,
};

export const userSlices = createSlice({
  name: "user",
  initialState,
  reducers: {
    setStoreUser: (state, action: PayloadAction<StoreUser>) => {
      state.user = action.payload;
      state.isLoadingUserStore = false;
    },
    setUserCredit: (state, action: PayloadAction<number>) => {
      state.userCredit = action.payload;
      state.isLoadingCreditData = false;
    },
    setUserDomainInfo: (
      state,
      action: PayloadAction<
        Pick<UserStates, "userDomainConfig" | "userPrimaryDomain">
      >
    ) => {
      state.userPrimaryDomain = action.payload.userPrimaryDomain;
      state.userDomainConfig = action.payload.userDomainConfig;
      state.isLoadingPrimaryDomainContract = false;
    },
    setPDomainDB: (state, action: PayloadAction<StoreProfile | undefined>) => {
      state.userPrimaryDomainDB = action.payload;
      state.isLoadingPrimaryDomainDB = false;
    },
    //-----------------------------------------
    setGiftCards: (state, action: PayloadAction<GiftCard[]>) => {
      state.giftCards = action.payload;
    },
    setFollowData: (
      state,
      action: PayloadAction<{ following: Follow[]; followers: Follow[] }>
    ) => {
      state.followingByUser = action.payload.following;
      state.followerByUser = action.payload.followers;
      state.isLoadingFollowData = false;
    },
    setFollow: (
      state,
      action: PayloadAction<{
        from: string;
        to: string;
        mode: "follow" | "unfollow";
      }>
    ) => {
      const { from, to, mode } = action.payload;
      if (mode === "follow") {
        state.followingByUser = [
          { fromId: from, toId: to, id: 0 },
          ...state.followingByUser,
        ];
      } else {
        state.followingByUser = state.followingByUser.filter(
          (item) => item.toId !== to || item.fromId !== from
        );
      }
    },
    setLoadingUser: (
      state,
      action: PayloadAction<{ key: LoadingType; value: boolean }>
    ) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    setFollowersOfUser: (state, action: PayloadAction<Follow[] | null>) => {
      if (action.payload) {
        state.followersOfUser = action.payload;
      } else {
        state.followersOfUser = [];
      }
    },
    initUser: () => initialState,
  },
});

export const {
  initUser,
  setFollow,
  setStoreUser,
  setUserCredit,
  setGiftCards,
  setPDomainDB,
  setFollowData,
  setFollowersOfUser,
  setUserDomainInfo,
  setLoadingUser,
} = userSlices.actions;
