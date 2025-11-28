import axiosInstance from "../axios-config";

type NotificationType = "PAYMENT_DISPUTE" | "JOB_APPROVAL" | "SYSTEM_UPDATE";
type ActivityType = "PAYMENT_DISPUTE" | "CONTENT_FLAGGED" | "QUIZ_ALERT";

type Notification = {
  type: NotificationType;
  title: string;
  message: string;
};

type SystemActivity = {
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

