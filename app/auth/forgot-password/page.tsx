"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  forgotPasswordSchema,
  ForgotPasswordInput,
} from "@/lib/validations/auth.schema";
import { useAuth } from "@/hooks/use-auth";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { getErrorMessage } from "@/lib/types/api";
import type { ApiError } from "@/lib/types/api";

export default function ForgotPasswordPage() {
  const {
    forgotPassword,
    isForgotPasswordLoading,
    forgotPasswordError,
    isForgotPasswordSuccess,
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    forgotPassword(data.email);
  };

  if (isForgotPasswordSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="p-6">
          <Image src="/assets/white-logo.png" alt="Boulote Admin" width={128} height={40} className="hidden" />
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md text-center">
            <h1 className="font-semibold text-[24px] text-black mb-2">
              Reset Link Sent To Your Email
            </h1>
            <p className="text-sm text-gray-400 mb-8">
              Check your inbox for a link to reset your password.
            </p>
            <Button variant="primary" size="md" onClick={() => (window.location.href = "/auth/login")}>
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-semibold text-[24px] text-black mb-2">Forgot Password</h1>
            <p className="text-sm text-gray-400">
              Enter your admin email and we'll send you a reset link
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {forgotPasswordError && (
              <div className="bg-error-50 border border-error-500 text-error-600 px-4 py-3 rounded-md text-sm">
                {getErrorMessage(forgotPasswordError as ApiError, "Failed to send reset link. Please try again.")}
              </div>
            )}

            <Input
              type="email"
              label="Email address"
              placeholder="Enter email address"
              error={errors.email?.message}
              fullWidth
              {...register("email")}
            />

            <Button type="submit" variant="primary" size="md" fullWidth loading={isForgotPasswordLoading}>
              Send Reset Link
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
