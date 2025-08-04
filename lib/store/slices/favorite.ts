import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { CartDomainType } from "./cart";
import { Domain } from "@/lib/model/domain";

export type FavoriteType = Omit<CartDomainType, "reNewPrice" | "year">;
export interface FavoriteStates {
  domains: FavoriteType[];
}

const initialState: FavoriteStates = {
  domains: [],
};

export const favoriteSlices = createSlice({
  name: "favoirtes",
  initialState,
  reducers: {
    setFavoriteDomains: (
      state,
      action: PayloadAction<(FavoriteType | null)[]>
    ) => {
      state.domains = action.payload.filter(Boolean) as FavoriteType[];
    },

    removeFavoriteDomain: (state, action: PayloadAction<Domain>) => {
      const data = action.payload;
      const { domainName, chainId } = data;
      const _domains = state.domains.filter((item) => {
        return item.domainName !== domainName || item.chainId !== chainId;
      });

      state.domains = _domains;
    },
  },
});

export const { setFavoriteDomains, removeFavoriteDomain } =
  favoriteSlices.actions;
