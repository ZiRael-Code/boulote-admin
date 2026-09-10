import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getPayments, reconcileTransfer, type PaymentFilters } from "@/lib/api/services/payments";
import type { AdminPaymentsResponse } from "@/lib/types/payment";

export function usePayments(filters: PaymentFilters = {}) {
  return useQuery<AdminPaymentsResponse>({
    queryKey: ["payments", filters],
    queryFn: () => getPayments(filters),
  });
}

export function useReconcileTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: number) => reconcileTransfer(transactionId),
    onSuccess: (data) => {
      toast.success(data.result);
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: () => {
      toast.error("Failed to reconcile this transaction");
    },
  });
}
