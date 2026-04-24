import { useQuery } from "@tanstack/react-query";
import { useMutationWithToast } from "./use-mutation-with-toast";
import {
  getCompaniesDashboard,
  getCompanies,
  getPendingCompanyApprovals,
  getCompanyProfile,
  approveCompany,
  rejectCompany,
} from "@/lib/api/services/companies";
import type {
  CompaniesDashboardResponse,
  CompaniesResponse,
  PendingCompaniesResponse,
  CompanyProfile,
} from "@/lib/types/company";

export function useCompaniesDashboard(enabled = true) {
  return useQuery<CompaniesDashboardResponse>({
    queryKey: ["companies", "dashboard"],
    queryFn: getCompaniesDashboard,
    enabled,
  });
}



export function useCompanies(enabled = true) {
  return useQuery<CompaniesResponse>({
    queryKey: ["companies", "list"],
    queryFn: getCompanies,
    enabled,
  });
}

export function usePendingCompanyApprovals(enabled = true) {
  return useQuery<PendingCompaniesResponse>({
    queryKey: ["companies", "pending"],
    queryFn: getPendingCompanyApprovals,
    enabled,
  });
}

export function useCompanyProfile(companyId: number, enabled = true) {
  return useQuery<CompanyProfile>({
    queryKey: ["companies", "profile", companyId],
    queryFn: () => getCompanyProfile(companyId),
    enabled: enabled && !!companyId,
  });
}

const COMPANY_INVALIDATE_KEYS = [
  ["companies", "pending"],
  ["companies", "dashboard"],
  ["companies", "list"],
];

export function useApproveCompany() {
  return useMutationWithToast({
    mutationFn: (companyId: number) => approveCompany(companyId),
    successMessage: "Company approved successfully",
    errorMessage: "Failed to approve company",
    invalidateKeys: COMPANY_INVALIDATE_KEYS,
  });
}

export function useRejectCompany() {
  return useMutationWithToast({
    mutationFn: ({ companyId, reason }: { companyId: number; reason?: string }) =>
      rejectCompany(companyId, reason),
    successMessage: "Company rejected successfully",
    errorMessage: "Failed to reject company",
    invalidateKeys: COMPANY_INVALIDATE_KEYS,
  });
}
