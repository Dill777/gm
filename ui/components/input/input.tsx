import { cn } from "@/utils";
import React, {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
  useId,
} from "react";

type BaseInput = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange">;

export interface InputProps extends Omit<BaseInput, "value"> {
  multiline?: boolean;
  value?: string;
  error?: string;
  text?: string;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const Input = forwardRef<HTMLInputElement & HTMLTextAreaElement, InputProps>(
  ({ id, error, multiline, children, className, onChange, ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id || `${generatedId}input`;
    const labelId = `${inputId}-label`;
    const errorId = `${inputId}-error`;
    const InputElement = multiline ? "textarea" : "input";

    return (
      <InputElement
        onChange={onChange}
        id={inputId}
        aria-labelledby={labelId}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "text-sm w-full h-[43px] rounded-xl py-2 p-3 placeholder:text-white-500 border border-main-300 outline-none bg-black/40",
          className
        )}
        ref={ref}
        {...rest}
      >
        {children}
      </InputElement>
    );
  }
);
Input.displayName = "Input";

export default Input;
