import axiosInstance from "../axios-config";
import type {
  ProfessionalsDashboardResponse,
  ProfessionalsResponse,
  PendingApprovalsResponse,
} from "@/lib/types/professional";

export async function getProfessionalsDashboard(): Promise<ProfessionalsDashboardResponse> {
  const response = await axiosInstance.get<ProfessionalsDashboardResponse>(
    "/admin/professionals/dashboard"
  );
  return response.data;
}

export async function getProfessionals(): Promise<ProfessionalsResponse> {
  const response = await axiosInstance.get<ProfessionalsResponse>(
    "/admin/professionals/getProfessionals"
  );
  return response.data;
}

export async function getPendingApprovals(): Promise<PendingApprovalsResponse> {
  const response = await axiosInstance.get<PendingApprovalsResponse>(
    "/admin/professionals/pending"
  );
  return response.data;
}

export async function approveProfessional(id: number): Promise<void> {
  await axiosInstance.post(`/admin/professionals/approveAccount/${id}`);
}

