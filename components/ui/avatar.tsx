"use client";

import { cn } from "@/lib/utils/cn";
import { useAuthImage } from "@/hooks/use-auth-image";

type AvatarSize = "sm" | "md" | "lg" | "xl";

type AvatarProps = {
  initials: string;
  photoUrl?: string | null;
  size?: AvatarSize;
  className?: string;
};

const sizeClasses: Record<AvatarSize, string> = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-sm",
  xl: "w-[100px] h-[100px] text-2xl",
};

export function Avatar({ initials, photoUrl, size = "md", className }: AvatarProps) {
  const { blobUrl } = useAuthImage(photoUrl);

  if (blobUrl) {
    return (
      <img
        src={blobUrl}
        alt={initials}
        className={cn(
          "rounded-full object-cover shrink-0",
          sizeClasses[size],
          className
        )}
      />
    );
  }

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
