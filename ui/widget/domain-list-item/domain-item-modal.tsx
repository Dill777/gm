import React, { FC, useMemo } from "react";
import { Button } from "@/ui/components/button";
import { useTLD } from "@/ui/hooks/useTLD";
import { shortenWalletAddress } from "@/utils/string-helper";
import { formatExpirationDate } from "@/utils/date-helper";
import DomainAvatar from "../domain-avatar";
import DomainText from "../domain-text";
import { UserDomainType } from "@/lib/store/slices/user-domains";

const DomainItemModal: FC<{
  data: UserDomainType;
}> = ({ data }) => {
  const { domainName, chainId, isPrimary, owner, expirationDate, domainId } =
    data;
  const tld = useTLD(data.chainId);
  const registrantAddress = useMemo(
    () => shortenWalletAddress(owner, 4),
    [owner]
  );
  const domainExpirationDate = useMemo(
    () => formatExpirationDate(expirationDate),
    [expirationDate]
  );

  return (
    <div className="bg-main-100 p-8 rounded-xl max-w-[450px] small:max-w-[320px] w-screen">
      <div className="flex flex-col justify-between items-center space-y-5">
        <DomainAvatar
          chainId={chainId}
          domainId={domainId}
          className="w-[150px] h-[150px]"
        />
        <div className="text-center">
          <div className="break-all text-[38px] small:text-[26px] font-medium w-full text-center inline bg-primary_gradient_text bg-clip-text text-transparent">
            <DomainText chainId={chainId} domainName={domainName} />
          </div>
          <br />
          {isPrimary && (
            <p className="inline-flex text-center items-center border-[0.5px] border-verified/60 rounded-xl text-xs font-medium px-2 py-[2px]">
              Primary
            </p>
          )}
        </div>
        <div className="flex flex-col w-full space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-xl  small:text-base text-main-400">Registrant</p>
            <p className="text-xl  small:text-base font-medium">
              {registrantAddress}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xl  small:text-base text-main-400">Expiration</p>
            <p className="text-xl  small:text-base font-medium">
              {domainExpirationDate}
            </p>
          </div>
        </div>
        <Button size="nm" className="w-full" href={`/${domainName}.${tld}`}>
          View Profile
        </Button>
      </div>
    </div>
  );
};

export default DomainItemModal;
