import type { PaginatedResponse } from "./api";

export type SupportRequest = {
  id: number;
  requesterType: "PROFESSIONAL" | "COMPANY" | "ADMIN" | null;
  requesterId: number | null;
  name: string;
  email: string;
  message: string;
  screenshotUrl: string | null;
  resolved: boolean;
  adminReply: string | null;
  repliedAt: string | null;
  createdAt: string;
};

export type SupportRequestsResponse = PaginatedResponse<SupportRequest>;
