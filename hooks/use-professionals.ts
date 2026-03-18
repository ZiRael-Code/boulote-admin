import { useQuery } from "@tanstack/react-query";
import { useMutationWithToast } from "./use-mutation-with-toast";
import {
  getProfessionalsDashboard,
  getProfessionals,
  getPendingApprovals,
  approveProfessional,
  getProfessionalProfile,
  rejectProfessional,
} from "@/lib/api/services/professionals";
import type {
  ProfessionalsDashboardResponse,
  ProfessionalsResponse,
  PendingApprovalsResponse,
  ProfessionalProfile,
  ProfessionalReview,
} from "@/lib/types/professional";

export function useProfessionalsDashboard(enabled = true) {
  return useQuery<
    ProfessionalsDashboardResponse,
    Error,
    ProfessionalsDashboardResponse
  >({
    queryKey: ["professionals", "dashboard"],
    queryFn: getProfessionalsDashboard,
    enabled,
  });
}

export function useProfessionalProfile(id: number, enabled = true) {
  return useQuery<ProfessionalProfile, Error, ProfessionalProfile>({
    queryKey: ["professionals", "profile", id],
    queryFn: () => getProfessionalProfile(id),
    enabled: enabled && !!id,
  });
}

export function useRejectProfessional() {
  return useMutationWithToast({
    mutationFn: (id: number) => rejectProfessional(id),
    successMessage: "Professional rejected",
    errorMessage: "Failed to reject professional",
    invalidateKeys: [
      ["professionals", "pending"],
      ["professionals", "dashboard"],
    ],
  });
}

import type { ProfessionalsFilters } from "@/lib/api/services/professionals";

export function useProfessionals(
  filters: ProfessionalsFilters = {},
  enabled = true,
) {
  return useQuery<ProfessionalsResponse, Error, ProfessionalsResponse>({
    queryKey: ["professionals", "list", filters],
    queryFn: () => getProfessionals(filters),
    enabled,
  });
}

export function usePendingApprovals(enabled = true) {
  return useQuery<PendingApprovalsResponse, Error, PendingApprovalsResponse>({
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

import {
  assignAsMentor,
  type AssignMentorRequest,
} from "@/lib/api/services/professionals";

export function useAssignAsMentor() {
  return useMutationWithToast({
    mutationFn: ({ id, data }: { id: number; data: AssignMentorRequest }) =>
      assignAsMentor(id, data),
    successMessage: "Professional assigned as mentor successfully",
    errorMessage: "Failed to assign as mentor",
    invalidateKeys: [
      ["professionals", "profile"],
      ["professionals", "list"],
    ],
  });
}

import { getProfessionalReviews } from "@/lib/api/services/professionals";

export function useProfessionalReviews(id: number, enabled = true) {
  return useQuery<ProfessionalReview[], Error, ProfessionalReview[]>({
    queryKey: ["professionals", "reviews", id],
    queryFn: () => getProfessionalReviews(id),
    enabled: enabled && !!id,
  });
}
