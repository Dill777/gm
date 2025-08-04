import { useMemo } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { NETWORKS } from "@/config/chains";
import { toggleChainFavorite } from "@/lib/store/slices/chain-favorites";

const useChainFavorite = (chainId: NETWORKS) => {
  const dispatch = useAppDispatch();
  const { favoriteChainIds } = useAppSelector((state) => state.chainFavorites);

  const isFavorite = useMemo(
    () => favoriteChainIds.includes(chainId),
    [favoriteChainIds, chainId]
  );

  const onToggleFavorite = () => {
    dispatch(toggleChainFavorite(chainId));

    if (!isFavorite) {
      toast.success("Added chain to your favorites");
    } else {
      toast.error("Removed chain from your favorites");
    }
  };

  return { isFavorite, onToggleFavorite };
};

export default useChainFavorite;
