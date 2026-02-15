"use client";

import { cn } from "@/lib/utils/cn";

type StatCardProps = {
  value: string | number;
  label: string;
  className?: string;
};

export function StatCard({ value, label, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-5 text-center",
        className
      )}
    >
      <p className="text-2xl font-semibold text-primary-500">{value}</p>
      <p className="text-xl font-normal text-secondary-500">{label}</p>
    </div>
  );
}
