type StatusVariant = "success" | "warning" | "error" | "info" | "neutral";

const STATUS_MAP: Record<string, StatusVariant> = {
  // Professional statuses
  ACTIVE: "success",
  INACTIVE: "neutral",
  PENDING: "warning",
  // Company statuses
  Active: "success",
  Inactive: "neutral",
  Pending: "warning",
  IN_REVIEW: "info",
  // Quiz statuses
  Draft: "warning",
  Archived: "neutral",
  // AI statuses
  processing: "warning",
  completed: "success",
  failed: "error",
  // Job statuses
  ONGOING: "info",
  COMPLETED: "success",
  AI_REVIEW: "info",
};

export function getStatusVariant(status: string): StatusVariant {
  return STATUS_MAP[status] ?? "neutral";
}

const TEXT_COLOR_MAP: Record<StatusVariant, string> = {
  success: "text-success-500",
  warning: "text-warning-500",
  error: "text-error-500",
  info: "text-primary-500",
  neutral: "text-neutral-500",
};

export function getStatusTextColor(status: string): string {
  return TEXT_COLOR_MAP[getStatusVariant(status)];
}

const BADGE_COLOR_MAP: Record<StatusVariant, string> = {
  success: "bg-success-50 text-success-700",
  warning: "bg-warning-50 text-warning-700",
  error: "bg-error-50 text-error-700",
  info: "bg-primary-50 text-primary-700",
  neutral: "bg-neutral-100 text-neutral-700",
};

export function getStatusBadgeColors(status: string): string {
  return BADGE_COLOR_MAP[getStatusVariant(status)];
}
