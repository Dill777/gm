import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const useTab = (tabNames: string[]) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const tab = searchParams.get("tab") ?? "";

  const getTabIndex = useCallback(
    (tabName: string) => tabNames.indexOf(tabName) + 1,
    [tabNames]
  );

  const [tabIndex, setTabIndex] = React.useState(() => getTabIndex(tab) || 1);

  const getTabName = useCallback(
    (index: number) => tabNames[index - 1] || "profile",
    [tabNames]
  );

  useEffect(() => {
    if (tab) {
      setTabIndex(getTabIndex(tab) || 1);
    }
  }, [tab, getTabIndex]);

  const onTab = useCallback(
    (index: number) => {
      const tabName = getTabName(index);
      const urlParams = new URLSearchParams(searchParams);
      urlParams.set("tab", tabName);
      router.push(`${pathname}?${urlParams}`, { scroll: false });
      setTabIndex(index);
    },
    [pathname, searchParams]
  );

  return { tabIndex, onTab };
};

export const useTabStatus = (tabNames: string[]) => {
  const [tabIndex, setTabIndex] = useState<number>(1);

  const getTabIndex = useCallback(
    (tabName: string): number => tabNames.indexOf(tabName) + 1,
    [tabNames]
  );

  const onTab = useCallback((index: number): void => {
    setTabIndex(index);
  }, []);

  useEffect(() => {
    const tab = tabNames[tabIndex - 1] || tabNames[0];
    setTabIndex(getTabIndex(tab));
  }, [tabNames, getTabIndex, tabIndex]);

  return { tabIndex, onTab };
};
