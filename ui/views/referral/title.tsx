import { cn } from "@/utils";

const Title = () => {
  return (
    <>
      <div className={cn("flex flex-col items-center")}>
        <p className="text-white text-center font-space_grotesk text-[64px] font-bold leading-normal tablet:text-[32px]">
          Affiliate for users
        </p>
        <p
          className={cn(
            "text-text_body2 text-center font-poppins text-lg font-normal leading-normal tracking-[0.36px]",
            "tablet:text-base tablet:tracking-[0.32px] mobile:w-[225px]"
          )}
        >
          Get rewarded for bringing friends on board!
        </p>
      </div>
    </>
  );
};

export default Title;
