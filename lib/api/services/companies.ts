import axiosInstance from "../axios-config";
import type {
  CompaniesDashboardResponse,
  CompaniesResponse,
  PendingCompaniesResponse,
  CompanyProfile,
  CompanyFilterOptions,
} from "@/lib/types/company";

export async function getCompaniesDashboard(): Promise<CompaniesDashboardResponse> {
  const response = await axiosInstance.get<CompaniesDashboardResponse>(
    "/admin/company/dashboard"
  );
  return response.data;
}



export type CompanyFilters = {
  search?: string;
  industry?: string;
  size?: string;
  plan?: string;
  status?: string;
  page?: number;
};

export async function getCompanies(filters: CompanyFilters = {}): Promise<CompaniesResponse> {
  const response = await axiosInstance.get<CompaniesResponse>(
    "/admin/company/getCompanies",
    { params: { ...filters, sizeParam: 10 } }
  );
  return response.data;
}

export async function getCompanyFilterOptions(): Promise<CompanyFilterOptions> {
  const response = await axiosInstance.get<CompanyFilterOptions>(
    "/admin/company/filter-options"
  );
  return response.data;
}

export async function getPendingCompanyApprovals(): Promise<PendingCompaniesResponse> {
  const response = await axiosInstance.get<PendingCompaniesResponse>(
    "/admin/company/pending"
  );
  return response.data;
}

export async function getCompanyProfile(
  companyId: number
): Promise<CompanyProfile> {
  const response = await axiosInstance.get<CompanyProfile>(
    `/admin/company/profile/${companyId}`
  );
  return response.data;
}

export async function approveCompany(companyId: number): Promise<void> {
  await axiosInstance.post(`/admin/company/approve/${companyId}`);
}

export async function rejectCompany(companyId: number, reason?: string): Promise<void> {
  await axiosInstance.post(`/admin/company/reject/${companyId}`, { reason });
}

