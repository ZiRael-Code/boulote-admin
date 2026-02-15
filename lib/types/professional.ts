import type { PaginatedResponse } from "./api";

export type ProfessionalStatus = "PENDING" | "ACTIVE" | "INACTIVE";

export type ProfessionalRole = "OPERATIONS" | "DEVELOPER" | "DESIGNER" | "OTHER";

export type Subscription = "BASIC" | "PREMIUM";

export type Professional = {
  id: number;
  initials: string;
  name: string;
  email: string;
  role: ProfessionalRole;
  rating: number;
  reviewCount: number;
  subscription: Subscription;
  status: ProfessionalStatus;
  joinedDate: string;
  lastActive: string;
  skills: string[];
  experience: string;
  hasDocuments: boolean;
  mentorEligible: boolean;
};

export type ProfessionalsStats = {
  totalProfessionals: number;
  activeProfessionals: number;
  pendingApprovals: number;
  premiumMembers: number;
  averageRating: number;
};

export type ProfessionalsDashboardResponse = {
  stats: ProfessionalsStats;
};

export type ProfessionalsResponse = PaginatedResponse<Professional>;

export type PendingApproval = {
  id: number;
  initials: string;
  name: string;
  email: string;
  skills: string[];
  experience: string;
  hasResume: boolean;
  hasPortfolio: boolean;
  appliedDate: string;
  waitingDays: number;
};

export type PendingApprovalsResponse = {
  pendingApprovals: PendingApproval[];
};

