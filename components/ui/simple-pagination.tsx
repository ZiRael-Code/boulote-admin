"use client";

import { cn } from "@/lib/utils/cn";

type SimplePaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
};

// Compact Previous/Next control. `page` is zero-based to match Spring pages.
export function SimplePagination({
  page,
  totalPages,
  onPageChange,
  disabled = false,
  className,
}: SimplePaginationProps) {
  if (totalPages <= 1) return null;

  const buttonClass =
    "px-3 py-1.5 rounded-md border border-border-500 text-sm font-medium text-secondary-500 hover:bg-neutral-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={disabled || page <= 0}
        className={buttonClass}
      >
        &larr; Previous
      </button>
      <span className="text-sm text-neutral-500">
        Page {page + 1} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={disabled || page >= totalPages - 1}
        className={buttonClass}
      >
        Next &rarr;
      </button>
    </div>
  );
}
