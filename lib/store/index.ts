"use client";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";

import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import { settingSlice } from "./slices/setting";
import { cartSlices } from "./slices/cart";
import { userSlices } from "./slices/user";
import { profileSlices } from "./slices/profile";
import { userDomainsSlices } from "./slices/user-domains";
import { referralSlices } from "./slices/referral";
import { badgeDataSlice } from "./slices/badges";
import { favoriteSlices } from "./slices/favorite";
import { chainFavoriteSlices } from "./slices/chain-favorites";
import { recentMintedSlices } from "./slices/recents";
import { domainCategoryDataSlice } from "./slices/category";
import { hipSlice } from "./slices/hip";

const PERSISTED_KEYS: string[] = [
  "user",
  "setting",
  "favoirtes",
  "cart",
  "chainFavorites",
];

const persistConfig = {
  key: "primary",
  whitelist: PERSISTED_KEYS,
  blacklist: ["profile"],
  storage,
  version: 1,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    user: userSlices.reducer,
    setting: settingSlice.reducer,
    cart: cartSlices.reducer,
    badges: badgeDataSlice.reducer,
    referral: referralSlices.reducer,
    profile: profileSlices.reducer,
    userDomains: userDomainsSlices.reducer,
    category: domainCategoryDataSlice.reducer,
    favoirtes: favoriteSlices.reducer,
    chainFavorites: chainFavoriteSlices.reducer,
    recentMinted: recentMintedSlices.reducer,
    hip: hipSlice.reducer,
  })
);

export function makeStore() {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    devTools: process.env.NODE_ENV === "development",
  });
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export { default as StoreProvider } from "./provider";
