"use client";
import React, { useEffect } from "react";
import { useAppDispatch } from "@store/index";
import { initByStorage } from "@store/slices/setting";
import useUserUpdater from "@store/hooks/useUserUpdater";
import { CartedDomain, FavouritedDomain } from "../model/domain";
import { useFetchUserDomain } from "../store/hooks/useFetchUserDomains";
import { isChainSupported, NETWORKS } from "@/config/chains";
import { setChainFavorites } from "../store/slices/chain-favorites";

const Updaters = () => {
  const dispatch = useAppDispatch();

  // user
  useUserUpdater();
  useFetchUserDomain();

  // Update carts, favorites, and chain favorites to store from localstorage.
  useEffect(() => {
    const carts = JSON.parse(
      localStorage.getItem("carts") || "[]"
    ) as CartedDomain[];
    const favorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    ) as FavouritedDomain[];
    const favoriteChains = JSON.parse(
      localStorage.getItem("favoriteChains") || "[]"
    ) as NETWORKS[];

    // remove invalid localstorage Items
    const _carts = carts.filter(
      (item) => item.domainName && isChainSupported(item.chainId) && item.year
    );

    const _favorites = favorites.filter(
      (item) => item.domainName && isChainSupported(item.chainId)
    );

    const _favoriteChains = favoriteChains.filter((chainId) =>
      isChainSupported(chainId)
    );

    localStorage.setItem("carts", JSON.stringify(_carts));
    localStorage.setItem("favorites", JSON.stringify(_favorites));
    localStorage.setItem("favoriteChains", JSON.stringify(_favoriteChains));

    dispatch(
      initByStorage({
        carts: _carts,
        favourites: _favorites,
      })
    );

    dispatch(setChainFavorites(_favoriteChains));
  }, []);

  return <></>;
};

export default Updaters;
