import axiosInstance from "../axios-config";
import type {
  JobsResponse,
  AIReviewJobsResponse,
  AIShortlistingStatusResponse,
  ShortlistingResult,
  ActiveProcessesResponse,
} from "@/lib/types/job";

export async function getPendingJobs(): Promise<JobsResponse> {
  const response = await axiosInstance.get<JobsResponse>("/admin/job/pending");
  return response.data;
}

export async function getOngoingJobs(): Promise<JobsResponse> {
  const response = await axiosInstance.get<JobsResponse>("/admin/job/ongoing");
  return response.data;
}

export async function getAIReviewJobs(): Promise<AIReviewJobsResponse> {
  const response = await axiosInstance.get<AIReviewJobsResponse>("/admin/job/ai-reviews");
  return response.data;
}

export async function getCompletedJobs(): Promise<JobsResponse> {
  const response = await axiosInstance.get<JobsResponse>("/admin/job/completed");
  return response.data;
}

export async function startAIShortlisting(projectId: number): Promise<void> {
  await axiosInstance.post(`/admin/ai-shortlisting/project/start/${projectId}`);
}

export async function getAIShortlistingStatus(
  projectId: number
): Promise<AIShortlistingStatusResponse> {
  const response = await axiosInstance.get<AIShortlistingStatusResponse>(
    `/admin/ai-shortlisting/project/status/${projectId}`
  );
  return response.data;
}

export async function getAIShortlistingResults(
  projectId: number
): Promise<ShortlistingResult> {
  const response = await axiosInstance.get<ShortlistingResult>(
    `/admin/ai-shortlisting/project/results/${projectId}`
  );
  return response.data;
}

export async function getActiveAIShortlistingProcesses(): Promise<ActiveProcessesResponse> {
  const response = await axiosInstance.get<ActiveProcessesResponse>(
    "/admin/ai-shortlisting/active-processes"
  );
  return response.data;
}

