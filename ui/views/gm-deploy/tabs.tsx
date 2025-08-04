"use client";
import React, { Suspense } from "react";
import { cn } from "@/utils";
import TabsV2, { TabV2ItemDataType } from "@/ui/widget/tabs-v2";
import GMDeployContent from "./content";
import { FlashIcon } from "@/ui/components/icon/FlashIcon";

const GMDeployTabs = () => {
  const tabs: TabV2ItemDataType[] = [
    {
      label: (
        <>
          <p className="text-sm text-nowrap laptop_md:text-xs">
            👋🏻 Say GM on Blockchain
          </p>
        </>
      ),
      value: "gm",
      content: <GMDeployContent type="gm" />,
    },
    {
      label: (
        <div className="flex items-center gap-1.5">
          <FlashIcon className="w-3.5 h-3.5" />
          <p className="text-sm text-nowrap laptop_md:text-xs">
            Deploy Smart Contract
          </p>
        </div>
      ),
      value: "deploy",
      content: <GMDeployContent type="deploy" />,
    },
  ];

  return (
    <div
      className={cn(
        "mx-auto",
        "flex flex-col items-center gap-8",
        "laptop_md:w-full",
        "mobile:w-full"
      )}
    >
      <Suspense>
        <TabsV2
          tabs={tabs}
          className="mx-auto"
          selectedClassName="w-fit px-2 py-1.5"
        />
      </Suspense>
    </div>
  );
};

export default GMDeployTabs;
