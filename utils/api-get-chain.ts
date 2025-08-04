import { isChainSupported } from "@/config/chains";

export const getChainOnApi = (request: Request) => {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const chain = Number(params.get("chain"));
  if (isChainSupported(chain)) {
    return chain;
  }
  console.error("Not Support Chain");
  return null;
};
