import { useCallback, useEffect, useMemo, useState } from "react";

export const usePagination = <T = any>({
  rows,
  pageSize = 5,
}: {
  rows: T[];
  pageSize?: number;
}): {
  currentPageIndex: number;
  currentPageRows: T[];
  totalRowsCount: number;
  pageCount: number;
  go2Page: (page: number) => void;
} => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [totalRowsCount, setTotalRowsCount] = useState(rows.length);
  const [pageCount, setPageCount] = useState(
    Math.floor((rows.length + pageSize - 1) / pageSize)
  );

  useEffect(() => {
    setTotalRowsCount(rows.length);
    setPageCount(Math.floor((rows.length + pageSize - 1) / pageSize));
  }, [rows, pageSize]);

  const currentPageRows = useMemo(
    () =>
      rows.slice(
        pageSize * currentPageIndex,
        Math.min(pageSize * currentPageIndex + pageSize, totalRowsCount)
      ),
    [rows, currentPageIndex, totalRowsCount, pageSize]
  );

  const go2Page = useCallback(
    (page: number) => {
      if (page < 0 || page >= pageCount) return null;
      setCurrentPageIndex(page);
    },
    [pageCount]
  );

  return {
    currentPageIndex,
    currentPageRows,
    totalRowsCount,
    pageCount,
    go2Page,
  };
};
