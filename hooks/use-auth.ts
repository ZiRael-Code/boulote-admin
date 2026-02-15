import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  authService,
  LoginRequest,
} from "@/lib/api/services/auth";
import { useAuthStore } from "@/lib/store/auth-store";
import type { ApiError } from "@/lib/types/api";
import { getErrorMessage } from "@/lib/types/api";

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuth, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      setAuth(
        {
          id: Number(data.id),
          email: data.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          role: data.roles[0] === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN",
        },
        data.accessToken
      );
      toast.success("Login successful");
      router.push("/dashboard");
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, "Login failed"));
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push("/auth/login");
    },
    onError: () => {
      clearAuth();
      queryClient.clear();
      router.push("/auth/login");
    },
  });

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
  };
};
