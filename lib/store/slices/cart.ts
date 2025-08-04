import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { NETWORKS } from "@/config/chains";

export interface CartDomainType {
  id: string;
  domainName: string;
  chainId: NETWORKS;
  price: string;
  reNewPrice: string;
  symbol: string;
  year: number;
  isCategory?: boolean;
  categoryKey?: string;
}

export interface CartStates {
  selectedChain: NETWORKS;
  domains: CartDomainType[];
}

const initialState: CartStates = {
  selectedChain: NETWORKS.DEFAULT,
  domains: [],
};

export const cartSlices = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartDomains: (
      state,
      action: PayloadAction<(CartDomainType | null)[]>
    ) => {
      const domains = action.payload.filter(Boolean) as CartDomainType[];
      state.domains = domains;
    },

    selectChain: (state, action: PayloadAction<NETWORKS>) => {
      if (action.payload === state.selectedChain) return;
      state.selectedChain = action.payload;
    },

    removeCartDomain: (state, action: PayloadAction<CartDomainType>) => {
      const data = action.payload;

      const { domainName, chainId } = data;

      const _domains = state.domains.filter((item) => {
        return item.domainName !== domainName || item.chainId !== chainId;
      });

      state.domains = _domains;
    },
    removeCartDomains: (state, action: PayloadAction<CartDomainType[]>) => {
      const domainsToRemove = action.payload;

      state.domains = state.domains.filter((item) => {
        return !domainsToRemove.some(
          ({ domainName, chainId }) =>
            item.domainName === domainName && item.chainId === chainId
        );
      });
    },
    handleCartDomainPeriod: (
      state,
      action: PayloadAction<
        CartDomainType & { isAdd?: boolean; updateAmount?: number }
      >
    ) => {
      const data = action.payload;
      const { domainName, chainId, isAdd, updateAmount } = data;
      const _carts = state.domains.map((item) => {
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

      state.domains = _carts;
    },
  },
});

export const {
  setCartDomains,
  handleCartDomainPeriod,
  removeCartDomain,
  removeCartDomains,
  selectChain,
} = cartSlices.actions;
