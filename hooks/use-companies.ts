import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
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

export function useApproveCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyId: number) => approveCompany(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies", "pending"] });
      queryClient.invalidateQueries({ queryKey: ["companies", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["companies", "list"] });
      toast.success("Company approved successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to approve company");
    },
  });
}

export function useRejectCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId, reason }: { companyId: number; reason?: string }) =>
      rejectCompany(companyId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies", "pending"] });
      queryClient.invalidateQueries({ queryKey: ["companies", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["companies", "list"] });
      toast.success("Company rejected successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to reject company");
    },
  });
}


