import type { PaginatedResponse } from "./api";

export type JobStatus = "PENDING" | "ONGOING" | "COMPLETED" | "AI_REVIEW";

export type Urgency = "Low" | "Normal" | "High";

export type Job = {
  id: number;
  jobId: string;
  title: string;
  companyName: string;
  status: JobStatus;
  budget: string;
  actualBudget: string | null;
  duration: string;
  durationWeeks: number;
  startDate: string | null;
  dueDate: string;
  completionDate: string | null;
  submittedAt: string;
  urgency: Urgency;
  description: string;
  professionalRating: number | null;
  companyFeedback: string | null;
  progressPercentage: number;
  assignedProfessionalName: string | null;
};

export type JobsResponse = PaginatedResponse<Job>;

export type ProfessionalProfile = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profession: string;
  bio: string | null;
  profilePictureUrl: string | null;
  averageRating: number | null;
  totalRatings: number | null;
  location: string | null;
  phoneNumber: string | null;
  successRate: number;
};

export type ShortlistedProfessional = {
  professional: ProfessionalProfile;
  matchScore: number;
  scoreBreakdown: {
    profession: number;
    skills: number;
    performance: number;
    experience: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
  matchLevel: "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
};

export type AIShortlistingStatus = "pending" | "processing" | "completed" | "failed";

export type AIShortlistingStatusResponse = {
  projectId: number;
  status: AIShortlistingStatus;
  startedAt?: string;
  completedAt?: string;
  error?: string;
};

export type ShortlistingResult = {
  projectId: number;
  jobId: string;
  title: string;
  companyName: string;
  status: string;
  processedTime: string;
  candidatesFound: number;
  urgency: Urgency;
  aiMatchScore: string;
  errorMessage: string | null;
  professionals: ShortlistedProfessional[];
  createdAt: string;
};

export type ActiveProcess = {
  projectId: number;
  projectTitle: string;
  status: AIShortlistingStatus;
  startedAt: string;
  progress?: number;
};

export type ActiveProcessesResponse = {
  activeProcesses: ActiveProcess[];
};

