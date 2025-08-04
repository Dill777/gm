import { RewardIcon } from "@/ui/components/icon/referral/RewardIcon";
import { cn } from "@/utils";
import { GMDashboardInfo, GM_DASHBOARD } from "@/utils/constant";

// Utility function to calculate current and next levels based on total GM count
const calculateGMLevels = (
  totalGMs: number
): { currentLevel: GMDashboardInfo; nextLevel: GMDashboardInfo } => {
  // Handle case where user has no GMs or less than first level requirement
  if (totalGMs < GM_DASHBOARD[0].gm) {
    return {
      currentLevel: {
        level: 0,
        gm: 0,
        color: GM_DASHBOARD[0].color,
        percent: 0,
      }, // Virtual level 0
      nextLevel: GM_DASHBOARD[0], // First actual level
    };
  }

  // Find the current level - the highest level where gm requirement is met
  let currentLevel = GM_DASHBOARD[0]; // Default to first level

  for (let i = GM_DASHBOARD.length - 1; i >= 0; i--) {
    if (totalGMs >= GM_DASHBOARD[i].gm) {
      currentLevel = GM_DASHBOARD[i];
      break;
    }
  }

  // Find the next level - the next level after current
  const currentIndex = GM_DASHBOARD.findIndex(
    (level) => level.level === currentLevel.level
  );
  const nextLevel =
    currentIndex < GM_DASHBOARD.length - 1
      ? GM_DASHBOARD[currentIndex + 1]
      : GM_DASHBOARD[GM_DASHBOARD.length - 1]; // If at max level, next is same as current

  return { currentLevel, nextLevel };
};

interface GMDashboardProps {
  todayGMCount?: number;
  thisWeekGMCount?: number;
  totalGMsAllChains?: number;
  isLoadingGMData?: boolean;
}

const GMDashboard = ({
  todayGMCount = 0,
  thisWeekGMCount = 0,
  totalGMsAllChains = 0,
  isLoadingGMData = false,
}: GMDashboardProps) => {
  // Calculate current and next levels based on total GM count
  const { currentLevel, nextLevel } = calculateGMLevels(totalGMsAllChains);

  // Calculate progress percentage safely
  const calculateProgressPercentage = () => {
    // If at max level or next level is same as current, show 100% progress
    if (
      currentLevel.level === nextLevel.level ||
      nextLevel.gm === currentLevel.gm
    ) {
      return currentLevel.percent;
    }

    // Calculate progress towards next level
    const progressInLevel = Math.max(0, totalGMsAllChains - currentLevel.gm);
    const totalLevelRange = nextLevel.gm - currentLevel.gm;
    const levelProgressPercent = Math.min(1, progressInLevel / totalLevelRange);
    const percentRange = nextLevel.percent - currentLevel.percent;

    return currentLevel.percent + levelProgressPercent * percentRange;
  };

  const progressPercentage = calculateProgressPercentage();

  return (
    <>
      <div className="flex flex-col items-stretch p-[30px] gap-6 bg-white rounded-2xl">
        {/* title */}
        <div className="flex flex-row desktop:flex-col items-center desktop:items-start justify-between gap-4">
          <div className="flex items-center gap-2 small:flex-col small:items-start">
            <p className="text-black text-lg small:text-xs font-semibold">
              Your GM Dashboard
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-3xl p-[1px] bg-gradient_cheap_primary">
              <div className="rounded-3xl bg-white flex laptop:flex-col flex-row items-center laptop:items-start justify-center gap-2 p-[6px_16px]">
                <p className="text-text3/60 text-lg font-semibold small:text-sm">
                  {isLoadingGMData ? "..." : todayGMCount}
                </p>
                <p className="text-text2 small:text-xs">GM Today</p>
              </div>
            </div>
            <div className="rounded-3xl p-[1px] bg-gradient_cheap_primary">
              <div className="rounded-3xl bg-white flex laptop:flex-col flex-row items-center laptop:items-start justify-center gap-2 p-[6px_16px]">
                <p className="text-text3/60 text-lg font-semibold small:text-sm">
                  {isLoadingGMData ? "..." : thisWeekGMCount}
                </p>
                <p className="text-text2 small:text-xs">This week</p>
              </div>
            </div>
            <div className="rounded-3xl p-[1px] bg-gradient_cheap_primary">
              <div className="rounded-3xl bg-white flex laptop:flex-col flex-row items-center laptop:items-start justify-center gap-2 p-[6px_16px]">
                <p className="text-text3/60 text-lg font-semibold small:text-sm">
                  {isLoadingGMData ? "..." : totalGMsAllChains}
                </p>
                <p className="text-text2 small:text-xs">Total GMs Sent</p>
              </div>
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
          <div className="h-3 mx-3 relative">
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
                "h-[4px] bg-gray4"
              )}
              style={{
                width: `${Math.max(
                  0,
                  Math.min(100, 100 - progressPercentage)
                )}%`,
              }}
            ></div>
            {GM_DASHBOARD.map((item) => (
              <RewardIcon
                key={`${item.gm}`}
                fill={totalGMsAllChains >= item.gm ? "white" : "black"}
                stroke={item.color}
                left={`${item.percent}%`}
                className={cn("absolute z-30")}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            {GM_DASHBOARD.map((item) => (
              <div
                key={`${item.gm}`}
                className="flex flex-col gap-[7px] items-center"
              >
                <p className="text-text_body3 font-poppins text-base font-normal leading-[100%]">
                  {item.gm} GM
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
                height: `${Math.max(
                  0,
                  Math.min(100, 100 - progressPercentage)
                )}%`,
              }}
            ></div>
            {GM_DASHBOARD.map((item) => (
              <RewardIcon
                key={`${item.gm}`}
                fill={totalGMsAllChains >= item.gm ? "white" : "black"}
                stroke={item.color}
                top={`${item.percent}%`}
                className={cn("absolute z-30")}
                vertical
              />
            ))}
          </div>
          <div className="flex flex-col justify-between">
            {GM_DASHBOARD.map((item) => (
              <div key={`${item.gm}`} className="flex gap-2 items-center">
                <p className="text-text_body3 font-poppins text-base font-normal leading-[100%]">
                  {item.gm} GM
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default GMDashboard;
