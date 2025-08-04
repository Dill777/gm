import React, { FC, useMemo } from "react";
import { Domain } from "@/lib/model/domain";
import { getChainColor } from "@/config/chains";
import { useTLD } from "@/ui/hooks/useTLD";

const DomainText: FC<Domain> = ({
  domainName = "",
  chainId,
  useChainColor = true,
}) => {
  const tld = useTLD(chainId);
  const chainColor = useMemo(() => getChainColor(chainId), [chainId]);

  return (
    <>
      {`${domainName}`}
      <span style={useChainColor ? { color: chainColor } : {}}>.{tld}</span>
    </>
  );
};

export default DomainText;
