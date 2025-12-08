import { useQuery } from "@tanstack/react-query";
import {
  getPendingJobs,
  getOngoingJobs,
  getAIReviewJobs,
  getCompletedJobs,
} from "@/lib/api/services/jobs";
import type { JobsResponse, AIReviewJobsResponse } from "@/lib/types/job";

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

export function useAIReviewJobs(enabled = true) {
  return useQuery<AIReviewJobsResponse>({
    queryKey: ["jobs", "ai-review"],
    queryFn: getAIReviewJobs,
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

