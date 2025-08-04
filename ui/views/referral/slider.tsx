"use client";

import { cn } from "@/utils";
import { ReactNode, useCallback, useState } from "react";
import Image from "@/ui/components/image";

const SCENES = [
  {
    index: "01",
    icon: (
      <Image
        src="/img/referral/icon1.png"
        alt="icon"
        width={100}
        height={100}
        className={cn("w-[100px] h-[94.118px]")}
      />
    ),
    title: "Get link",
    description:
      "To start, get your unique referral link by clicking on the Become an referral button",
  },
  {
    index: "02",
    icon: (
      <Image
        src="/img/referral/icon2.png"
        alt="icon"
        width={100}
        height={100}
        className={cn("w-[87.57px] h-[100px] rotate-[13.811deg]")}
      />
    ),
    title: "Share",
    description:
      "Share your unique referral link, using our comprehensive media kit anywhere",
  },
  {
    index: "03",
    icon: (
      <Image
        src="/img/referral/icon3.png"
        alt="icon"
        width={100}
        height={100}
        className={cn("w-[88.198px] h-[100px]")}
      />
    ),
    title: "Earn",
    description:
      "You'll earn a 25% commission on every purchase made through your referral link",
  },
];

interface BtnProps {
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}
const PrevBtn = ({ className, onClick, disabled }: BtnProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="45"
      height="91"
      viewBox="0 0 45 91"
      fill="none"
      onClick={!disabled ? onClick : undefined}
      className={cn(
        "text-white",
        !disabled ? "cursor-pointer hover:text-primary" : "text-text_body3",
        className ?? ""
      )}
    >
      <path
        d="M3.8147e-06 90C11.9347 90 23.3807 85.2589 31.8198 76.8198C40.2589 68.3807 45 56.9347 45 45C45 33.0653 40.2589 21.6193 31.8198 13.1802C23.3807 4.74106 11.9348 -2.89066e-06 1.16827e-05 -3.93402e-06L3.8147e-06 90Z"
        fill="black"
      />
      <path
        d="M11 45.4922C11 45.7485 11.0994 46.0107 11.2952 46.2079L11.2973 46.2103L17.2895 52.2025C17.6863 52.5992 18.3294 52.5992 18.7259 52.2025C19.1226 51.8059 19.1226 51.1628 18.7259 50.7663L14.4676 46.5078L29.0822 46.5078C29.6432 46.5078 30.0979 46.0532 30.0979 45.4922C30.0979 44.9312 29.6432 44.4766 29.0822 44.4766L14.4676 44.4766L18.7259 40.2181C19.1226 39.8215 19.1226 39.1785 18.7259 38.7819C18.3294 38.3852 17.6863 38.3852 17.2895 38.7819L11.2973 44.7741L11.2952 44.7767C11.1049 44.9681 11 45.228 11 45.4922Z"
        fill="currentColor"
      />
    </svg>
  );
};
const NextBtn = ({ className, onClick, disabled }: BtnProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="46"
      height="91"
      viewBox="0 0 46 91"
      fill="none"
      onClick={!disabled ? onClick : undefined}
      className={cn(
        "text-white",
        !disabled ? "cursor-pointer hover:text-primary" : "text-text_body3",
        className ?? ""
      )}
    >
      <path
        d="M45.0469 0C33.1121 5.21684e-07 21.6662 4.74106 13.2271 13.1802C4.78793 21.6193 0.0468754 33.0653 0.046875 45C0.0468746 56.9347 4.78793 68.3807 13.2271 76.8198C21.6662 85.2589 33.1121 90 45.0469 90V0Z"
        fill="black"
      />
      <path
        d="M34 45.4922C34 45.2359 33.9006 44.9737 33.7048 44.7765L33.7027 44.7741L27.7105 38.7819C27.3137 38.3852 26.6706 38.3852 26.2741 38.7819C25.8774 39.1784 25.8774 39.8215 26.2741 40.2181L30.5324 44.4766L15.9178 44.4766C15.3568 44.4766 14.9021 44.9312 14.9021 45.4922C14.9021 46.0532 15.3568 46.5078 15.9178 46.5078L30.5324 46.5078L26.2741 50.7663C25.8774 51.1628 25.8774 51.8059 26.2741 52.2025C26.6706 52.5992 27.3137 52.5992 27.7105 52.2025L33.7027 46.2103L33.7048 46.2077C33.8951 46.0163 34 45.7564 34 45.4922Z"
        fill="currentColor"
      />
    </svg>
  );
};

interface SceneProps {
  index: string;
  title: string;
  description: string;
  icon: ReactNode;
  className?: string;
}
const Scene = ({ index, title, description, icon, className }: SceneProps) => {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 w-full h-full flex items-center justify-center",
        "pointer-events-none transition-transform",
        className ?? ""
      )}
    >
      <div className={cn("flex flex-col gap-[10px] w-[370px] items-stretch")}>
        <div className={cn("relative")}>
          <p
            className={cn(
              "text-bg2 text-center font-poppins text-[200px] font-900 leading-normal h-[143px] flex items-center justify-center"
            )}
          >
            {index}
          </p>

          <div
            className={cn(
              "absolute w-fit h-fit -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            )}
          >
            {icon}
          </div>
        </div>

        <div className={cn("flex flex-col items-stretch")}>
          <p
            className={cn(
              "text-center text-white text-3xl font-space_grotesk font-bold"
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              "text-center text-[#CCC] text-base font-space_grotesk font-normal leading-[135%]"
            )}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

interface Props {
  className?: string;
}
const Slider = ({ className }: Props) => {
  const [scene, setScene] = useState(1);
  const onPrevScene = useCallback(() => {
    setScene((prev) => prev - 1);
  }, []);
  const onNextScene = useCallback(() => {
    setScene((prev) => prev + 1);
  }, []);

  return (
    <>
      <div
        className={cn(
          "h-[295px] relative bg-bg3 rounded-2xl overflow-hidden",
          className ?? ""
        )}
      >
        <PrevBtn
          className={cn("absolute left-0 top-1/2 -translate-y-1/2 z-10")}
          onClick={onPrevScene}
          disabled={scene === 1}
        />
        <NextBtn
          className={cn("absolute right-[-1px] top-1/2 -translate-y-1/2 z-10")}
          onClick={onNextScene}
          disabled={scene === SCENES.length}
        />

        {SCENES.map((SCENE, index) => (
          <Scene
            key={`${SCENE.index}`}
            index={SCENE.index}
            icon={SCENE.icon}
            title={SCENE.title}
            description={SCENE.description}
            className={
              scene < index + 1
                ? "translate-x-full"
                : scene > index + 1
                ? "-translate-x-full"
                : ""
            }
          />
        ))}
      </div>
    </>
  );
};

export default Slider;
