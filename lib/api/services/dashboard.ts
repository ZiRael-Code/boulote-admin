import axiosInstance from "../axios-config";
import type { PageResponse } from "./pagination";

// Mirrors the backend's NotificationType enum (see NotificationType.java).
export type NotificationType =
  | "SYSTEM_ALERT"
  | "QUIZ_SUBMISSION"
  | "ANNOUNCEMENT"
  | "JOB_INVITE"
  | "JOB_ACCEPTED"
  | "JOB_COMPLETED"
  | "SKILL_ADDED"
  | "QUIZ_COMPLETED"
  | "PROFILE_VIEWED"
  | "MENTOR_MATCHED"
  | "MENTOR_ASSIGNED"
  | "MENTEE_REQUESTED"
  | "PAYMENT_RECEIVED"
  | "DOCUMENT_UPLOADED"
  | "ACHIEVEMENT_UNLOCKED"
  | "INVITE_RESPONSE"
  | "SECURITY_ALERT"
  | "PROJECT_UPDATE"
  | "PAYMENT"
  | "MESSAGE"
  | "SETTINGS_UPDATE"
  | "SUPPORT_REQUEST"
  | "PAYMENT_DISPUTE";

// Mirrors the backend's SystemActivityType enum (see SystemActivityType.java).
export type ActivityType = NotificationType | "CONTENT_FLAGGED";

export type Notification = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  priority: string | null;
  isRead: boolean;
  createdAt: string;
  actionUrl: string | null;
  relatedEntityType: string | null;
  relatedEntityId: number | null;
};

export type SystemActivity = {
  type: ActivityType;
  title: string;
  message: string;
  timeAgo: string;
};

export type DashboardData = {
  welcomeMessage: string;
  lastLogin: string;
  totalProfessionals: number;
  professionalGrowthPercentage: number;
  activeProfessionals: number;
  inactiveProfessionals: number;
  totalCompanies: number;
  companyGrowthPercentage: number;
  activeCompanies: number;
  inactiveCompanies: number;
  notifications: Notification[];
  systemActivities: SystemActivity[];
};

export async function getAdminDashboard(): Promise<DashboardData> {
  const response = await axiosInstance.get<DashboardData>(
    "/admin/dashboard/getAdminDashboard"
  );
  return response.data;
}



export async function getAdminNotificationsPage(page = 0, size = 10) {
  const response = await axiosInstance.get<PageResponse<Notification>>(
    "/admin/dashboard/notifications",
    { params: { page, size } }
  );
  return response.data;
}

export async function getAdminActivitiesPage(page = 0, size = 10) {
  const response = await axiosInstance.get<PageResponse<SystemActivity>>(
    "/admin/dashboard/activities",
    { params: { page, size } }
  );
  return response.data;
}
