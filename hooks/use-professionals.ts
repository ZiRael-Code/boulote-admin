import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => approveProfessional(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals", "pending"] });
      queryClient.invalidateQueries({ queryKey: ["professionals", "dashboard"] });
      toast.success("Professional approved successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to approve professional"
      );
    },
  });
}

