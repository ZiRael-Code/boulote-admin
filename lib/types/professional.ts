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

export type ProfessionalsResponse = {
  content: Professional[];
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

