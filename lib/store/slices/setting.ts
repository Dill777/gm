import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { CartedDomain, FavouritedDomain, Domain } from "@/lib/model/domain";

export interface SettingState {
  isInited: boolean; // if isInited is false, it means non-initedStats. Otherwise, it force updaters using carts after change.
  isPurchased: boolean; // if isInited is false, it means non-initedStats. Otherwise, it force updaters using carts after change.
  carts: CartedDomain[];
  favourites: FavouritedDomain[];
}

const initialState: SettingState = {
  isInited: false,
  isPurchased: false,
  carts: [],
  favourites: [],
};

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    initByStorage: (state, action: PayloadAction<Partial<SettingState>>) => {
      state.carts = action.payload.carts ?? [];
      state.favourites = action.payload.favourites ?? [];
      state.isInited = true;
    },
    favouriteDomain: (state, action: PayloadAction<Domain>) => {
      const data = action.payload;

      const { domainName, chainId } = data;
      let _favourites = [];

      const idx = state.favourites.findIndex((item) => {
        return item.domainName === domainName && item.chainId === chainId;
      });

      if (idx > -1) {
        _favourites = [...state.favourites];
        _favourites.splice(idx, 1);
      } else {
        _favourites = [...state.favourites, data];
      }

      localStorage.setItem("favorites", JSON.stringify(_favourites));
      state.favourites = _favourites;
    },

    cartDomain: (
      state,
      action: PayloadAction<
        Domain & { isCategory?: boolean; categoryKey?: string }
      >
    ) => {
      const data = action.payload;

      const { domainName, chainId } = data;
      let _carts = [];

      const idx = state.carts.findIndex((item) => {
        return item.domainName === domainName && item.chainId === chainId;
      });

      if (idx > -1) {
        state.carts.splice(idx, 1);
        _carts = state.carts;
      } else {
        _carts = [...state.carts, { ...data, year: 1 }];
      }

      localStorage.setItem("carts", JSON.stringify(_carts));
      state.carts = _carts;
    },
    cartDomains: (state, action: PayloadAction<Domain[]>) => {
      const domainsToUpdate = action.payload;
      let _carts = [...state.carts];

      domainsToUpdate.forEach((data) => {
        const { domainName, chainId } = data;
        const idx = _carts.findIndex((item) => {
          return item.domainName === domainName && item.chainId === chainId;
        });

        if (idx > -1) {
          _carts.splice(idx, 1);
        } else {
          _carts.push({ ...data, year: 1 });
        }
      });

      localStorage.setItem("carts", JSON.stringify(_carts));
      state.carts = _carts;
    },

    handleDomainPeriod: (
      state,
      action: PayloadAction<Domain & { isAdd?: boolean; updateAmount?: number }>
    ) => {
      const data = action.payload;
      const { domainName, chainId, isAdd, updateAmount } = data;
      const _carts = state.carts.map((item) => {
        if (item.domainName === domainName && item.chainId === chainId) {
          const yearhToUpdate = updateAmount
            ? updateAmount
            : isAdd
            ? item.year + 1
            : item.year - 1;

          if (yearhToUpdate < 1) {
            return item;
          }
          return { ...item, year: yearhToUpdate };
        } else return item;
      });

      localStorage.setItem("carts", JSON.stringify(_carts));
      state.carts = _carts;
    },
    setPurchased: (state, action: PayloadAction<Partial<boolean>>) => {
      state.isPurchased = action.payload;
    },
  },
});

export const {
  initByStorage,
  favouriteDomain,
  cartDomain,
  cartDomains,
  setPurchased,
  handleDomainPeriod,
} = settingSlice.actions;
