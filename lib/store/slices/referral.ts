import { Referral, User } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type StoreReferral = Referral;
export type StoreUser = Partial<User>;

export interface ReferralState {
  referrals_lead: StoreReferral[];
  referrals_my: string[];
  totalEarnings: number;
  numberOfReferrals: number;
  isLoading: boolean;
}

const initialState: ReferralState = {
  referrals_lead: [],
  referrals_my: [],
  totalEarnings: 0,
  numberOfReferrals: 0,
  isLoading: false,
};

export const referralSlices = createSlice({
  name: "referral",
  initialState,
  reducers: {
    setReferralsLead: (state, action: PayloadAction<StoreReferral[]>) => {
      state.referrals_lead = action.payload ?? [];
      state.isLoading = false;
    },
    setReferralsMy: (state, action: PayloadAction<StoreUser[]>) => {
      const addresses = (action.payload ?? []).map(
        (user) => user.walletAddress || ""
      );
      state.referrals_my = addresses;
      state.isLoading = false;
    },
    setReferralInfo: (
      state,
      action: PayloadAction<{
        totalEarnings: number;
        numberOfReferrals: number;
      }>
    ) => {
      state.totalEarnings = action.payload.totalEarnings;
      state.numberOfReferrals = action.payload.numberOfReferrals;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload ?? false;
    },
    initReferrals: () => initialState,
  },
});

export const {
  setReferralsLead,
  setReferralsMy,
  setReferralInfo,
  initReferrals,
  setLoading,
} = referralSlices.actions;
