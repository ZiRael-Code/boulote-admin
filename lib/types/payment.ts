import type { PaginatedResponse } from "./api";

export type AdminPaymentTransaction = {
  id: number;
  transactionReference: string | null;
  companyName: string | null;
  professionalName: string | null;
  projectTitle: string | null;
  amount: number | null;
  professionalPayout: number | null;
  status: string;
  message: string | null;
  pendingSettlement: boolean;
  paystackTransferReference: string | null;
  submittedAt: string | null;
  paidAt: string | null;
  completedAt: string | null;
  needsAttention: boolean;
};

export type AdminPaymentsResponse = PaginatedResponse<AdminPaymentTransaction>;
