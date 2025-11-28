"use client";

import { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      placeholder = "Select an option",
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("flex flex-col gap-2", fullWidth && "w-full")}>
        {label && (
          <label className="text-sm font-medium text-secondary-500">
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full h-[50px] px-4 py-3 rounded-md text-base appearance-none",
              "font-sans text-secondary-500 bg-white",
              "border-2 transition-all duration-200",
              "focus:outline-none cursor-pointer",

              !error && "border-border-500",

              !error && !disabled && "hover:border-neutral-400",

              !error && "focus:border-primary-500",

              error && "border-error-500",

              disabled &&
                "bg-border-100 border-border-300 text-neutral-400 cursor-not-allowed",

              !props.value && "text-neutral-400",

              className
            )}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none",
              disabled ? "text-neutral-400" : "text-neutral-500"
            )}
          />
        </div>

        {error && <p className="text-sm text-error-500">{error}</p>}

        {helperText && !error && (
          <p className="text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
