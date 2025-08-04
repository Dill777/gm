import { MdOutlineFavorite } from "react-icons/md";
import Loading from "@/ui/components/loading";
import { cn } from "@/utils";

export const DomainItemLoading = () => {
  return (
    <div
      className={cn(
        "relative px-5 py-3 rounded-2xl bg-black/40 hover:bg-main-100 border border-main-300"
      )}
    >
      <div
        className={cn(
          "h-full flex items-center justify-between space-x-4 pr-[30px]",
          "tablet:flex-col tablet:items-start tablet:gap-3 tablet:space-x-0 tablet:pr-0"
        )}
      >
        <div className="flex items-center h-full space-x-4 w-full tablet:relative">
          <Loading loading className="" variant="avatar" />
          <Loading loading className="text-xl font-medium break-all" />
          <button className="absolute right-0 hidden tablet:block">
            <MdOutlineFavorite className="w-5 h-5 text-primary" />
          </button>
        </div>
        <div className="flex items-center justify-end space-x-5">
          <Loading
            loading
            className="w-[150px] text-primary text-base font-medium"
          />

          <Loading loading className="w-[90px]" />
          <button className="absolute right-3 tablet:hidden">
            <MdOutlineFavorite className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
};
