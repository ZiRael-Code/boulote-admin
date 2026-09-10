import axiosInstance from "../axios-config";
import type {
  JobsResponse,
  AIShortlistingStatusResponse,
  ShortlistingResult,
  ActiveProcessesResponse,
  JobDetail,
} from "@/lib/types/job";

export type JobFilters = {
  search?: string;
  budget?: string;
  urgency?: string;
  page?: number;
};

const PAGE_SIZE = 10;

export async function getPendingJobs(filters: JobFilters = {}): Promise<JobsResponse> {
  const response = await axiosInstance.get<JobsResponse>("/admin/job/pending", {
    params: { ...filters, size: PAGE_SIZE },
  });
  return response.data;
}

export async function getJobDetail(id: number): Promise<JobDetail> {
  const response = await axiosInstance.get<JobDetail>(`/admin/job/${id}`);
  return response.data;
}

export async function getOngoingJobs(filters: JobFilters = {}): Promise<JobsResponse> {
  const response = await axiosInstance.get<JobsResponse>("/admin/job/ongoing", {
    params: { ...filters, size: PAGE_SIZE },
  });
  return response.data;
}

export async function getCompletedJobs(filters: JobFilters = {}): Promise<JobsResponse> {
  const response = await axiosInstance.get<JobsResponse>("/admin/job/completed", {
    params: { ...filters, size: PAGE_SIZE },
  });
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
): Promise<ShortlistingResult | null> {
  try {
    const response = await axiosInstance.get<ShortlistingResult>(
        `/admin/ai-shortlisting/project/results/${projectId}`
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { status?: number } };
    if (axiosError.response?.status === 400) {
      return null;
    }
    throw error;
  }
}

export async function getAIReviewJobs(filters: JobFilters = {}): Promise<JobsResponse> {
  const response = await axiosInstance.get<JobsResponse>("/admin/job/ai-review", {
    params: { search: filters.search, urgency: filters.urgency, page: filters.page, size: PAGE_SIZE },
  });
  return response.data;
}

export async function getAssignedJobs(filters: JobFilters = {}): Promise<JobsResponse> {
  const response = await axiosInstance.get<JobsResponse>("/admin/job/assigned", {
    params: { search: filters.search, urgency: filters.urgency, page: filters.page, size: PAGE_SIZE },
  });
  return response.data;
}

export async function getActiveAIShortlistingProcesses(): Promise<ActiveProcessesResponse> {
  const response = await axiosInstance.get<ActiveProcessesResponse>(
      "/admin/ai-shortlisting/active-processes"
  );
  return response.data;
}

export type AssignProfessionalRequest = {
  projectId: number;
  professionalId: number;
  assignmentNotes: string;
};

export async function assignSelectedProfessional(
    data: AssignProfessionalRequest
): Promise<void> {
  await axiosInstance.post(
      "/admin/ai-shortlisting/assign-selected-professional",
      data
  );
}

export type RejectAllRequest = {
  projectId: number;
  rejectionReason: string;
  alternativePlan: string;
};

export async function rejectAllAndManuallySelect(
    data: RejectAllRequest
): Promise<void> {
  await axiosInstance.post(
      "/admin/ai-shortlisting/reject-all-and-manually-select",
      data
  );
}

export type BulkShortlistResult = {
  projectId: number;
  status: "STARTED" | "FAILED";
  jobId?: string;
  title?: string;
  error?: string;
};

export async function bulkStartAIShortlisting(
    projectIds: number[]
): Promise<BulkShortlistResult[]> {
  const response = await axiosInstance.post<BulkShortlistResult[]>(
      "/admin/ai-shortlisting/project/bulk-start",
      projectIds
  );
  return response.data;
}