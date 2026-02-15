"use client";

import { cn } from "@/lib/utils/cn";

type ProgressBarProps = {
  percentage: number;
  className?: string;
};

export function ProgressBar({ percentage, className }: ProgressBarProps) {
  return (
    <div className={cn("w-full bg-neutral-200 h-2 rounded-full", className)}>
      <div
        className="bg-primary-500 h-2 rounded-full transition-all"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
