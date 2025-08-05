"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import TabsV2Item from "./tab-v2-item";
import { cn } from "@/utils";

export type TabV2ItemDataType = {
  label: string | ReactNode | ReactNode[];
  selectedLabel?: string | ReactNode | ReactNode[];
  value: string;
  content: ReactNode | ReactNode[];
  className?: string;
  selectedClassName?: string;
};
const TabsV2 = ({
  className,
  tabs,
  selectedClassName,
}: {
  className?: string;
  tabs: TabV2ItemDataType[];
  selectedClassName?: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedTab, setSelectedTab] = useState(tabs[0].value);

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const tab = urlParams.get("tab") ?? "";
    const tabIndex = tabs.findIndex((item) => tab === item.value);
    if (tabIndex !== -1) setSelectedTab(tab);
  }, [searchParams]);

  const onTab = useCallback(
    (tab: string) => {
      setSelectedTab(tab);
      const urlParams = new URLSearchParams(searchParams);
      urlParams.set("tab", tab);
      router.push(`${pathname}?${urlParams}`, {
        scroll: false,
      });
    },
    [searchParams, router]
  );

  return (
    <>
      {/* header */}
      <div className="w-fit h-fit mobile_md:w-full overflow-scroll hide-scroll-bar">
        <div
          className={cn(
            "bg-white",
            "flex items-center justify-between",
            "rounded-[10px]",
            "w-fit h-fit p-[4.5px_6px] shadow-shadow2",
            className ?? ""
          )}
        >
          {tabs.map((tab, index) => (
            <TabsV2Item
              key={`tab-${index + 1}`}
              selected={selectedTab === tab.value}
              onSelect={() => onTab(tab.value)}
              item={tab}
              className={selectedClassName}
            />
          ))}
        </div>
      </div>

      {/* content */}
      {tabs.filter((tab) => tab.value === selectedTab)[0].content}
    </>
  );
};

export default TabsV2;
