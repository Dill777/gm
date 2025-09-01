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
import { useSingleChainGMData } from "@/lib/web3/hooks/read/useSingleChainGMData";
import { useSingleChainDeployData } from "@/lib/web3/hooks/read/useSingleChainDeployData";
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

  // Get refresh functions for individual chain data
  const { fetchGMDataForChain } = useSingleChainGMData();

  const { fetchDeployDataForChain } = useSingleChainDeployData();

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
    return chains;
  }, [type]);

  // Memoize search term processing
  const processedSearchTerm = useMemo(() => {
    const trimmed = searchTerm.trim();
    return trimmed ? trimmed.toLowerCase() : null;
  }, [searchTerm]);

  // Function to check if a chain should be visible based on filters
  const isChainVisible = useCallback(
    (chain: (typeof allSupportedChains)[0]) => {
      // Filter by search term (name or id)
      if (processedSearchTerm) {
        const matchesSearch =
          chain.name.toLowerCase().includes(processedSearchTerm) ||
          chain.shortName?.toLowerCase().includes(processedSearchTerm) ||
          chain.id.toString().includes(processedSearchTerm);
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
    [processedSearchTerm, activeFilter, favoriteChainIds]
  );

  // Filter chains to only show visible ones and pre-compute hot/new status
  const visibleChains = useMemo(() => {
    return allSupportedChains.filter(isChainVisible).map((chain) => ({
      ...chain,
      isHot: hotChains.includes(chain.id),
      isNew: !hotChains.includes(chain.id) && newChains.includes(chain.id),
    }));
  }, [allSupportedChains, isChainVisible, hotChains, newChains]);

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
              Error loading GM Dashboard data: {gmDataError}
            </p>
          </div>
        )}

        {deployDataError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">
              Error loading Deploy Dashboard data: {deployDataError}
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
        {visibleChains.map((chain) => {
          if (type === "gm") {
            return (
              <MemoizedGMCard
                key={chain.id}
                chainId={chain.id}
                isHot={chain.isHot}
                isNew={chain.isNew}
                onGMSuccess={handleGMSuccess}
                loadData={fetchGMDataForChain}
              />
            );
          } else {
            return (
              <MemoizedDeployCard
                key={chain.id}
                chainId={chain.id}
                isHot={chain.isHot}
                isNew={chain.isNew}
                onDeploySuccess={handleDeploySuccess}
                loadData={fetchDeployDataForChain}
              />
            );
          }
        })}
      </div>
      {visibleChains.length === 0 && (
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
