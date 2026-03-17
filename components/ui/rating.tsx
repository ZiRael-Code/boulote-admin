"use client";

import { cn } from "@/lib/utils/cn";

type RatingProps = {
  value: number;
  reviewCount?: number;
  maxStars?: number;
  className?: string;
};

export function Rating({ value, reviewCount, className }: RatingProps) {
  return (
      <div className={cn("flex items-center gap-1", className)}>
        <span className="text-warning-500">&#9733;</span>
        <span className="text-sm text-secondary-500">{value.toFixed(1)}</span>
        {reviewCount != null && (
            <span className="text-xs text-neutral-500">({reviewCount})</span>
        )}
      </div>
  );
}
