import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutationWithToast } from "./use-mutation-with-toast";
import {
  bulkStartAIShortlisting,
  type BulkShortlistResult,
  getAIReviewJobs,
  getAssignedJobs,
  getJobDetail,
  type JobFilters,
} from "@/lib/api/services/jobs";

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
  AIShortlistingStatus,
  JobDetail,
} from "@/lib/types/job";
import toast from "react-hot-toast";

export function usePendingJobs(enabled = true, filters: JobFilters = {}) {
  return useQuery<JobsResponse>({
    queryKey: ["jobs", "pending", filters],
    queryFn: () => getPendingJobs(filters),
    enabled,
  });
}

export function useOngoingJobs(enabled = true, filters: JobFilters = {}) {
  return useQuery<JobsResponse>({
    queryKey: ["jobs", "ongoing", filters],
    queryFn: () => getOngoingJobs(filters),
    enabled,
  });
}

export function useCompletedJobs(enabled = true, filters: JobFilters = {}) {
  return useQuery<JobsResponse>({
    queryKey: ["jobs", "completed", filters],
    queryFn: () => getCompletedJobs(filters),
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
  refetchInterval?: number,
) {
  return useQuery<
    AIShortlistingStatusResponse,
    Error,
    AIShortlistingStatusResponse
  >({
    queryKey: ["ai-shortlisting", "status", projectId],
    queryFn: async () => {
      const data = await getAIShortlistingStatus(projectId);
      const normalizedStatus = (data.status ?? "pending").toLowerCase();
      return {
        ...data,
        status: normalizedStatus as AIShortlistingStatus,
      };
    },
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
  return useQuery<ShortlistingResult | null, Error, ShortlistingResult | null>({
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
      ["jobs", "assigned"],
    ],
  });
}

export function useBulkAssignSelectedProfessionals() {
  const queryClient = useQueryClient();

  return useMutation<
    { projectId: number; success: boolean }[],
    Error,
    AssignProfessionalRequest[]
  >({
    mutationFn: async (assignments) => {
      const results = await Promise.allSettled(
        assignments.map((a) => assignSelectedProfessional(a)),
      );
      return results.map((r, i) => ({
        projectId: assignments[i].projectId,
        success: r.status === "fulfilled",
      }));
    },
    onSuccess: (results) => {
      const succeeded = results.filter((r) => r.success).length;
      const failed = results.length - succeeded;

      if (succeeded > 0) {
        toast.success(`Assigned professionals to ${succeeded} project(s)`);
      }
      if (failed > 0) {
        toast.error(`Failed to assign professionals to ${failed} project(s)`);
      }

      queryClient.invalidateQueries({ queryKey: ["ai-shortlisting"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: () => {
      toast.error("Bulk assignment failed");
    },
  });
}

export function useRejectAllAndManuallySelect() {
  return useMutationWithToast({
    mutationFn: (data: RejectAllRequest) => rejectAllAndManuallySelect(data),
    successMessage: "All professionals rejected. You can now manually select.",
    errorMessage: "Failed to reject professionals",
    invalidateKeys: (_, variables) => [
      ["ai-shortlisting", "results", String(variables.projectId)],
      ["jobs", "ai-review"],
      ["jobs", "pending"],
    ],
  });
}

export function useBulkAIShortlisting() {
  const queryClient = useQueryClient();

  return useMutation<BulkShortlistResult[], Error, number[]>({
    mutationFn: (projectIds) => bulkStartAIShortlisting(projectIds),
    onSuccess: (data) => {
      const failed = data.filter((r) => r.status === "FAILED");
      const started = data.filter((r) => r.status === "STARTED");

      if (started.length > 0) {
        toast.success(
          `AI shortlisting started for ${started.length} project(s)`,
        );
      }
      if (failed.length > 0) {
        toast.error(`Failed to start ${failed.length} project(s)`);
      }

      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["ai-shortlisting"] });
    },
    onError: () => {
      toast.error("Bulk AI shortlisting failed");
    },
  });
}

export function useJobDetail(id: number, enabled = true) {
  return useQuery<JobDetail>({
    queryKey: ["jobs", "detail", id],
    queryFn: () => getJobDetail(id),
    enabled: enabled && !!id,
  });
}

export function useAIReviewJobs(enabled = true, filters: JobFilters = {}) {
  return useQuery<JobsResponse>({
    queryKey: ["jobs", "ai-review", filters],
    queryFn: () => getAIReviewJobs(filters),
    enabled,
    refetchInterval: 10000,
  });
}

export function useAssignedJobs(enabled = true, filters: JobFilters = {}) {
  return useQuery<JobsResponse>({
    queryKey: ["jobs", "assigned", filters],
    queryFn: () => getAssignedJobs(filters),
    enabled,
  });
}
