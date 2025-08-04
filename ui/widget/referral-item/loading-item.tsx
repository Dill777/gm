import React, { FC } from "react";
import Loading from "@/ui/components/loading";

const LoadingDomainItem: FC<{ isMine?: boolean }> = ({ isMine }) => {
  return (
    <div className="flex items-center py-2 px-5 small:px-4 small:py-1 final:px-1 rounded-2xl bg-black mt-[3px]">
      <div className="sticky mobile:block left-0 w-7 bg-black px-0.5">
        <Loading loading className="w-5 h-5 rounded-full" />
      </div>
      <div className="sticky flex-1 w-max mobile:left-0 left-7 bg-black shrink-0 px-6 mobile:px-3">
        <div className="flex items-center space-x-4 mobile:space-x-2 h-[40px]">
          <Loading loading />
        </div>
      </div>
      {false && isMine && (
        <td className="w-[150px] px-3 text-left text-success font-medium flex justify-center">
          <Loading loading className="w-[50px]" />
        </td>
      )}
      <div className="w-[150px] px-3 text-left text-success font-medium flex justify-center">
        <Loading loading className="w-[50px]" />
      </div>
      <div className="w-[200px] px-3 text-right flex justify-end">
        <Loading loading className="w-[100px]" />
      </div>
    </div>
  );
};

export default LoadingDomainItem;
