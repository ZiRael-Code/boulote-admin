export function formatLastLogin(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  
  if (isToday) {
    return `Today, ${time}`;
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  
  if (isYesterday) {
    return `Yesterday, ${time}`;
  }
  
  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  
  return `${dateStr}, ${time}`;
}

export function formatPercentage(value: number): string {
  const formatted = Math.abs(value).toFixed(0);
  const arrow = value >= 0 ? "↗" : "↘";
  return `${arrow} ${value >= 0 ? "+" : "-"}${formatted}% from last month`;
}

