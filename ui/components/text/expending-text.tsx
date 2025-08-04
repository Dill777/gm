import { FC, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils";
import { IconType } from "react-icons/lib";

type ExpendingTextProps = {
  text?: string;
  icon: IconType;
} & ComponentProps;

const ExpendingText: FC<ExpendingTextProps> = ({
  text = "",
  icon: Icon,
  className,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <motion.div
        className={cn(
          "absolute rounded-full w-fit flex items-center justify-center p-2 bg-main-300 cursor-pointer transition-all group",
          className
        )}
        onClick={onClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Icon className="w-5 h-5 tablet:w-5 tablet:h-5 shrink-0 text-white group-hover:text-primary" />
        <motion.span
          className="overflow-hidden whitespace-nowrap ml-0 h-5 text-sm group-hover:text-primary"
          initial={{ opacity: 0, width: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            width: isHovered ? "auto" : 0,
            marginLeft: isHovered ? "0.5rem" : 0,
          }}
        >
          {text}
        </motion.span>
      </motion.div>
    </div>
  );
};

export default ExpendingText;
