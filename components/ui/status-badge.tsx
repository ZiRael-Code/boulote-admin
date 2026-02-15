"use client";

import { cn } from "@/lib/utils/cn";
import { getStatusBadgeColors } from "@/lib/utils/status-colors";

type StatusBadgeProps = {
  status: string;
  label?: string;
  className?: string;
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "px-2 py-1 rounded text-xs font-medium",
        getStatusBadgeColors(status),
        className
      )}
    >
      {label ?? status}
    </span>
  );
}
