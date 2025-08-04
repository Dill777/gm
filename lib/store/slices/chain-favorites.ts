import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { NETWORKS } from "@/config/chains";

export interface ChainFavoriteStates {
  favoriteChainIds: NETWORKS[];
}

const initialState: ChainFavoriteStates = {
  favoriteChainIds: [],
};

export const chainFavoriteSlices = createSlice({
  name: "chainFavorites",
  initialState,
  reducers: {
    toggleChainFavorite: (state, action: PayloadAction<NETWORKS>) => {
      const chainId = action.payload;
      const index = state.favoriteChainIds.indexOf(chainId);

      if (index > -1) {
        // Remove from favorites
        state.favoriteChainIds.splice(index, 1);
      } else {
        // Add to favorites
        state.favoriteChainIds.push(chainId);
      }

      // Update localStorage
      localStorage.setItem(
        "favoriteChains",
        JSON.stringify(state.favoriteChainIds)
      );
    },

    setChainFavorites: (state, action: PayloadAction<NETWORKS[]>) => {
      state.favoriteChainIds = action.payload;
    },
  },
});

export const { toggleChainFavorite, setChainFavorites } =
  chainFavoriteSlices.actions;
export default chainFavoriteSlices.reducer;
