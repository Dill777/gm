import { useState, useCallback, useEffect, useMemo } from "react";
import { isEmpty } from "lodash";
import { formatEther, parseEther } from "viem";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAccount, useBalance, useWaitForTransactionReceipt } from "wagmi";
import { createDomain } from "@/lib/api/domain";
import usePriceCredit from "@/lib/web3/hooks/usePriceCredit";
import { useWriteContract } from "@/lib/web3/hooks/core/useWriteContract";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { cartDomains, setPurchased } from "@/lib/store/slices/setting";
import { CartDomainType, removeCartDomains } from "@/lib/store/slices/cart";
import { updateRefer } from "@/lib/api/referral";
import { CONTRACTS } from "@/config/contracts";
import { getSanitizedValue } from "@/utils";
import { useInvalidateQuery } from "@/lib/store/hooks/useInvalidateQuery";
import { fireConfetti } from "@/utils/fire";
import { useCostWithGas } from "@/lib/web3/hooks/core/useEstimateGas";
import { updateDomainCategories } from "@/lib/api/domain/category";
import { CategoryKey } from "../views/search/category-view";

export const useCheckout = (successCallback?: () => void) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, userCredit } = useAppSelector((state) => state.user);
  const { domains, selectedChain } = useAppSelector((state) => state.cart);
  const { address } = useAccount();
  const { data: userBalance } = useBalance({ address });
  const [creditAmount, setCreditAmount] = useState<number | "">(""); // Currently 1 USD = 1 Credit

  const formatedCreditAmount = useMemo(() => {
    if (creditAmount === "") return 0;
    return creditAmount;
  }, [creditAmount]);

  const { invalidateCredit, invalidateUserPDomain, invalidateUserDomains } =
    useInvalidateQuery();
  const refer = useMemo(() => {
    if (!user || user.refer === address || isEmpty(user.refer)) {
      return "0x0000000000000000000000000000000000000000";
    }
    return user.refer ?? "0x0000000000000000000000000000000000000000";
  }, [user, address]);

  const [domainsProcessed, setDomainsProcessed] = useState(false);
  const [extendedProcessing, setExtendedProcessing] = useState(false);

  const { priceInUSD } = usePriceCredit();
  const {
    data: hash,
    error,
    isPending,
    isError,
    reset,
    callWriteContract,
  } = useWriteContract();

  const { isSuccess, isLoading } = useWaitForTransactionReceipt({
    hash,
  });

  const selectedDomains = useMemo(
    () => domains.filter((item) => item.chainId === selectedChain),
    [domains, selectedChain]
  );

  const totalPrice = useMemo(() => {
    return selectedDomains.reduce((sum, item) => {
      const { price, reNewPrice, year: purchaseYear } = item;
      const additionalYears = purchaseYear - 1;
      return (
        sum +
        parseEther(price) +
        parseEther(reNewPrice) * BigInt(additionalYears)
      );
    }, BigInt(0));
  }, [selectedDomains]);

  const creditPrice = useMemo(() => {
    return priceInUSD !== 0 ? formatedCreditAmount / priceInUSD : 0;
  }, [priceInUSD, formatedCreditAmount]);

  const finalPrice = useMemo(() => {
    const _price = totalPrice - parseEther(creditPrice.toString());
    return _price > BigInt(0) ? _price : BigInt(0);
  }, [totalPrice, creditPrice]);

  const creditMaxAmount = useMemo(() => {
    if (!priceInUSD) return 0;

    // Get oracle price (priceInUSD is already available from usePriceCredit)
    const oraclePriceBigInt = BigInt(Math.floor(priceInUSD * 1e18));

    // Calculate max: (priceToRegister * oraclePrice) / 1e18
    const maxBigInt = (totalPrice * oraclePriceBigInt) / BigInt(1e18);

    // Convert to number for comparison with userCredit
    // Use parseFloat and toFixed to handle floating point precision issues
    const max = parseFloat(Number(formatEther(maxBigInt)).toFixed(10));

    return userCredit > max ? max : userCredit;
  }, [totalPrice, priceInUSD, userCredit]);

  const isProcessing = useMemo(
    () => (isLoading && !!hash) || isPending || extendedProcessing,
    [isLoading, hash, isPending, extendedProcessing]
  );
  useEffect(() => {
    setCreditAmount("");
  }, [selectedChain]);

  useEffect(() => {
    const handleTransactionSuccess = async () => {
      if (isSuccess && user && !domainsProcessed) {
        try {
          setExtendedProcessing(true);
          reset();
          if (refer !== "0x0000000000000000000000000000000000000000") {
            updateRefer(refer, selectedChain);
          }
          dispatch(setPurchased(true));
          invalidateUserDomains();
          if (formatedCreditAmount > 0) invalidateCredit();
          removePurchasedDomains(selectedDomains);

          // update CategoryDomain "taken"
          const takenCategoryDomains = selectedDomains
            .filter((selectedDomain) => selectedDomain.isCategory)
            .reduce((prev, cur) => {
              return prev[cur.categoryKey!]
                ? {
                    ...prev,
                    [cur.categoryKey!]: prev[cur.categoryKey!] + 1,
                  }
                : { ...prev, [cur.categoryKey!]: 1 };
            }, {} as { [prop: string]: number });
          Object.keys(takenCategoryDomains).length > 0 &&
            (await updateDomainCategories(takenCategoryDomains));

          await createDomain(selectedDomains);
          successCallback && successCallback();
          invalidateUserPDomain();
          router.push("/my-domains");
          fireConfetti();
          setDomainsProcessed(true);
          toast.success("Your domains are purchased successfully!");
        } catch (error) {
          toast.error(`Domain registration failed!`);
        } finally {
          setExtendedProcessing(false);
        }
      }
    };

    handleTransactionSuccess();
  }, [
    isSuccess,
    user,
    refer,
    selectedChain,
    selectedDomains,
    domainsProcessed,
  ]);

  useEffect(() => {
    if (isError) {
      console.error("Error : ", error);
      toast.error(`Transaction has canceled`);
    }
  }, [isError, error]);

  const onCreditAmountChange = useCallback(
    (value: string) => {
      const amount = getSanitizedValue(value);
      if (amount > creditMaxAmount) return;
      if (value === "") setCreditAmount("");
      else setCreditAmount(amount);
    },
    [creditMaxAmount]
  );

  const onMaxAmount = () => {
    setCreditAmount(creditMaxAmount);
  };

  const validateDomainsToPurchase = () => {
    if (selectedDomains.length < 1) {
      toast.error("Please add your domains to purchase");
      return false;
    }
    const hasInvalidDomain =
      selectedDomains.findIndex((item) => Number(item.id)) > -1;
    if (hasInvalidDomain) {
      toast.error("You have some invalid domains");
      return false;
    }
    return true;
  };

  const purchaseCall = useMemo(() => {
    const _creditAmount = parseEther(
      formatedCreditAmount.toString()
    ).toString();

    const _owners: string[] = [];
    const _domains: string[] = [];
    const _expires: number[] = [];
    selectedDomains.forEach((domain) => {
      _owners.push(address ?? "");
      _domains.push(domain.domainName);
      _expires.push(domain.year);
    });
    return {
      contract: CONTRACTS.REGISTRY,
      functionName: "registerDomains",
      value: finalPrice.toString(),
      args: [_owners, _domains, _expires, refer, _creditAmount],
    };
  }, [formatedCreditAmount, address, selectedDomains]);

  const { value: costWithGas } = useCostWithGas(purchaseCall, selectedChain);

  const isEnoughBalance = useMemo(() => {
    // console.log(costWithGas, userBalance, finalPrice);
    if (costWithGas) {
      return userBalance && userBalance?.value >= Number(costWithGas);
    }
    return userBalance && userBalance?.value >= finalPrice;
  }, [costWithGas, userBalance, finalPrice]);

  const onCheckout = useCallback(() => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }
    const isValid = validateDomainsToPurchase();
    if (!isValid) {
      return;
    }

    const _creditAmount = parseEther(formatedCreditAmount.toString());

    const _owners: string[] = [];
    const _domains: string[] = [];
    const _expires: number[] = [];
    selectedDomains.forEach((domain) => {
      _owners.push(address);
      _domains.push(domain.domainName);
      _expires.push(domain.year);
    });
    if (isEnoughBalance) {
      callWriteContract({
        contract: CONTRACTS.REGISTRY,
        functionName: "registerDomains",
        value: finalPrice,
        args: [_owners, _domains, _expires, refer, _creditAmount],
      });
    }
  }, [
    isEnoughBalance,
    selectedDomains,
    formatedCreditAmount,
    finalPrice,
    refer,
    userBalance,
    address,
    callWriteContract,
  ]);

  const removePurchasedDomains = useCallback(
    (data: CartDomainType[]) => {
      dispatch(cartDomains(data));
      dispatch(removeCartDomains(data));
    },
    [dispatch]
  );

  return {
    selectedDomains,
    isEnoughBalance,
    isProcessing,
    totalPrice,
    creditPrice,
    finalPrice,
    creditAmount,
    onCreditAmountChange,
    onMaxAmount,
    onCheckout,
  };
};
