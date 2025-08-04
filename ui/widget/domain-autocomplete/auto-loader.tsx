import { cn } from "@/utils";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const loader = (isLoading: boolean, status: boolean | string) => (
  <div className="flex">
    {isLoading ? (
      <AiOutlineLoading3Quarters className="w-5 h-5 loading-icon" />
    ) : status === "" ? (
      ""
    ) : status ? (
      <div
        className={cn(
          "flex items-center justify-center",
          "w-[86px] h-[26px] rounded-[7px] border-[0.5px] border-[rgba(5,171,255,0.60)] bg-[rgba(5,171,255,0.10)]",
          "text-[rgba(5,171,255,0.68)] font-poppins text-xs font-medium leading-[160%] capitalize"
        )}
      >
        Available
      </div>
    ) : (
      <div
        className={cn(
          "flex items-center justify-center",
          "w-[86px] h-[26px] rounded-[7px] border-[0.5px] border-[rgba(255,5,5,0.60)] bg-[rgba(255,5,5,0.10)]",
          "text-[rgba(255,5,5,0.68)] font-poppins text-xs font-medium leading-[160%] capitalize"
        )}
      >
        Unavailable
      </div>
    )}
  </div>
);
