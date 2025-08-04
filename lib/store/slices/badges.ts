import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserBadgesStatus {
  isLoadingBadge: boolean;
}

const initialState: UserBadgesStatus = {
  isLoadingBadge: true,
};

export const badgeDataSlice = createSlice({
  name: "badges",
  initialState,
  reducers: {
    setBadgeDataLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoadingBadge = action.payload;
    },
    initUserBadges: () => initialState,
  },
});

export const { initUserBadges, setBadgeDataLoading } = badgeDataSlice.actions;
