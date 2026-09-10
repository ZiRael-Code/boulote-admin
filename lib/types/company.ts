import type { PaginatedResponse } from "./api";

export type CompanyStatus = "Active" | "Approved" | "Pending" | "Rejected" | "Deactivated";

// Industry, size, and plan are admin-configurable catalog values (see
// CompanyTypeService/CompanySizeService/PaymentPlanRepository on the backend),
// not a fixed set — fetch real options via getCompanyFilterOptions() rather
// than hardcoding a union here.
export type Company = {
  id: number;
  initials: string;
  name: string;
  email: string;
  industry: string;
  size: string;
  plan: string;
  status: CompanyStatus;
  lastActive: string;
  joinedDate: string;
  employeeCount: number;
  location: string;
};

export type CompanyFilterOptions = {
  industries: string[];
  sizes: string[];
  plans: string[];
};

export type CompanyDocument = {
  type: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: string;
};

export type CompanyStats = {
  totalCompanies: number;
  activeCompanies: number;
  pendingApprovals: number;
  enterprisePlans: number;
  premiumPlans: number;
};

export type CompaniesDashboardResponse = {
  stats: CompanyStats;
};

export type CompaniesResponse = PaginatedResponse<Company>;

export type PendingCompanyApproval = {
  id: number;
  initials: string;
  name: string;
  email: string;
  industry: string;
  size: string;
  requestedPlan?: string;
  submittedDate: string;
  waitingDays?: number;
  documents?: string[];
  priority?: "Low" | "Normal" | "High";
};

export type PendingCompaniesResponse = PendingCompanyApproval[];

export type CompanyProfile = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  industry: string;
  size: string;
  plan: string;
  status: CompanyStatus;
  description: string;
  employeeCount: number;
  joinedDate: string;
  lastActive: string;
  location: string;
  foundedYear?: string;
  documents: CompanyDocument[];
  teamMembers: TeamMember[];
  history: CompanyHistory;
};

export type TeamMember = {
  name: string;
  role: string;
  email: string;
  department: string;
};

export type CompanyHistory = {
  registeredDate: string;
  approvedDate?: string;
  projectsPosted: number;
  activeProjects: number;
  completedProjects: number;
  averageRating: number;
  recentActivities: RecentActivity[];
};

export type RecentActivity = {
  type: string;
  description: string;
  timeAgo: string;
  timestamp: string;
};

