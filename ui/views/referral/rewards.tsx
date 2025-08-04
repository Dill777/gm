import { RewardIcon } from "@/ui/components/icon/referral/RewardIcon";
import { cn } from "@/utils";
import { RewardInfo, REWARDS } from "@/utils/constant";

interface RewardsProps {
  totalReferrals: number;
  currentLevel: RewardInfo;
  nextLevel: RewardInfo;
}
const Rewards = ({ totalReferrals, currentLevel, nextLevel }: RewardsProps) => {
  return (
    <>
      <div className="flex flex-col items-stretch p-[30px] gap-6 bg-bg3 rounded-2xl">
        {/* title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 small:flex-col small:items-start">
            <p className="text-white font-poppins text-lg font-normal leading-[135%]">
              <span className="font-semibold">{totalReferrals}</span>/
              {nextLevel.refer}
            </p>
            <p className="text-text_body3 font-poppins text-lg font-normal leading-[135%] small:text-xs">
              Current Refferals Score
            </p>
          </div>

          <div className="rounded-3xl p-[1px] bg-[linear-gradient(to_right,_#975E4D,_#628DBE,_#C244C9,_#A1A464,_#905858,_#975E4D)]">
            <div className="rounded-3xl bg-bg3 flex items-center justify-center gap-2 p-[6px_16px]">
              <p className="text-white font-poppins text-lg font-semibold leading-[135%] small:text-sm">
                {currentLevel.reward}%
              </p>
              <p className="text-text_body3 font-poppins text-lg font-normal leading-[135%] small:text-sm">
                rewards
              </p>
            </div>
          </div>
        </div>

        {/* score */}
        <div
          className={cn(
            "flex flex-col items-stretch gap-[11px]",
            "small:hidden"
          )}
        >
          <div className="h-3 mx-12 relative">
            <div
              className={cn(
                "absolute -translate-y-1/2 top-1/2 right-0 z-10",
                "w-full",
                "h-[4px]",
                "bg-[linear-gradient(to_right,_#1C96FD,_#33E360,_#F4C630,_#CB1245,_#AD00FE)]"
              )}
            ></div>
            <div
              className={cn(
                "absolute -translate-y-1/2 top-1/2  right-0 z-20",
                "h-[4px] bg-[#363940]"
              )}
              style={{
                width: `${
                  100 -
                  (currentLevel.percent +
                    (((totalReferrals - currentLevel.refer) * 100) /
                      (nextLevel.refer - currentLevel.refer)) *
                      (nextLevel.percent - currentLevel.percent))
                }%`,
              }}
            ></div>
            {REWARDS.map((reward) => (
              <RewardIcon
                key={`${reward.refer}`}
                fill={totalReferrals >= reward.refer ? "white" : "black"}
                stroke={reward.color}
                left={`${reward.percent}%`}
                className={cn("absolute z-30")}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            {REWARDS.map((reward) => (
              <div
                key={`${reward.refer}`}
                className="flex flex-col gap-[7px] items-center"
              >
                <p className="text-text_body3 font-poppins text-base font-normal leading-[100%]">
                  {reward.refer} referral
                </p>
                <p className="text-white font-poppins text-base font-medium leading-[100%]">
                  {reward.reward}% reward
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* score - mobile */}
        <div className={cn("flex gap-[15px] h-[300px]", "hidden small:flex")}>
          <div className="w-3 my-2 relative">
            <div
              className={cn(
                "absolute -translate-x-1/2 left-1/2 bottom-0 z-10",
                "h-full",
                "w-[4px]",
                "bg-[linear-gradient(to_bottom,_#1C96FD,_#33E360,_#F4C630,_#CB1245,_#AD00FE)]"
              )}
            ></div>
            <div
              className={cn(
                "absolute -translate-x-1/2 left-1/2 bottom-0 z-20",
                "w-[4px] bg-[#363940]"
              )}
              style={{
                height: `${
                  100 -
                  (currentLevel.percent +
                    (((totalReferrals - currentLevel.refer) * 100) /
                      (nextLevel.refer - currentLevel.refer)) *
                      (nextLevel.percent - currentLevel.percent))
                }%`,
              }}
            ></div>
            {REWARDS.map((reward) => (
              <RewardIcon
                key={`${reward.refer}`}
                fill={totalReferrals >= reward.refer ? "white" : "black"}
                stroke={reward.color}
                top={`${reward.percent}%`}
                className={cn("absolute z-30")}
                vertical
              />
            ))}
          </div>
          <div className="flex flex-col justify-between">
            {REWARDS.map((reward) => (
              <div key={`${reward.refer}`} className="flex gap-2 items-center">
                <p className="text-text_body3 font-poppins text-base font-normal leading-[100%]">
                  {reward.refer} referral
                </p>
                <p className="text-white font-poppins text-base font-medium leading-[100%]">
                  {reward.reward}% reward
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Rewards;
