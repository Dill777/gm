import React from "react";
import Loading from "@/ui/components/loading";

const LoadingDomainItem = () => {
  return (
    <div className="flex items-center px-5 small:px-4 final:px-1 space-x-3 rounded-2xl bg-black/40 hover:bg-main-100">
      <div className="flex flex-1 items-center justify-between relative py-2 space-x-3 cursor-pointer">
        <Loading loading className="w-5 h-5 rounded-full" />
        <div className="flex items-center justify-start space-x-5 flex-1">
          <div className="flex items-center space-x-4 mobile:space-x-2">
            <Loading loading variant="avatar" />
            <Loading loading />
          </div>
        </div>
        <Loading loading className="w-[135px] tablet:hidden" />
        <Loading loading className="w-[130px] tablet:hidden" />
      </div>
      <Loading loading className="w-24 mobile:w-10 rounded-lg h-[38px]" />
    </div>
  );
};

export default LoadingDomainItem;
