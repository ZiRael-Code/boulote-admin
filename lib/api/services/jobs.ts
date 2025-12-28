import axiosInstance from "../axios-config";
import type {
  JobsResponse,
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
): Promise<ShortlistingResult | null> {
  try {
    const response = await axiosInstance.get<ShortlistingResult>(
      `/admin/ai-shortlisting/project/results/${projectId}`
    );
    return response.data;
  } catch (error: any) {
    // Handle 400 error as "no results" - this is expected when shortlisting is not completed
    if (error.response?.status === 400) {
      return null;
    }
    // Re-throw other errors
    throw error;
  }
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

