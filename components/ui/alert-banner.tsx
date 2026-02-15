"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type AlertBannerProps = {
  title: string;
  message?: string;
  variant?: "warning" | "info";
  onDismiss?: () => void;
  className?: string;
};

const variantClasses = {
  warning: "bg-warning-50 border-[#FFB636] text-warning-800",
  info: "bg-primary-50 border-primary-200 text-primary-800",
};

export function AlertBanner({
  title,
  message,
  variant = "warning",
  onDismiss,
  className,
}: AlertBannerProps) {
  return (
    <div
      className={cn(
        "border rounded-lg p-4 flex items-center justify-between",
        variantClasses[variant],
        className
      )}
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold">{title}</p>
        {message && <p className="text-sm opacity-90">{message}</p>}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="w-6 h-6 flex items-center justify-center opacity-70 hover:opacity-100"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
