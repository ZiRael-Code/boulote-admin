import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: number) => startAIShortlisting(projectId),
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({
        queryKey: ["ai-shortlisting", "status", projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["ai-shortlisting", "active-processes"],
      });
      queryClient.invalidateQueries({
        queryKey: ["jobs", "pending"],
      });
      toast.success("AI shortlisting started successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to start AI shortlisting"
      );
    },
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
      // Poll every 3 seconds if processing, stop polling if completed or failed
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
    retry: false, // Don't retry on 400 errors
  });
}

export function useActiveAIShortlistingProcesses(enabled = true) {
  return useQuery<ActiveProcessesResponse>({
    queryKey: ["ai-shortlisting", "active-processes"],
    queryFn: getActiveAIShortlistingProcesses,
    enabled,
    refetchInterval: 5000, // Poll every 5 seconds for active processes
  });
}

export function useAssignSelectedProfessional() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignProfessionalRequest) =>
      assignSelectedProfessional(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["ai-shortlisting", "results", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["jobs", "ai-review"],
      });
      queryClient.invalidateQueries({
        queryKey: ["jobs", "pending"],
      });
      queryClient.invalidateQueries({
        queryKey: ["jobs", "ongoing"],
      });
      toast.success("Professional assigned successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to assign professional"
      );
    },
  });
}

export function useRejectAllAndManuallySelect() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RejectAllRequest) => rejectAllAndManuallySelect(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["ai-shortlisting", "results", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["jobs", "ai-review"],
      });
      queryClient.invalidateQueries({
        queryKey: ["jobs", "pending"],
      });
      toast.success("All professionals rejected. You can now manually select.");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to reject professionals"
      );
    },
  });
}

