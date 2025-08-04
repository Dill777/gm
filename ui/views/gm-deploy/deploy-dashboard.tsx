import { RewardIcon } from "@/ui/components/icon/referral/RewardIcon";
import { cn } from "@/utils";
import { DeployDashboardInfo, DEPLOY_DASHBOARD } from "@/utils/constant";

// Utility function to calculate current and next levels based on total Deploy count
const calculateDeployLevels = (
  totalDeploys: number
): { currentLevel: DeployDashboardInfo; nextLevel: DeployDashboardInfo } => {
  // Handle case where user has no Deploys or less than first level requirement
  if (totalDeploys < DEPLOY_DASHBOARD[0].deploy) {
    return {
      currentLevel: {
        level: 0,
        deploy: 0,
        color: DEPLOY_DASHBOARD[0].color,
        percent: 0,
      }, // Virtual level 0
      nextLevel: DEPLOY_DASHBOARD[0], // First actual level
    };
  }

  // Find the current level - the highest level where deploy requirement is met
  let currentLevel = DEPLOY_DASHBOARD[0]; // Default to first level

  for (let i = DEPLOY_DASHBOARD.length - 1; i >= 0; i--) {
    if (totalDeploys >= DEPLOY_DASHBOARD[i].deploy) {
      currentLevel = DEPLOY_DASHBOARD[i];
      break;
    }
  }

  // Find the next level - the next level after current
  const currentIndex = DEPLOY_DASHBOARD.findIndex(
    (level) => level.level === currentLevel.level
  );
  const nextLevel =
    currentIndex < DEPLOY_DASHBOARD.length - 1
      ? DEPLOY_DASHBOARD[currentIndex + 1]
      : DEPLOY_DASHBOARD[DEPLOY_DASHBOARD.length - 1]; // If at max level, next is same as current

  return { currentLevel, nextLevel };
};

interface DeployDashboardProps {
  todayDeployCount?: number;
  thisWeekDeployCount?: number;
  totalDeploySCDeployed?: number;
  isLoadingDeployData?: boolean;
}

const DeployDashboard = ({
  todayDeployCount = 0,
  thisWeekDeployCount = 0,
  totalDeploySCDeployed = 0,
  isLoadingDeployData = false,
}: DeployDashboardProps) => {
  // Calculate current and next levels based on total Deploy SC deployed
  const { currentLevel, nextLevel } = calculateDeployLevels(
    totalDeploySCDeployed
  );

  // Calculate progress percentage safely
  const calculateProgressPercentage = () => {
    // If at max level or next level is same as current, show 100% progress
    if (
      currentLevel.level === nextLevel.level ||
      nextLevel.deploy === currentLevel.deploy
    ) {
      return currentLevel.percent;
    }

    // Calculate progress towards next level
    const progressInLevel = Math.max(
      0,
      totalDeploySCDeployed - currentLevel.deploy
    );
    const totalLevelRange = nextLevel.deploy - currentLevel.deploy;
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
              Your Deploy Dashboard
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-3xl p-[1px] bg-gradient_cheap_primary">
              <div className="rounded-3xl bg-white flex laptop:flex-col items-center laptop:items-start justify-center gap-2 p-[6px_16px]">
                <p className="text-black text-lg font-semibold small:text-sm">
                  {isLoadingDeployData ? "..." : todayDeployCount}
                </p>
                <p className="text-text2 small:text-xs">Deploy Today</p>
              </div>
            </div>
            <div className="rounded-3xl p-[1px] bg-gradient_cheap_primary">
              <div className="rounded-3xl bg-white flex laptop:flex-col items-center laptop:items-start justify-center gap-2 p-[6px_16px]">
                <p className="text-text3/60 text-lg font-semibold small:text-sm">
                  {isLoadingDeployData ? "..." : thisWeekDeployCount}
                </p>
                <p className="text-text2 small:text-xs">This week</p>
              </div>
            </div>
            <div className="rounded-3xl p-[1px] bg-gradient_cheap_primary">
              <div className="rounded-3xl bg-white flex laptop:flex-col items-center laptop:items-start justify-center gap-2 p-[6px_16px]">
                <p className="text-text3/60 text-lg font-semibold small:text-sm">
                  {isLoadingDeployData ? "..." : totalDeploySCDeployed}
                </p>
                <p className="text-text2 small:text-xs">
                  Total Deploy SC deployed
                </p>
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
                "bg-gradient_progress"
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
            {DEPLOY_DASHBOARD.map((item) => (
              <RewardIcon
                key={`${item.deploy}`}
                fill={totalDeploySCDeployed >= item.deploy ? "white" : "black"}
                stroke={item.color}
                left={`${item.percent}%`}
                className={cn("absolute z-30")}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            {DEPLOY_DASHBOARD.map((item) => (
              <div
                key={`${item.deploy}`}
                className="flex flex-col gap-[7px] items-center"
              >
                <p className="text-text_body3 font-poppins text-base font-normal leading-[100%]">
                  {item.deploy} Deploy
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
            {DEPLOY_DASHBOARD.map((item) => (
              <RewardIcon
                key={`${item.deploy}`}
                fill={totalDeploySCDeployed >= item.deploy ? "white" : "black"}
                stroke={item.color}
                top={`${item.percent}%`}
                className={cn("absolute z-30")}
                vertical
              />
            ))}
          </div>
          <div className="flex flex-col justify-between">
            {DEPLOY_DASHBOARD.map((item) => (
              <div key={`${item.deploy}`} className="flex gap-2 items-center">
                <p className="text-text_body3 font-poppins text-base font-normal leading-[100%]">
                  {item.deploy} Deploy
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DeployDashboard;
