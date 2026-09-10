import type { PaginatedResponse } from "./api";

export type JobStatus =
  | "DRAFT"
  | "PENDING"
  | "DECLINED"
  | "RE_ASSIGNING_PROFESSIONALS"
  | "AWAITING_ACCEPTANCE"
  | "SHORTLISTING_PROFESSIONAL"
  | "ASSIGNING_PROFESSIONAL"
  | "ONGOING"
  | "AWAITING_REVIEW"
  | "AWAITING_PAYMENT_APPROVAL"
  | "PAYMENT_FAILED"
  | "PAYMENT_PROCESSING"
  | "COMPLETED";

export type Urgency = "Normal" | "High" | "Urgent";

export type Job = {
  id: number;
  jobId: string;
  title: string;
  companyName: string;
  status: JobStatus;
  budget: string;
  actualBudget: number | null;
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
  assignedProfessionalId: number | null;
  assignedAt: string | null;
  offerStatus: string | null;
};

export type JobsResponse = PaginatedResponse<Job>;

export type MilestoneItem = {
  id: number;
  title: string;
  description: string | null;
  percentage: number | null;
  status: string | null;
  dueDate: string | null;
  completedAt: string | null;
};

export type DeliverableItem = {
  id: number;
  name: string | null;
  description: string | null;
  isCompleted: boolean | null;
  dueDate: string | null;
  fileUrl: string | null;
  fileName: string | null;
  submittedDate: string | null;
};

export type PaymentInfo = {
  status: string | null;
  amount: number | null;
  currency: string | null;
  paidAt: string | null;
  transactionReference: string | null;
  paystackReceiptUrl: string | null;
};

export type JobDetail = {
  id: number;
  jobId: string;
  title: string;
  companyName: string;
  companyEmail: string | null;
  status: JobStatus;
  budget: string;
  actualBudget: number | null;
  duration: string;
  durationWeeks: number;
  startDate: string | null;
  dueDate: string | null;
  completionDate: string | null;
  submittedAt: string;
  urgency: Urgency;
  description: string;
  requiredSkills: string[];
  experienceLevel: string | null;
  professionalRating: number | null;
  companyFeedback: string | null;
  progressPercentage: number;
  assignedProfessionalId: number | null;
  assignedProfessionalName: string | null;
  assignedProfessionalEmail: string | null;
  milestones: MilestoneItem[];
  deliverables: DeliverableItem[];
  payment: PaymentInfo | null;
};

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
  matchLevel: "PERFECT" | "EXCELLENT" | "VERY_GOOD" | "GOOD" | "FAIR";
  yearsExperience: number;
  projectsCompleted: number;
};

export type AIShortlistingStatus =
  | "not_started"
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "no_matches";

export type AIShortlistingStatusResponse = {
  projectId: number;
  status: AIShortlistingStatus;
  processedTime?: string;
  errorMessage?: string | null;
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

