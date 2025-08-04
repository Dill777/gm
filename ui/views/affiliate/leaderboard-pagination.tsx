"use client";
import { Button } from "@/ui/components/button";
import { cn } from "@/utils";
import { Pagination, PaginationItem } from "@mui/material";
import { useEffect, useState } from "react";

const LeaderboardPagination = ({
  curPage,
  pageCount,
  onPage,
}: {
  curPage: number;
  pageCount: number;
  onPage: (page: number) => void;
}) => {
  return (
    <>
      <div className="flex items-center gap-6 small:w-full small:justify-between">
        {/* pc */}
        <Pagination
          className="small:hidden"
          count={pageCount}
          page={curPage}
          onChange={(_e, v) => onPage(v)}
          siblingCount={1}
          boundaryCount={3}
          renderItem={(item) =>
            item.type === "start-ellipsis" ? (
              <p className="text-text_body3 text-base font-poppins font-normal leading-[135%]">
                ...
              </p>
            ) : item.type === "end-ellipsis" ? (
              <p className="text-text_body3 text-base font-poppins font-normal leading-[135%]">
                ...
              </p>
            ) : item.type === "previous" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="14"
                viewBox="0 0 20 14"
                fill="none"
                className={cn(
                  "w-[19.098px] h-[14.016px]",
                  curPage === 0
                    ? "text-text_body3"
                    : "cursor-pointer text-white hover:text-primary"
                )}
                onClick={() => onPage(curPage - 1)}
              >
                <path
                  d="M0.902344 7C0.902344 7.25629 1.00173 7.51853 1.19751 7.7157L1.19969 7.71808L7.19188 13.7103C7.58861 14.107 8.23171 14.107 8.62824 13.7103C9.02497 13.3137 9.02497 12.6706 8.62824 12.2741L4.36995 8.01563L18.9846 8.01563C19.5455 8.01563 20.0002 7.56098 20.0002 7.00001C20.0002 6.43903 19.5455 5.98438 18.9846 5.98438L4.36995 5.98438L8.62824 1.72589C9.02496 1.32936 9.02496 0.686264 8.62823 0.289734C8.2317 -0.106994 7.58861 -0.106995 7.19188 0.289734L1.19969 6.28192L1.19751 6.2845C1.00728 6.47592 0.902344 6.73578 0.902344 7Z"
                  fill="currentColor"
                />
              </svg>
            ) : item.type === "next" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="14"
                viewBox="0 0 20 14"
                className={cn(
                  "cursor-pointer",
                  "w-[19.098px] h-[14.016px]",
                  curPage === pageCount - 1
                    ? "text-text_body3"
                    : "cursor-pointer text-white hover:text-primary"
                )}
                onClick={() => onPage(curPage + 1)}
              >
                <path
                  d="M19.0977 7C19.0977 6.74371 18.9983 6.48147 18.8025 6.2843L18.8003 6.28192L12.8081 0.28973C12.4114 -0.106998 11.7683 -0.106998 11.3718 0.28973C10.975 0.68626 10.975 1.32936 11.3718 1.72589L15.63 5.98437L1.01543 5.98437C0.454455 5.98437 -0.000195795 6.43902 -0.000195844 6.99999C-0.000195893 7.56097 0.454455 8.01562 1.01543 8.01562L15.63 8.01562L11.3718 12.2741C10.975 12.6706 10.975 13.3137 11.3718 13.7103C11.7683 14.107 12.4114 14.107 12.8081 13.7103L18.8003 7.71808L18.8025 7.7155C18.9927 7.52408 19.0977 7.26422 19.0977 7Z"
                  fill="currentColor"
                />
              </svg>
            ) : item.page === curPage + 1 ? (
              <Button
                className={cn(
                  "w-10 h-10 p-0 bg-bg2 flex items-center justify-center rounded-2xl",
                  "cursor-pointer"
                )}
                onClick={() => onPage(curPage)}
              >
                <p
                  className={cn(
                    "text-white text-base font-poppins font-normal leading-[135%]"
                  )}
                >
                  {curPage + 1}
                </p>
              </Button>
            ) : (
              item.page !== null && (
                <p
                  className="text-text_body3 text-base font-poppins font-normal leading-[135%] cursor-pointer hover:text-primary"
                  onClick={() => onPage(item.page! - 1)}
                >
                  {item.page}
                </p>
              )
            )
          }
        />

        {/* mobile */}
        <Button
          className={cn(
            "w-[115px] small:w-[91px] h-9 p-[8px_28px] flex items-center justify-center rounded-lg border border-stroke/80 bg-[#0D0B10]",
            "cursor-pointer hover:border-primary/80",
            "hidden small:flex"
          )}
          onClick={() => onPage(curPage - 1)}
        >
          <p className="text-[#CECFD2] text-sm font-inter font-semibold">
            Previous
          </p>
        </Button>
        <p className="text-[#CECFD2] text-sm font-semibold hidden small:block">
          {curPage + 1} of {pageCount}
        </p>
        <Button
          className={cn(
            "w-[115px] small:w-[91px] h-9 p-[8px_28px] flex items-center justify-center rounded-lg border border-stroke/80 bg-[#0D0B10]",
            "cursor-pointer hover:border-primary/80",
            "hidden small:flex"
          )}
          onClick={() => onPage(curPage + 1)}
        >
          <p className="text-[#CECFD2] text-sm font-inter font-semibold">
            Next
          </p>
        </Button>
      </div>
    </>
  );
};

export default LeaderboardPagination;
