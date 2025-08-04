"use client";
import React, { useState, useMemo, useCallback } from "react";
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

const GMDeployContent = ({ type }: { type: "gm" | "deploy" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const { favoriteChainIds } = useAppSelector((state) => state.chainFavorites);

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

  // Filter chains based on search term (by name or id) and active filter
  const filteredChains = useMemo(() => {
    let filtered = CHAINS;

    // Filter by search term (name or id)
    if (searchTerm.trim()) {
      filtered = filtered.filter((chain) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          chain.name.toLowerCase().includes(searchLower) ||
          chain.shortName?.toLowerCase().includes(searchLower) ||
          chain.id.toString().includes(searchTerm)
        );
      });
    }

    // Apply additional filters
    if (activeFilter === "Favourites") {
      filtered = filtered.filter((chain) =>
        favoriteChainIds.includes(chain.id)
      );
    } else if (activeFilter === "Mainnets") {
      filtered = filtered.filter((chain) => mainnets.includes(chain.id));
    } else if (activeFilter === "Testnets") {
      filtered = filtered.filter((chain) => testnets.includes(chain.id));
    } else if (activeFilter === "Hot") {
      filtered = filtered.filter((chain) => hotChains.includes(chain.id));
    }

    // Sort chains by priority: Hot first (in config order), then New, then others
    return filtered.sort((a, b) => {
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
  }, [searchTerm, activeFilter, favoriteChainIds]);

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
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
        {filteredChains.map((chain) => {
          const CardComponent = type === "gm" ? GMCard : DeployCard;
          return (
            <CardComponent
              key={chain.id}
              chainId={chain.id}
              isHot={isHotChain(chain.id)}
              isNew={isNewChain(chain.id)}
              onConnect={() => {}}
              {...(type === "gm" && { onGMSuccess: handleGMSuccess })}
              {...(type === "deploy" && {
                onDeploySuccess: handleDeploySuccess,
              })}
            />
          );
        })}
      </div>
      {filteredChains.length === 0 && (
        <div className="text-center text-text_body py-8">
          {activeFilter === "Favourites" && searchTerm.trim() === ""
            ? "No favorite chains yet. Click the heart icon on any chain to add it to your favorites!"
            : activeFilter === "Mainnets" && searchTerm.trim() === ""
            ? "No mainnet chains found."
            : activeFilter === "Testnets" && searchTerm.trim() === ""
            ? "No testnet chains found."
            : activeFilter === "Hot" && searchTerm.trim() === ""
            ? "No hot chains found."
            : `No chains found matching "${searchTerm}"`}
        </div>
      )}
    </div>
  );
};

export default GMDeployContent;
