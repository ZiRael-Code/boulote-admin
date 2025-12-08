import axiosInstance from "../axios-config";
import type { JobsResponse, AIReviewJobsResponse } from "@/lib/types/job";

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

