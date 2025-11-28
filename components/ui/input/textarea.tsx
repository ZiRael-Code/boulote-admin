import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
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

        <textarea
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full min-h-[120px] px-4 py-3 rounded-md text-base",
            "font-sans text-secondary-500",
            "border-2 transition-all duration-200",
            "placeholder:text-neutral-400",
            "focus:outline-none resize-y",
            !error && "border-border-500 bg-white",
            !error && !disabled && "hover:border-neutral-400",

            !error && "focus:border-primary-500",

            error && "border-error-500 bg-white",

            disabled &&
              "bg-border-100 border-border-300 text-neutral-400 cursor-not-allowed",

            className
          )}
          {...props}
        />

        {error && <p className="text-sm text-error-500">{error}</p>}

        {helperText && !error && (
          <p className="text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
