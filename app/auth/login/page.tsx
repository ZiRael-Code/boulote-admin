"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { loginSchema, LoginInput } from "@/lib/validations/auth.schema";
import { useAuth } from "@/hooks/use-auth";
import Input from "@/components/ui/input";
import PasswordInput from "@/components/ui/input/password-input";
import Button from "@/components/ui/button";

function LoginForm() {
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";
  const [enable2FA, setEnable2FA] = useState(false);

  const { login, isLoginLoading, loginError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    login(data);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="md:grid md:grid-cols-[40%_60%] md:gap-[40px] md:pt-[64px] md:px-[64px] md:pb-0">
        <div className="bg-primary-500 md:rounded-tr-[15px] md:rounded-br-[15px] rounded-bl-[15px] rounded-br-[15px] md:rounded-bl-none h-auto md:h-[90vh] flex flex-col justify-between p-[24px] md:p-[40px]">
          <div className="h-[40px] w-[128px] relative">
            <Image
              src="/assets/white-logo.png"
              alt="Boulote Admin"
              width={128}
              height={40}
              className="object-contain"
            />
          </div>

          <div className="text-white md:mt-0 mt-[16px]">
            <h2 className="font-semibold text-[32px]  mb-[16px] md:mb-[24px]">
              Work, Connect and Manage
            </h2>
            <div className="text-[18px] tracking-[0.1px] md:tracking-normal font-normal md:font-medium">
              <p className="mb-[32px] md:mb-[16px]">
                Powerful administration tools for managing your professional
                networking platform with enterprise-grade security and
                analytics.
              </p>
              <ul className="list-disc ms-[20px] space-y-8px]">
                <li className="mb-2">Advanced user management</li>
                <li className="mb-2">Real-time analytics & insights</li>
                <li className="mb-2">AI-powered content moderation</li>
                <li className="mb-2">Comprehensive audit trails</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="md:pt-0 pt-[40px] px-[16px] md:px-0 flex flex-col items-center md:items-start">
          <div className="w-full lg:pr-[64px]">
            <div className="text-left mb-8 hidden md:block">
              <h1 className="font-semibold text-[20px] lg:text-[32px] tracking-[0.1px] md:tracking-[1px] text-black mb-2">
                Welcome Back
              </h1>
              <p className="text-[14px] md:text-lg font-medium tracking-[0.1px] text-black">
                Please enter your details to sign in to your account
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {resetSuccess && (
                <div className="bg-success-50 border border-success-500 text-success-700 px-4 py-3 rounded-md text-sm">
                  Password reset successful! Please log in with your new
                  password.
                </div>
              )}

              {loginError && (
                <div className="bg-error-50 border border-error-500 text-error-600 px-4 py-3 rounded-md text-sm">
                  {loginError.message || "Invalid email or password"}
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

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                error={errors.password?.message}
                fullWidth
                {...register("password")}
              />

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enable2FA}
                  onChange={(e) => setEnable2FA(e.target.checked)}
                  className="w-4 h-4 text-primary-500 border-border-500 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-normal leading-[16.8px] tracking-[0.1px] text-black">
                  Enable 2-factor authentication
                </span>
              </label>

              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                loading={isLoginLoading}
                className="h-[60px] md:h-[46px]"
              >
                Log In
              </Button>

              <div className="text-center">
                <a
                  href="/auth/forgot-password"
                  className="text-sm font-normal leading-[16.8px] tracking-[0.1px] text-primary-300 hover:text-primary-400"
                >
                  Forgot your password ?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
