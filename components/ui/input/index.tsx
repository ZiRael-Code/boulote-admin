import { InputHTMLAttributes, forwardRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className={cn("flex flex-col gap-2", fullWidth && "w-full")}>
        {label && (
          <label className="text-sm font-medium text-secondary-500">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "w-full h-[50px] px-4 py-3 rounded-md text-base",
              "font-sans text-secondary-500",
              "border-2 transition-all duration-200",
              "placeholder:text-neutral-400",
              "focus:outline-none",

              !error && !isFocused && "border-border-500 bg-white",

              !error && !disabled && "hover:border-border-900",

              !error && isFocused && "border-primary-500 bg-white",

              props.value &&
                !error &&
                !isFocused &&
                "border-border-500 bg-white",

              error && "bg-white",

              disabled &&
                "bg-border-100 border-border-300 text-neutral-400 cursor-not-allowed",

              leftIcon && "pl-10",
              rightIcon && "pr-10",

              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-error-500">{error}</p>}

        {helperText && !error && (
          <p className="text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
