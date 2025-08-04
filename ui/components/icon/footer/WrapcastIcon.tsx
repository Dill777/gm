import { FC } from "react";
import { IconType } from "react-icons/lib";
import { SVGProps } from "..";
import { cn } from "@/utils";

export const WrapcastIcon: IconType & FC<SVGProps> = ({ className }) => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("h-5 w-5 shrink-0", className)}
  >
    <path
      d="M32.0965 41.0001H11.9034C6.99494 41.0001 3 37.0055 3 32.0968V11.9037C3 6.99511 6.99498 3.00012 11.9034 3.00012H32.0965C37.0051 3.00012 41 6.99511 41 11.9037V32.0968C41 37.0055 37.0051 41.0001 32.0965 41.0001Z"
      stroke="white"
      strokeWidth="2"
    />
    <path
      d="M32.0967 15.6589L27.8751 30.0364H24.8971L22.9627 23.1605L22.0001 19.7388L21.0374 23.1605L19.103 30.0364H16.1341L11.9033 15.6589H14.9849L16.778 22.3786L17.7426 25.9934L18.7102 22.3794L20.5094 15.6589H23.5276L25.3082 22.3243L26.2759 25.9468L27.2406 22.3235L29.0152 15.6589H32.0967Z"
      fill="white"
      stroke="white"
      strokeWidth="2"
    />
  </svg>
);
