"use client";

import { cn } from "@/lib/utils/cn";

type ErrorStateProps = {
  title: string;
  message?: string;
  className?: string;
};

export function ErrorState({
  title,
  message = "Please try again later",
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <div className="text-center">
        <p className="text-error-500 text-lg font-medium mb-2">{title}</p>
        <p className="text-neutral-500">{message}</p>
      </div>
    </div>
  );
}
