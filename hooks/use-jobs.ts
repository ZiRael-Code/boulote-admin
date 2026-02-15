import { useQuery } from "@tanstack/react-query";
import { useMutationWithToast } from "./use-mutation-with-toast";
import {
  getPendingJobs,
  getOngoingJobs,
  getCompletedJobs,
  startAIShortlisting,
  getAIShortlistingStatus,
  getAIShortlistingResults,
  getActiveAIShortlistingProcesses,
  assignSelectedProfessional,
  rejectAllAndManuallySelect,
  type AssignProfessionalRequest,
  type RejectAllRequest,
} from "@/lib/api/services/jobs";
import type {
  JobsResponse,
  AIShortlistingStatusResponse,
  ShortlistingResult,
  ActiveProcessesResponse,
} from "@/lib/types/job";

export function usePendingJobs(enabled = true) {
  return useQuery<JobsResponse>({
    queryKey: ["jobs", "pending"],
    queryFn: getPendingJobs,
    enabled,
  });
}

export function useOngoingJobs(enabled = true) {
  return useQuery<JobsResponse>({
    queryKey: ["jobs", "ongoing"],
    queryFn: getOngoingJobs,
    enabled,
  });
}

export function useCompletedJobs(enabled = true) {
  return useQuery<JobsResponse>({
    queryKey: ["jobs", "completed"],
    queryFn: getCompletedJobs,
    enabled,
  });
}

export function useStartAIShortlisting() {
  return useMutationWithToast({
    mutationFn: (projectId: number) => startAIShortlisting(projectId),
    successMessage: "AI shortlisting started successfully",
    errorMessage: "Failed to start AI shortlisting",
    invalidateKeys: (_, projectId) => [
      ["ai-shortlisting", "status", String(projectId)],
      ["ai-shortlisting", "active-processes"],
      ["jobs", "pending"],
    ],
  });
}

export function useAIShortlistingStatus(
  projectId: number,
  enabled = true,
  refetchInterval?: number
) {
  return useQuery<AIShortlistingStatusResponse>({
    queryKey: ["ai-shortlisting", "status", projectId],
    queryFn: () => getAIShortlistingStatus(projectId),
    enabled: enabled && !!projectId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "processing" || status === "pending") {
        return refetchInterval || 3000;
      }
      return false;
    },
  });
}

export function useAIShortlistingResults(projectId: number, enabled = true) {
  return useQuery<ShortlistingResult | null>({
    queryKey: ["ai-shortlisting", "results", projectId],
    queryFn: () => getAIShortlistingResults(projectId),
    enabled: enabled && !!projectId,
    retry: false,
  });
}

export function useActiveAIShortlistingProcesses(enabled = true) {
  return useQuery<ActiveProcessesResponse>({
    queryKey: ["ai-shortlisting", "active-processes"],
    queryFn: getActiveAIShortlistingProcesses,
    enabled,
    refetchInterval: 5000,
  });
}

export function useAssignSelectedProfessional() {
  return useMutationWithToast({
    mutationFn: (data: AssignProfessionalRequest) =>
      assignSelectedProfessional(data),
    successMessage: "Professional assigned successfully",
    errorMessage: "Failed to assign professional",
    invalidateKeys: (_, variables) => [
      ["ai-shortlisting", "results", String(variables.projectId)],
      ["jobs", "ai-review"],
      ["jobs", "pending"],
      ["jobs", "ongoing"],
    ],
  });
}

export function useRejectAllAndManuallySelect() {
  return useMutationWithToast({
    mutationFn: (data: RejectAllRequest) => rejectAllAndManuallySelect(data),
    successMessage:
      "All professionals rejected. You can now manually select.",
    errorMessage: "Failed to reject professionals",
    invalidateKeys: (_, variables) => [
      ["ai-shortlisting", "results", String(variables.projectId)],
      ["jobs", "ai-review"],
      ["jobs", "pending"],
    ],
  });
}
