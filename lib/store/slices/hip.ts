import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HIPState {
  id: string;
  walletAddress: string;
  totalEarnings: number;
  totalPoints: number;
  rank: number;
  mainImgUrl: string;
  name: string;
  bio: string;
  position: string;
  linkedinVerified: boolean;
  discordVerified: boolean;
  twitterVerified: boolean;
  linkedinUrl: string;
  discordUrl: string;
  twitterUrl: string;
  referralPoints: number;
  domainPoints: number;
  nftPoints: number;
  totalUsers: number;
}

const initialState: HIPState = {
  id: "",
  walletAddress: "",
  totalEarnings: 0,
  totalPoints: 0,
  rank: 0,
  mainImgUrl: "",
  name: "",
  bio: "",
  position: "",
  linkedinVerified: false,
  discordVerified: false,
  twitterVerified: false,
  linkedinUrl: "",
  discordUrl: "",
  twitterUrl: "",
  referralPoints: 0,
  domainPoints: 0,
  nftPoints: 0,
  totalUsers: 0,
};

export const hipSlice = createSlice({
  name: "hip",
  initialState,
  reducers: {
    setHIPData: (state, action: PayloadAction<Partial<HIPState>>) => {
      return { ...state, ...action.payload };
    },
    resetHIPData: () => initialState,
  },
});

export const { setHIPData, resetHIPData } = hipSlice.actions;
