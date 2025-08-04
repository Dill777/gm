import { NETWORKS } from "@/config/chains";
import { getDomainById, getTotalDomains } from "@/lib/web3/service/domain";
import { getUser } from "../user";
import { Domain } from "@/lib/model/domain";
import { createDomain } from "../domain";

export const syncDomains = async (chainId: NETWORKS) => {
  const domains = await getTotalDomains(chainId);
  for (let idx = 0; idx < domains.length; idx++) {
    const domainId = Number(domains[idx]);
    const domainInfo = await getDomainById(domainId, chainId);
    if (
      domainInfo.owner === "0x0000000000000000000000000000000000000000" ||
      !domainInfo.domainName
    ) {
      continue;
    }
    const user = await getUser(domainInfo.owner);
    const data: Domain[] = [{ domainName: domainInfo.domainName, chainId }];
    if (user) {
      if (user?.id) {
        await createDomain(data);
        console.log("Domain Generated :", domainInfo.domainName, domainId);
      }
    }
  }
  console.log("Sync Domains is finished.");
};
