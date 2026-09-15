"use client";

import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/auth.schema";
import { useAuth } from "@/hooks/use-auth";
import PasswordInput from "@/components/ui/input/password-input";
import Button from "@/components/ui/button";
import { getErrorMessage } from "@/lib/types/api";
import type { ApiError } from "@/lib/types/api";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { resetPassword, isResetPasswordLoading, resetPasswordError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordInput) => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }
    resetPassword({ token, password: data.password });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-semibold text-[24px] text-black mb-2">Reset Your Password</h1>
            <p className="text-sm text-gray-400">Please enter your new password</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {resetPasswordError && (
              <div className="bg-error-50 border border-error-500 text-error-600 px-4 py-3 rounded-md text-sm">
                {getErrorMessage(resetPasswordError as ApiError, "Failed to reset password. Please try again.")}
              </div>
            )}

            <PasswordInput
              label="New Password"
              placeholder="Password (6 or more characters)"
              error={errors.password?.message}
              fullWidth
              {...register("password")}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              error={errors.confirmPassword?.message}
              fullWidth
              {...register("confirmPassword")}
            />

            <Button type="submit" variant="primary" size="md" fullWidth loading={isResetPasswordLoading}>
              Reset Password
            </Button>

            <p className="text-center text-sm text-gray-400">
              Remember your password?{" "}
              <a href="/auth/login" className="text-primary-500 hover:text-primary-600 font-medium">
                Log in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
