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

export type SortConfig = {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
};

export type Pageable = {
  pageNumber: number;
  pageSize: number;
  sort: SortConfig;
  offset: number;
  paged: boolean;
  unpaged: boolean;
};

export type JobsResponse = {
  content: Job[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: SortConfig;
  empty: boolean;
};

export type ShortlistedProfessional = {
  initials: string;
  name: string;
  role: string;
  reviewCount: number;
  successRate: number;
  yearsExperience: number;
  projectsCompleted: number;
  aiMatch: string;
  skills: string[];
};

export type AIReviewJob = {
  jobId: string;
  title: string;
  companyName: string;
  aiMatchScore: string;
  processedTime: string;
  candidatesFound: number;
  urgency: Urgency;
  shortlistedProfessionals: ShortlistedProfessional[];
};

export type AIReviewJobsResponse = AIReviewJob[];

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
  professionals: ShortlistedProfessional[];
  totalCandidates: number;
  processedAt: string;
  matchScores: {
    professionalId: number;
    matchScore: number;
    reasoning: string;
  }[];
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

