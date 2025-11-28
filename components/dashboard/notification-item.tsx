type NotificationItemProps = {
  title: string;
  description: string;
  badge: "urgent" | "pending";
};

export function NotificationItem({
  title,
  description,
  badge,
}: NotificationItemProps) {
  const badgeStyles = {
    urgent: "bg-[rgba(217,8,85,0.12)] text-[#FF383C]",
    pending: "bg-[rgba(255,212,105,0.51)] text-[#CB8100]",
  };

  const badgeText = {
    urgent: "Urgent",
    pending: "Pending",
  };

  return (
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
}

