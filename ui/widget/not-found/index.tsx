import React, { FC, Suspense } from "react";
import Image from "@/ui/components/image";
import NotfoundAutoComplete from "../domain-autocomplete/not-found";

type NotFoundType = {
  label: string;
};
const NotFound: FC<NotFoundType> = ({ label }) => {
  return (
    <div className="flex flex-col space-y-[44px] pt-[50px] w-full max-w-[652px]">
      <div className="flex flex-col items-center w-full py-[20px] small:px-[20px] bg-black/40 rounded-2xl border border-main-200">
        <div className="flex items-center text-[36px] small:text-xl font-medium tablet:justify-center">
          <Image
            src="/img/empty/info.png"
            alt=""
            width={64}
            height={64}
            className="w-18 h-18 mobile:hidden"
          />
          <p className="text-center uppercase font-space_grotesk">{label}</p>
        </div>
        <p className="text-primary text-base font-normal text-center">
          Please choose your domain
        </p>
      </div>
      <Suspense>
        <NotfoundAutoComplete />
      </Suspense>
    </div>
  );
};

export default NotFound;
