"use client";

import { cn } from "@/lib/utils/cn";

type AvatarSize = "sm" | "md" | "lg" | "xl";

type AvatarProps = {
  initials: string;
  size?: AvatarSize;
  className?: string;
};

const sizeClasses: Record<AvatarSize, string> = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-sm",
  xl: "w-[100px] h-[100px] text-2xl",
};

export function Avatar({ initials, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full bg-primary-50 flex items-center justify-center shrink-0",
        sizeClasses[size],
        className
      )}
    >
      <span className="font-medium text-secondary-500">{initials}</span>
    </div>
  );
}
