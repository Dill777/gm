"use client";
import nProgress from "nprogress";
import React, { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const NProgressDone = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    nProgress.done();
  }, [pathname, searchParams]);
  return null;
};

const Progress = () => {
  return (
    <Suspense fallback={null}>
      <NProgressDone />
    </Suspense>
  );
};

export default Progress;
