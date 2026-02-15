"use client";

import { cn } from "@/lib/utils/cn";

type Tab<T extends string> = {
  value: T;
  label: string;
  count?: number;
  countStyle?: string;
};

type TabsProps<T extends string> = {
  tabs: Tab<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  className?: string;
};

export function Tabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  className,
}: TabsProps<T>) {
  return (
    <div className={cn("border-b border-border-500 flex gap-8", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            "flex gap-4 items-center px-4 py-3 border-b-2 text-base font-medium transition-colors",
            activeTab === tab.value
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-secondary-500"
          )}
        >
          {tab.label}
          {tab.count != null && tab.count > 0 && (
            <div
              className={cn(
                "rounded-full w-8 h-8 flex items-center justify-center",
                tab.countStyle ?? "bg-primary-200"
              )}
            >
              <span className="text-base font-medium text-primary-900">
                {tab.count}
              </span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
