import { useQuery } from "@tanstack/react-query";
import { useMutationWithToast } from "./use-mutation-with-toast";
import {
  getProfessionalsDashboard,
  getProfessionals,
  getPendingApprovals,
  approveProfessional,
} from "@/lib/api/services/professionals";
import type {
  ProfessionalsDashboardResponse,
  ProfessionalsResponse,
  PendingApprovalsResponse,
} from "@/lib/types/professional";

export function useProfessionalsDashboard(enabled = true) {
  return useQuery<ProfessionalsDashboardResponse>({
    queryKey: ["professionals", "dashboard"],
    queryFn: getProfessionalsDashboard,
    enabled,
  });
}

export function useProfessionals(enabled = true) {
  return useQuery<ProfessionalsResponse>({
    queryKey: ["professionals", "list"],
    queryFn: getProfessionals,
    enabled,
  });
}

export function usePendingApprovals(enabled = true) {
  return useQuery<PendingApprovalsResponse>({
    queryKey: ["professionals", "pending"],
    queryFn: getPendingApprovals,
    enabled,
  });
}

export function useApproveProfessional() {
  return useMutationWithToast({
    mutationFn: (id: number) => approveProfessional(id),
    successMessage: "Professional approved successfully",
    errorMessage: "Failed to approve professional",
    invalidateKeys: [
      ["professionals", "pending"],
      ["professionals", "dashboard"],
    ],
  });
}
