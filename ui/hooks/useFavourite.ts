import { useMemo } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { Domain } from "@/lib/model/domain";
import { favouriteDomain } from "@/lib/store/slices/setting";
import { removeFavoriteDomain } from "@/lib/store/slices/favorite";

const useFavourite = (domain: Domain | null) => {
  const dispatch = useAppDispatch();

  const { favourites } = useAppSelector((state) => state.setting);

  const isFavourite = useMemo(
    () =>
      favourites.filter(
        (item) =>
          item.domainName === domain?.domainName &&
          item.chainId === domain?.chainId
      ).length !== 0,
    [favourites, domain]
  );

  const onFavourite = () => {
    if (!domain) return;
    if (!isFavourite) {
      toast.success("Added to your favorites");
    } else {
      toast.error("Removed from your favorites");
    }
    dispatch(favouriteDomain(domain));
    dispatch(removeFavoriteDomain(domain));
  };

  return { isFavourite, onFavourite };
};

export default useFavourite;
