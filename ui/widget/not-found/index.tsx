import React, { FC, Suspense } from "react";
import Image from "@/ui/components/image";
import NotfoundAutoComplete from "../domain-autocomplete/not-found";

type NotFoundType = {
  label: string;
};
const NotFound: FC<NotFoundType> = ({ label }) => {
  return (
    <div className="flex flex-col space-y-8 py-8 w-full">
      <div className="flex flex-col items-center w-full small:px-[20px]">
        <p className="text-5xl small:text-2xl font-semibold text-center leading-normal tracking-tighter text-text3">
          {label}
        </p>
        <p className="text-text2 text-sm text-center">
          Get started by searching a domain
        </p>
      </div>
      <Suspense>
        <NotfoundAutoComplete />
      </Suspense>
    </div>
  );
};

export default NotFound;
