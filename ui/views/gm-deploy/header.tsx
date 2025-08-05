"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

const GMDeployHeader = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "gm";

  return (
    <div className="text-center mb-8">
      {tab === "gm" ? (
        <>
          <h1 className="text-5xl tablet_md:text-2xl font-semibold mb-4 text-black tracking-tighter">
            Good Morning, BLOCKCHAIN!
          </h1>
          <p className="text-sm text-text2">
            Send your daily GM across the blockchain networks.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-5xl tablet_md:text-2xl font-semibold mb-4 text-black tracking-tighter">
            Deploy Smart Contract
          </h1>
          <p className="text-sm text-text2">
            Deploy Smart Contract in 1 click - on any network with ZNS
          </p>
        </>
      )}
    </div>
  );
};

export default GMDeployHeader;
