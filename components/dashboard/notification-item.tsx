"use client";

import Link from "next/link";

type NotificationItemProps = {
  title: string;
  description: string;
  badge: "urgent" | "pending";
  // Support requests carry a real destination (e.g. /dashboard/support/12);
  // most other notification types still don't, so the card stays
  // non-interactive rather than linking to a dead route.
  actionUrl?: string | null;
};

export function NotificationItem({
  title,
  description,
  badge,
  actionUrl,
}: NotificationItemProps) {
  const badgeStyles = {
    urgent: "bg-[rgba(217,8,85,0.12)] text-[#FF383C]",
    pending: "bg-[rgba(255,212,105,0.51)] text-[#CB8100]",
  };

  const badgeText = {
    urgent: "Urgent",
    pending: "Pending",
  };

  const content = (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-start">
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-start justify-between lg:block">
          <h3 className="text-lg lg:text-xl font-medium text-secondary-500">
            {title}
          </h3>
          <div
            className={`lg:hidden px-2 py-1 rounded-[10px] flex items-center justify-center h-6 ${badgeStyles[badge]}`}
          >
            <span className="text-xs font-normal">{badgeText[badge]}</span>
          </div>
        </div>
        <p className="text-sm lg:text-base font-normal text-secondary-500">
          {description}
        </p>
      </div>
      <div
        className={`hidden lg:flex px-5 py-1 rounded-[10px] items-center justify-center h-6 ${badgeStyles[badge]}`}
      >
        <span className="text-xs font-normal">{badgeText[badge]}</span>
      </div>
    </div>
  );

  if (!actionUrl) return content;

  return (
    <Link href={actionUrl} className="block hover:opacity-80 transition-opacity">
      {content}
    </Link>
  );
}

