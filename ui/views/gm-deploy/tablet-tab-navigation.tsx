"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/utils";

type TabletTabNavigationProps = {
  activeTab: "GM" | "Dashboard";
};

const TabletTabNavigation = ({ activeTab }: TabletTabNavigationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (tab: "GM" | "Dashboard") => {
    const params = new URLSearchParams(searchParams);
    if (tab === "GM") {
      params.delete("tabletTab");
    } else {
      params.set("tabletTab", tab);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex">
      <button
        onClick={() => handleTabChange("GM")}
        className={cn(
          "flex-1 py-3 px-4 text-center font-medium transition-colors border-b-2 border-light_gray2",
          activeTab === "GM"
            ? "border-primary text-primary"
            : "text-text2 hover:text-primary"
        )}
      >
        GM
      </button>
      <button
        onClick={() => handleTabChange("Dashboard")}
        className={cn(
          "flex-1 py-3 px-4 text-center font-medium transition-colors border-b-2 border-light_gray2",
          activeTab === "Dashboard"
            ? "border-primary text-primary"
            : "text-text2 hover:text-primary"
        )}
      >
        Dashboard
      </button>
    </div>
  );
};

export default TabletTabNavigation;
