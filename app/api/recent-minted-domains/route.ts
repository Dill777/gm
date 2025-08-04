import { fetchRecentMintedDomain } from "@/lib/api/domain";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mainnetOnly = searchParams.get("mainnetOnly") === "true";
  const domains = await fetchRecentMintedDomain(mainnetOnly);
  return Response.json(domains);
}
