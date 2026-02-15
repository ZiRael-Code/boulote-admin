"use client";

import { cn } from "@/lib/utils/cn";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  shownItems: number;
  itemLabel?: string;
  onPageChange: (page: number) => void;
  className?: string;
};

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  shownItems,
  itemLabel = "items",
  onPageChange,
  className,
}: PaginationProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center gap-2 text-sm text-neutral-500 disabled:opacity-50"
      >
        &larr; Previous Page
      </button>

      <div className="flex items-center gap-2">
        {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
          const pageNum = index + 1;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-10 h-10 rounded-md flex items-center justify-center text-sm ${
                currentPage === pageNum
                  ? "bg-primary-500 text-white"
                  : "bg-white border border-border-500 text-secondary-500"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="flex items-center gap-2 text-sm text-neutral-500 disabled:opacity-50"
      >
        Next Page &rarr;
      </button>

      <p className="text-sm text-neutral-500">
        Showing {shownItems} of {totalItems} {itemLabel}
      </p>
    </div>
  );
}
