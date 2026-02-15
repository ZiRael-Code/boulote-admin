import type { PaginatedResponse } from "./api";

export type CompanyStatus = "Active" | "Inactive" | "Pending" | "IN_REVIEW";

export type CompanySize = "Small" | "Medium" | "Large";

export type CompanyPlan = "Free" | "Premium" | "Enterprise" | "Pay Per Project";

export type CompanyIndustry =
  | "Technology"
  | "Renewable energy"
  | "Artificial Intelligence"
  | "Finance"
  | "Healthcare"
  | "Education"
  | "Other";

export type Company = {
  id: number;
  initials: string;
  name: string;
  email: string;
  industry: CompanyIndustry;
  size: CompanySize;
  plan: CompanyPlan;
  status: CompanyStatus;
  lastActive: string;
  joinedDate: string;
  employeeCount: number;
  location: string;
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
  industry: CompanyIndustry;
  size: CompanySize;
  requestedPlan?: CompanyPlan;
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
  industry: CompanyIndustry;
  size: CompanySize;
  plan: CompanyPlan;
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

