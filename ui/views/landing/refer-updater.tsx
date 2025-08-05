"use client";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";

const ReferUpdater = () => {
  const searchParams = useSearchParams();
  const ref = useMemo(() => searchParams.get("ref") ?? "", [searchParams]);
  useEffect(() => {
    if (ref) {
      localStorage.setItem("refCode", ref);
    }
  }, [ref]);

  return null;
};

export default ReferUpdater;
