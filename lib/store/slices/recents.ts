import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { CartDomainType } from "./cart";

export type RecentDomainType = Omit<CartDomainType, "reNewPrice" | "year">;
export interface FavoriteStates {
  domains: RecentDomainType[];
  isLoading: boolean;
}

const initialState: FavoriteStates = {
  domains: [],
  isLoading: false,
};

export const recentMintedSlices = createSlice({
  name: "recentMinted",
  initialState,
  reducers: {
    setDomains: (state, action: PayloadAction<(RecentDomainType | null)[]>) => {
      state.domains = action.payload.filter(Boolean) as RecentDomainType[];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setDomains, setLoading } = recentMintedSlices.actions;
