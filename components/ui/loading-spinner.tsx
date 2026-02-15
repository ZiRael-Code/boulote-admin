"use client";

import { cn } from "@/lib/utils/cn";

type LoadingSpinnerProps = {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "w-8 h-8 border-4",
  md: "w-16 h-16 border-4",
  lg: "w-24 h-24 border-4",
};

export function LoadingSpinner({
  message,
  size = "md",
  className,
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <div className="text-center">
        <div
          className={cn(
            "border-primary-500 border-t-transparent rounded-full animate-spin mx-auto",
            message && "mb-4",
            sizeClasses[size]
          )}
        />
        {message && <p className="text-neutral-500">{message}</p>}
      </div>
    </div>
  );
}
