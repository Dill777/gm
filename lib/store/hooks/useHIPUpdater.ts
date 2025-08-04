import { useCallback } from "react";
import { useAppDispatch } from "@/lib/store";
import { getHIPByAddress, getAllHIPs } from "@/lib/api/hip";
import { setHIPData } from "@/lib/store/slices/hip";

export const useHIPUpdater = () => {
  const dispatch = useAppDispatch();

  const fetchHIPData = useCallback(
    async (walletAddress: string) => {
      const hipData = await getHIPByAddress(walletAddress);

      if (hipData) {
        // Fetch all HIPs to calculate rank and total users
        const allHips = await getAllHIPs();
        const rankedHips = allHips
          .sort((a, b) => b.totalPoints - a.totalPoints)
          .map((hip, index) => ({
            ...hip,
            rank: index + 1,
          }));

        const myRank = rankedHips.find((item) => item.id === hipData.id)?.rank;

        dispatch(
          setHIPData({
            id: hipData.id,
            walletAddress,
            totalPoints: hipData.totalPoints,
            totalEarnings: hipData.totalEarnings,
            discordVerified: hipData.discordVerified,
            twitterVerified: hipData.twitterVerified,
            linkedinVerified: hipData.linkedinVerified,
            referralPoints: hipData.referralPoints,
            domainPoints: hipData.domainPoints,
            nftPoints: hipData.nftPoints,
            mainImgUrl: hipData.mainImgUrl || "",
            name: hipData.name || "",
            bio: hipData.bio || "",
            position: hipData.position || "",
            linkedinUrl: hipData.linkedin || "",
            discordUrl: hipData.discord || "",
            twitterUrl: hipData.twitter || "",
            rank: myRank,
            totalUsers: rankedHips.length,
          })
        );
      }
    },
    [dispatch]
  );

  return { fetchHIPData };
};
