import React from "react";
import { GradientText } from "@/ui/components/text";
import { FaLink } from "react-icons/fa6";
import { IoMdShare } from "react-icons/io";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { cn } from "@/utils";
import Image from "@/ui/components/image";

const Guide = ({ index, content }: { index: number; content: string }) => {
  return (
    <>
      <div
        className={cn(
          "h-[154px] rounded-xl flex flex-col items-start justify-start gap-[19px]",
          index === 1
            ? "w-[380px] p-[26px_32px]"
            : "w-[404px] p-[26px_13px_26px_32px]",
          "mobile_md:w-[319px] mobile_md:p-[0px_12px] mobile_md:justify-center",
          "relative overflow-hidden"
        )}
      >
        {/* background */}
        <div
          className="absolute top-[-284px] left-[-216px] w-[1464.205px] h-[7422.088px] shrink-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), radial-gradient(34.87% 38.23% at 20.71% 26.77%, rgba(202, 252, 1, 0.15) 0%, rgba(202, 252, 1, 0.00) 100%), #1B1B1B",
          }}
        ></div>
        <div
          className="absolute top-[66px] left-[-216px] w-[1464.205px] h-[7422.088px] shrink-0 mix-blend-multiply opacity-10"
          style={{
            background:
              "url('/img/referral/stat_bg.jpg') lightgray 50% / cover no-repeat",
          }}
        ></div>

        <div className="z-10 w-[35px] h-[35px] flex items-center justify-center rounded-full bg-[#2B2B2B]">
          <p className="text-base font-space_mono font-bold leading-[140%] text-[#858584]">
            {index}
          </p>
        </div>
        <p className="z-10 text-[#FFF] font-poppins text-base normal-case font-medium leading-[150%]">
          {content}
        </p>
      </div>
    </>
  );
};

const HelpView = () => {
  return (
    <div
      className={cn(
        "h-[412px] pt-[54px] flex flex-col gap-[26px] items-center justify-start bg-[rgba(116,195,240,0.04)] rounded-[10px]",
        "relative overflow-hidden",
        "tablet_md:h-fit tablet_md:p-[13px]"
      )}
    >
      {/* background */}
      <div
        className={cn(
          "absolute z-[-2] w-[1464.205px] h-[7422.088px] top-[-82px] left-[-66px]"
        )}
        style={{
          background:
            "linear-gradient(0deg,rgba(0,0,0,0.20) 0%,rgba(0,0,0,0.20) 100%),radial-gradient(34.87% 38.23% at 20.71% 26.77%,rgba(202,252,1,0.15) 0%,rgba(202,252,1,0.00) 100%),#1B1B1B",
          backgroundColor: "black",
        }}
      ></div>

      <div
        className={cn(
          "absolute top-[65px] left-[-20px] w-[150px] h-[625.72px] rotate-[-30deg] flex-shrink-0 bg-[#243300]",
          "tablet:left-[-100px]"
        )}
      ></div>
      <div className="absolute top-[61px] left-0 w-[135.299px] h-[593.495px] rotate-[-30deg] flex-shrink-0 bg-[#698902] shadow-[0px_40px_30px_0px_rgba(32,41,47,0.30)]"></div>

      <div
        className={cn(
          "absolute top-[14.6px] right-[-33px] w-[150px] h-[625.72px] rotate-[33.617deg] flex-shrink-0 bg-[#243300]",
          "tablet:hidden"
        )}
      ></div>
      <div
        className={cn(
          "absolute top-[87.2px] right-[-75px] w-[135.299px] h-[593.495px] rotate-[33.617deg] flex-shrink-0 bg-[#698902] shadow-[0px_40px_30px_0px_rgba(32,41,47,0.30)]",
          "tablet:hidden"
        )}
      ></div>

      <Image
        src="/img/referral/vector.svg"
        alt="vector.svg"
        width={303}
        height={522}
        className={cn(
          "w-[303.261px] h-[522.736px] rotate-[60deg] flex-shrink-0 fill-[rgba(201,252,1,0.20)] filter-blur-[150px]",
          "absolute top-[-220px] left-[-25px]",
          "mobile:left-[-20px]"
        )}
      />

      <div className="flex flex-col items-center">
        <GradientText
          className={cn(
            "text-[40px] font-poppins font-semibold leading-none p-2",
            "tablet:text-2xl"
          )}
        >
          How it works
        </GradientText>
        <p
          className={cn(
            "p-2 text-text_body1 text-center font-poppins text-xl normal-case font-medium leading-[150%]",
            "tablet:text-base"
          )}
        >
          Earn a 25% commission on every...
        </p>
      </div>

      <div
        className={cn(
          "flex items-center mt-[26px] gap-[27px]",
          "tablet_md:flex-col mobile_md:mt-0"
        )}
      >
        <Guide
          index={1}
          content={"Copy and/or share your unique referral link"}
        />
        <Guide
          index={2}
          content={
            "Earn a 25% commission on every purchase made through your referral link"
          }
        />
      </div>
    </div>
  );
};

export default HelpView;
