import { cn } from "@/utils";
import React, { useState, useId, forwardRef, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Option = {
  value: string;
  label: string;
};

interface SelectProps {
  options: Option[];
  value?: string;
  error?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ options, value, error, onChange, className, placeholder = "" }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value);
    const generatedId = useId();
    const selectId = `${generatedId}-select`;
    const labelId = `${selectId}-label`;
    const errorId = `${selectId}-error`;
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSelect = (value: string) => {
      setSelectedValue(value);
      setIsOpen(false);
      if (onChange) onChange(value);
    };
    useEffect(() => {
      setSelectedValue(value);
    }, [value]);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div className="relative w-full text-sm" ref={dropdownRef}>
        <button
          id={selectId}
          aria-labelledby={labelId}
          aria-describedby={error ? errorId : undefined}
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
          className={cn(
            "w-full h-[43px] rounded-xl p-4 border border-main-300 outline-none bg-black/40 text-left flex items-center",
            className
          )}
        >
          {options.find((option) => option.value === selectedValue)?.label ?? (
            <span className="text-white-500">{placeholder}</span>
          )}
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </span>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute w-full mt-1 rounded-xl shadow-lg overflow-hidden"
            >
              {options.map((option, idx) => (
                <li
                  key={`${option.value}_${idx}`}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "cursor-pointer p-4 hover:text-primary bg-black border-main-200 border-b-2",
                    idx === options.length - 1 && "border-none",
                    option.value === selectedValue && "text-primary"
                  )}
                >
                  {option.label}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
