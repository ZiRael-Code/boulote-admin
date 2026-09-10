import axiosInstance from "../axios-config";
import type { AdminPaymentsResponse } from "@/lib/types/payment";

export type PaymentFilters = {
  status?: string;
  page?: number;
};

export async function getPayments(filters: PaymentFilters = {}): Promise<AdminPaymentsResponse> {
  const response = await axiosInstance.get<AdminPaymentsResponse>("/admin/payments", {
    params: { status: filters.status || undefined, page: filters.page, size: 20 },
  });
  return response.data;
}

export async function reconcileTransfer(transactionId: number): Promise<{ result: string }> {
  const response = await axiosInstance.post<{ result: string }>(
    `/admin/payments/${transactionId}/reconcile-transfer`
  );
  return response.data;
}
