import axiosInstance from "../axios-config";
import type { SupportRequest, SupportRequestsResponse } from "@/lib/types/support";

export type SupportFilters = {
  resolved?: boolean;
  page?: number;
};

export async function getSupportRequests(filters: SupportFilters = {}): Promise<SupportRequestsResponse> {
  const response = await axiosInstance.get<SupportRequestsResponse>("/admin/support", {
    params: filters,
  });
  return response.data;
}

export async function getSupportRequest(id: number): Promise<SupportRequest> {
  const response = await axiosInstance.get<SupportRequest>(`/admin/support/${id}`);
  return response.data;
}

export async function replySupportRequest(id: number, reply: string): Promise<SupportRequest> {
  const response = await axiosInstance.post<SupportRequest>(`/admin/support/${id}/reply`, { reply });
  return response.data;
}
