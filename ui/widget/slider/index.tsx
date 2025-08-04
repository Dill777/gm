import { cn } from "@/utils";
import { Slider as _Slider } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";

// Custom styled Slider
const StyledSlider = styled(_Slider)(({ theme: _theme }) => ({
  color: "transparent",
  height: 13.5,

  padding: 0,
  "@media (pointer: coarse)": {
    padding: 0,
  },

  "& .MuiSlider-thumb": {
    height: 13.5,
    width: 13.5,
    backgroundColor: "#c9fc01",
    border: "2px solid black",
    "&:focus, &:hover, &.Mui-active": {
      boxShadow: "inherit",
    },
  },
  "& .MuiSlider-track": {
    height: 13.5,
    border: "none",
    backgroundImage:
      "linear-gradient(90deg, #1C96FD 7.89%, #33E360 24.13%, #F4C630 46.65%, #CB1245 69.32%, #AD00FE 100%)",
  },
  "& .MuiSlider-rail": {
    background: "rgb(90, 90, 90)",
  },
}));

interface Props {
  label?: string;
  min?: number;
  max?: number;
  defaultValue?: number;
  step?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export const Slider = ({
  label = "Slider",
  min = 0,
  max = 10,
  step = 1,
  defaultValue = 1,
  onChange,
  disabled = false,
  className,
}: Props) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (_e: Event, newValue: number | number[]) => {
    setValue(newValue as number);
    onChange && onChange(newValue as number);
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-1 flex-col items-stretch justify-center gap-[16px]",
          "h-[71px] p-[7px_11px] rounded-lg border-2 border-stroke/80 bg-bg",
          className ?? ""
        )}
      >
        {/* info */}
        <div
          className={cn(
            "flex items-center justify-between",
            "font-poppins text-xs font-medium leading-[150%] text-text_body1/90"
          )}
        >
          <p>{label}</p>
          <p className="text-base">
            {value}/{max}
          </p>
        </div>

        {/* slider */}
        <StyledSlider
          aria-label={label}
          min={min}
          max={max}
          defaultValue={defaultValue}
          step={step}
          value={value}
          onChange={handleChange}
          //   disabled={disabled}
          //   className={disabled ? "opacity-30" : ""}
        />
      </div>
    </>
  );
};
