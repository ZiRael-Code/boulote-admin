import axiosInstance from "../axios-config";
import type {
  ProfessionalsDashboardResponse,
  ProfessionalsResponse,
  PendingApprovalsResponse,
  ProfessionalProfile,
  ProfessionalReview,
} from "@/lib/types/professional";

export async function getProfessionalsDashboard(): Promise<ProfessionalsDashboardResponse> {
  const response = await axiosInstance.get<ProfessionalsDashboardResponse>(
    "/admin/professionals/dashboard",
  );
  return response.data;
}

export type ProfessionalsFilters = {
  skills?: string;
  ratings?: string;
  status?: string;
  search?: string;
  page?: number;
  size?: number;
};

export async function getProfessionals(
  filters: ProfessionalsFilters = {},
): Promise<ProfessionalsResponse> {
  const params = new URLSearchParams();
  if (filters.skills) params.append("skills", filters.skills);
  if (filters.ratings) params.append("ratings", filters.ratings);
  if (filters.status) params.append("status", filters.status);
  if (filters.search) params.append("search", filters.search);
  params.append("page", String((filters.page ?? 1) - 1));
  params.append("size", String(filters.size ?? 10));

  const response = await axiosInstance.get<ProfessionalsResponse>(
    `/admin/professionals/getProfessionals?${params.toString()}`,
  );
  return response.data;
}

export async function getProfessionalReviews(
  id: number,
): Promise<ProfessionalReview[]> {
  const response = await axiosInstance.get<ProfessionalReview[]>(
    `/admin/professionals/reviews/${id}`,
  );
  return response.data;
}

export type AssignMentorRequest = {
  category?: string;
  specializedAreas?: string[];
  maxMentees?: number;
};

export async function assignAsMentor(
  professionalId: number,
  data: AssignMentorRequest,
): Promise<void> {
  const params = new URLSearchParams();
  if (data.category) params.append("category", data.category);
  if (data.maxMentees) params.append("maxMentees", String(data.maxMentees));
  if (data.specializedAreas?.length) {
    data.specializedAreas.forEach((a) => params.append("specializedAreas", a));
  }
  await axiosInstance.post(
    `/admin/professionals/assign-mentor/${professionalId}?${params.toString()}`,
  );
}

export async function getProfessionalProfile(
  id: number,
): Promise<ProfessionalProfile> {
  const response = await axiosInstance.get<ProfessionalProfile>(
    `/admin/professionals/profile/${id}`,
  );
  return response.data;
}

export async function rejectProfessional(id: number): Promise<void> {
  await axiosInstance.post(`/admin/professionals/rejectAccount/${id}`);
}

export async function getPendingApprovals(): Promise<PendingApprovalsResponse> {
  const response = await axiosInstance.get<PendingApprovalsResponse>(
    "/admin/professionals/pending",
  );
  return response.data;
}

export async function approveProfessional(id: number): Promise<void> {
  await axiosInstance.post(`/admin/professionals/approveAccount/${id}`);
}
