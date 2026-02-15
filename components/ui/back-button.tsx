"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type BackButtonProps = {
  className?: string;
};

export function BackButton({ className }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={cn(
        "w-10 h-10 flex items-center justify-center hover:bg-neutral-100 rounded-md",
        className
      )}
    >
      <ChevronLeft className="w-6 h-6" />
    </button>
  );
}
