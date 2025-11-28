import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  authService,
  LoginRequest,
} from "@/lib/api/services/auth";
import { useAuthStore } from "@/lib/store/auth-store";

export type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

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
          role: data.roles[0] as "ADMIN" | "SUPER_ADMIN",
        },
        data.accessToken
      );
      toast.success("Login successful");
      router.push("/dashboard");
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || "Login failed");
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
    onError: (error: ApiError) => {
      console.log(error, "error");
    },
  });


  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
  };
};

