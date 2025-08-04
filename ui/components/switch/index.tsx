"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils";

interface SwitchProps {
  noLabel?: boolean;
  isPending?: boolean;
  labelT: string;
  labelF: string;
  value: boolean;
  onChange: (newState: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({
  noLabel,
  isPending,
  labelT,
  labelF,
  value,
  onChange,
}) => {
  const [switchState, setSwitchState] = useState<boolean>(value);

  useEffect(() => {
    setSwitchState(value);
  }, [value]);

  const toggleSwitch = () => {
    const newState = !switchState;
    setSwitchState(newState);
    onChange(newState);
  };

  return (
    <div className="flex items-center space-x-2">
      {!noLabel && (
        <span
          className={`${
            switchState ? "text-primary" : "text-main-400"
          } font-semibold`}
        >
          {labelT}
        </span>
      )}

      <div
        className="relative w-9 h-5 rounded-full bg-main-500 p-1 cursor-pointer"
        onClick={!isPending ? toggleSwitch : () => {}}
      >
        <motion.div
          className={cn(
            "absolute left-[0px] top-[2px] w-[16px] h-[16px] rounded-full",
            noLabel && !value ? "bg-main-700" : " bg-primary"
          )}
          animate={
            !noLabel ? { x: switchState ? 4 : 16 } : { x: value ? 16 : 4 }
          }
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
        />
      </div>

      {!noLabel && (
        <span
          className={`${
            switchState ? "text-main-400" : "text-primary"
          } font-semibold`}
        >
          {labelF}
        </span>
      )}
    </div>
  );
};

export default Switch;
