import { useQuery } from "@tanstack/react-query";
import { useMutationWithToast } from "./use-mutation-with-toast";
import { getSupportRequests, getSupportRequest, replySupportRequest, type SupportFilters } from "@/lib/api/services/support";

export function useSupportRequests(filters: SupportFilters = {}) {
  return useQuery({
    queryKey: ["support-requests", filters],
    queryFn: () => getSupportRequests(filters),
  });
}

export function useSupportRequest(id: number, enabled = true) {
  return useQuery({
    queryKey: ["support-requests", id],
    queryFn: () => getSupportRequest(id),
    enabled: enabled && !!id,
  });
}

export function useReplySupportRequest() {
  return useMutationWithToast({
    mutationFn: ({ id, reply }: { id: number; reply: string }) => replySupportRequest(id, reply),
    successMessage: "Reply sent",
    errorMessage: "Failed to send reply",
    invalidateKeys: (_data, variables) => [["support-requests"], ["support-requests", String(variables.id)]],
  });
}
