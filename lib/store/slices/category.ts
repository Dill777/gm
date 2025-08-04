import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type DomainCategory = {
  id: string;
  key: string;
  // generated: number;
  taken: number;
};

const initialState: {
  isLoading: boolean;
  categories: DomainCategory[];
} = {
  isLoading: true,
  categories: [],
};

export const domainCategoryDataSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setDomainCategoryLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setDomainCategories: (state, action: PayloadAction<DomainCategory[]>) => {
      state.categories = action.payload;
    },
  },
});

export const { setDomainCategoryLoading, setDomainCategories } =
  domainCategoryDataSlice.actions;
