"use client";

import { cn } from "@/lib/utils/cn";

type EmptyStateProps = {
  message: string;
  className?: string;
};

export function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <p className="text-neutral-500 text-lg">{message}</p>
    </div>
  );
}
