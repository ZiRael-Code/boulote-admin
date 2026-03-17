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

export type ProfessionalProfile = {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  rating: number;
  reviewCount: number;
  subscription: string;
  status: string;
  joinedDate: string;
  lastActive: string;
  bio: string;
  skills: string[];
  experienceLevel: string;
  workExperiences: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  documents: DocumentInfo[];
  quizStats: QuizStats;
  mentorEligibility: MentorEligibility;
  recentActivities: Activity[];
};

export type WorkExperience = {
  title: string;
  company: string;
  period: string;
  achievements: string[];
};

export type Education = {
  degree: string;
  institution: string;
  fieldOfStudy: string;
  period: string;
  gpa: string;
};

export type Certification = {
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate: string;
  credentialId: string;
  credentialUrl: string;
  isVerified: boolean;
};

export type DocumentInfo = {
  type: string;
  fileName: string;
  uploadDate: string;
  fileUrl: string;
};

export type QuizStats = {
  quizzesTaken: number;
  averageScore: number;
  skillsCertified: number;
  skillLevel: string;
  quizHistory: QuizHistory[];
};

export type QuizHistory = {
  quizName: string;
  dateTaken: string;
  questionCount: number;
  timeLimit: number;
  score: number;
  percentage: string;
};

export type MentorEligibility = {
  isEligible: boolean;
  isMentor: boolean;
  criteria: MentorCriteria[];
  category: string;
  specializedAreas: string[];
  maxMentees: number;
  currentMentees: number;
};

export type MentorCriteria = {
  requirement: string;
  met: boolean;
  currentValue: string;
};

export type Activity = {
  type: string;
  description: string;
  timeAgo: string;
};

