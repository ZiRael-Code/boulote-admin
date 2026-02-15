import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { ApiError } from "@/lib/types/api";
import { getErrorMessage } from "@/lib/types/api";

type MutationWithToastOptions<TData, TVariables> = {
  mutationFn: (variables: TVariables) => Promise<TData>;
  successMessage: string;
  errorMessage: string;
  invalidateKeys:
    | string[][]
    | ((data: TData, variables: TVariables) => string[][]);
  onSuccessExtra?: (data: TData, variables: TVariables) => void;
} & Omit<
  UseMutationOptions<TData, ApiError, TVariables>,
  "mutationFn" | "onSuccess" | "onError"
>;

export function useMutationWithToast<TData = unknown, TVariables = void>({
  mutationFn,
  successMessage,
  errorMessage,
  invalidateKeys,
  onSuccessExtra,
  ...rest
}: MutationWithToastOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation<TData, ApiError, TVariables>({
    mutationFn,
    onSuccess: (data, variables) => {
      const keys =
        typeof invalidateKeys === "function"
          ? invalidateKeys(data, variables)
          : invalidateKeys;
      for (const key of keys) {
        queryClient.invalidateQueries({ queryKey: key });
      }
      toast.success(successMessage);
      onSuccessExtra?.(data, variables);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, errorMessage));
    },
    ...rest,
  });
}
