"use client";
import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  memo,
} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import GMDeployFilters from "./filters";
import GMDashboard from "./gm-dashboard";
import DeployDashboard from "./deploy-dashboard";
import {
  CHAINS,
  mainnets,
  testnets,
  NETWORKS,
  hotChains,
  newChains,
} from "@/config/chains";
import GMCard from "./gm-card";
import DeployCard from "./deploy-card";
import { useAppSelector } from "@/lib/store";
import { useAggregatedGMData } from "@/lib/web3/hooks/read/useAggregatedGMData";
import { useAggregatedDeployData } from "@/lib/web3/hooks/read/useAggregatedDeployData";
import {
  CONTRACT_DATA_GM,
  CONTRACTS_GM,
  CONTRACT_DATA_DEPLOY,
  CONTRACTS_DEPLOY,
} from "@/config/contracts";

// Helper function to get chains that support GM
const getGMSupportedChains = () => {
  const supportedChainIds = Object.keys(
    CONTRACT_DATA_GM[CONTRACTS_GM.GM].addresses
  ).map(Number) as NETWORKS[];
  return CHAINS.filter((chain) => supportedChainIds.includes(chain.id));
};

// Helper function to get chains that support Deploy
const getDeploySupportedChains = () => {
  const supportedChainIds = Object.keys(
    CONTRACT_DATA_DEPLOY[CONTRACTS_DEPLOY.DEPLOY].addresses
  ).map(Number) as NETWORKS[];
  return CHAINS.filter((chain) => supportedChainIds.includes(chain.id));
};

// Memoized card components to prevent unnecessary re-renders
const MemoizedGMCard = memo(GMCard);
const MemoizedDeployCard = memo(DeployCard);

const GMDeployContent = ({ type }: { type: "gm" | "deploy" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("mainnets");
  const { favoriteChainIds } = useAppSelector((state) => state.chainFavorites);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInitialLoad = useRef(true);

  // Initialize search term and filter from URL on component mount
  useEffect(() => {
    if (isInitialLoad.current) {
      const currentSearchTerm = searchParams.get("search") || "";
      const currentFilter = searchParams.get("filter") || "mainnets";
      setSearchTerm(currentSearchTerm);
      setActiveFilter(currentFilter);
      isInitialLoad.current = false;
    }
  }, [searchParams]);

  // Update URL when search term or filter changes
  const updateURL = useCallback(
    (newSearchTerm: string, newFilter?: string) => {
      const urlParams = new URLSearchParams(searchParams);

      // Handle search parameter
      if (newSearchTerm.trim()) {
        urlParams.set("search", newSearchTerm);
      } else {
        urlParams.delete("search");
      }

      // Handle filter parameter - always set it
      const filterToSet = newFilter !== undefined ? newFilter : activeFilter;
      urlParams.set("filter", filterToSet);

      router.push(`${pathname}?${urlParams.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router, activeFilter]
  );

  // Get real aggregated GM data across all chains
  const {
    todayGMCount,
    thisWeekGMCount,
    totalGMsAllChains,
    isLoading: isLoadingGMData,
    error: gmDataError,
    fetchAggregatedGMData,
  } = useAggregatedGMData();

  // Get real aggregated Deploy data across all chains
  const {
    todayDeployCount,
    thisWeekDeployCount,
    totalDeploySCDeployed,
    isLoading: isLoadingDeployData,
    error: deployDataError,
    fetchAggregatedDeployData,
  } = useAggregatedDeployData();

  // Callback to refresh dashboard data after successful GM
  const handleGMSuccess = useCallback(async () => {
    // Refresh the aggregated GM data in real-time
    if (fetchAggregatedGMData) {
      try {
        await fetchAggregatedGMData();
      } catch (error) {
        console.error("Error refreshing aggregated GM data:", error);
      }
    }
  }, [fetchAggregatedGMData]);

  // Callback to handle successful deployments
  const handleDeploySuccess = useCallback(async () => {
    // Refresh the aggregated Deploy data in real-time
    if (fetchAggregatedDeployData) {
      try {
        await fetchAggregatedDeployData();
      } catch (error) {
        console.error("Error refreshing aggregated Deploy data:", error);
      }
    }
  }, [fetchAggregatedDeployData]);

  // Get all supported chains based on type (only calculated once)
  const allSupportedChains = useMemo(() => {
    const chains =
      type === "gm" ? getGMSupportedChains() : getDeploySupportedChains();

    // Sort chains by priority: Hot first (in config order), then New, then others
    return chains.sort((a, b) => {
      const aIsHot = hotChains.includes(a.id);
      const bIsHot = hotChains.includes(b.id);
      const aIsNew = newChains.includes(a.id);
      const bIsNew = newChains.includes(b.id);

      // Hot chains get highest priority
      if (aIsHot && !bIsHot) return -1;
      if (!aIsHot && bIsHot) return 1;

      // If both are hot, preserve the order from hotChains array
      if (aIsHot && bIsHot) {
        const aHotIndex = hotChains.indexOf(a.id);
        const bHotIndex = hotChains.indexOf(b.id);
        return aHotIndex - bHotIndex;
      }

      // If both are not hot, check for new chains
      if (!aIsHot && !bIsHot) {
        if (aIsNew && !bIsNew) return -1;
        if (!aIsNew && bIsNew) return 1;

        // If both are new, preserve the order from newChains array
        if (aIsNew && bIsNew) {
          const aNewIndex = newChains.indexOf(a.id);
          const bNewIndex = newChains.indexOf(b.id);
          return aNewIndex - bNewIndex;
        }
      }

      // If same priority, sort alphabetically by name
      return a.name.localeCompare(b.name);
    });
  }, [type]);

  // Function to check if a chain should be visible based on filters
  const isChainVisible = useCallback(
    (chain: (typeof allSupportedChains)[0]) => {
      // Filter by search term (name or id)
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          chain.name.toLowerCase().includes(searchLower) ||
          chain.shortName?.toLowerCase().includes(searchLower) ||
          chain.id.toString().includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // Apply additional filters
      if (activeFilter === "favourites") {
        return favoriteChainIds.includes(chain.id);
      } else if (activeFilter === "mainnets") {
        return mainnets.includes(chain.id);
      } else if (activeFilter === "testnets") {
        return testnets.includes(chain.id);
      } else if (activeFilter === "hot") {
        return hotChains.includes(chain.id);
      }

      return true;
    },
    [searchTerm, activeFilter, favoriteChainIds]
  );

  // Count visible chains for empty state
  const visibleChainCount = useMemo(() => {
    return allSupportedChains.filter(isChainVisible).length;
  }, [allSupportedChains, isChainVisible]);

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    updateURL(search);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    // Reset search term when filter changes so all chains are visible
    setSearchTerm("");
    updateURL("", filter);
  };

  // Helper function to check if a chain is hot (higher priority)
  const isHotChain = (chainId: NETWORKS) => hotChains.includes(chainId);

  // Helper function to check if a chain is new (only if not hot)
  const isNewChain = (chainId: NETWORKS) =>
    !isHotChain(chainId) && newChains.includes(chainId);

  return (
    <div className="w-full gap-8">
      <GMDeployFilters
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        searchTerm={searchTerm}
        activeFilter={activeFilter}
      />

      {/* Dashboard - Different for GM vs Deploy */}
      <div className="flex flex-col gap-5 mb-8">
        {gmDataError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">
              Error loading GM data: {gmDataError}
            </p>
          </div>
        )}

        {deployDataError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">
              Error loading Deploy data: {deployDataError}
            </p>
          </div>
        )}

        {type === "gm" ? (
          <GMDashboard
            todayGMCount={todayGMCount}
            thisWeekGMCount={thisWeekGMCount}
            totalGMsAllChains={totalGMsAllChains}
            isLoadingGMData={isLoadingGMData}
          />
        ) : (
          <DeployDashboard
            todayDeployCount={todayDeployCount}
            thisWeekDeployCount={thisWeekDeployCount}
            totalDeploySCDeployed={totalDeploySCDeployed}
            isLoadingDeployData={isLoadingDeployData}
          />
        )}
      </div>

      <div className="grid grid-cols-3 desktop:grid-cols-2 laptop:grid-cols-1 gap-5">
        {allSupportedChains.map((chain) => {
          const isVisible = isChainVisible(chain);
          const CardComponent =
            type === "gm" ? MemoizedGMCard : MemoizedDeployCard;
          return (
            <div
              key={chain.id}
              style={{ display: isVisible ? "block" : "none" }}
            >
              <CardComponent
                chainId={chain.id}
                isHot={isHotChain(chain.id)}
                isNew={isNewChain(chain.id)}
                onConnect={() => {}}
                {...(type === "gm" && { onGMSuccess: handleGMSuccess })}
                {...(type === "deploy" && {
                  onDeploySuccess: handleDeploySuccess,
                })}
              />
            </div>
          );
        })}
      </div>
      {visibleChainCount === 0 && (
        <div className="text-center text-text_body py-8">
          {activeFilter === "favourites" && searchTerm.trim() === ""
            ? "No favorite chains yet. Click the heart icon on any chain to add it to your favorites!"
            : activeFilter === "mainnets" && searchTerm.trim() === ""
            ? "No mainnet chains found."
            : activeFilter === "testnets" && searchTerm.trim() === ""
            ? "No testnet chains found."
            : activeFilter === "hot" && searchTerm.trim() === ""
            ? "No hot chains found."
            : `No chains found matching "${searchTerm}"`}
        </div>
      )}
    </div>
  );
};

export default GMDeployContent;
