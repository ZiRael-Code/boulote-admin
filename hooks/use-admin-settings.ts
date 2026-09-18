import { useQuery } from "@tanstack/react-query";
import { useMutationWithToast } from "./use-mutation-with-toast";
import {
  changePassword,
  changeEmail,
  getPlans,
  createPlan,
  updatePlan,
  togglePlanStatus,
  getGatewayStatuses,
  connectPaystack,
  disconnectPaystack,
  getPlatformSettings,
  updatePlatformSettings,
} from "@/lib/api/services/admin-settings";
import type {
  SubscriptionPlan,
  SavePlanRequest,
  PaymentGateway,
  ConnectPaystackRequest,
  PlatformSettings,
  UpdatePlatformSettingsRequest,
} from "@/lib/types/admin-settings";

export function useChangePassword() {
  return useMutationWithToast({
    mutationFn: (data: { oldPassword: string; newPassword: string }) => changePassword(data),
    successMessage: "Password changed successfully",
    errorMessage: "Failed to change password",
    invalidateKeys: [],
  });
}

export function useChangeEmail() {
  return useMutationWithToast({
    mutationFn: (data: { currentPassword: string; newEmail: string }) => changeEmail(data),
    successMessage: "Email changed successfully - use it next time you log in",
    errorMessage: "Failed to change email",
    invalidateKeys: [],
  });
}

export function usePlans(enabled = true) {
  return useQuery<SubscriptionPlan[]>({
    queryKey: ["admin-settings", "plans"],
    queryFn: getPlans,
    enabled,
  });
}

export function useCreatePlan() {
  return useMutationWithToast({
    mutationFn: (data: SavePlanRequest) => createPlan(data),
    successMessage: "Subscription plan created",
    errorMessage: "Failed to create plan",
    invalidateKeys: [["admin-settings", "plans"]],
  });
}

export function useUpdatePlan() {
  return useMutationWithToast({
    mutationFn: ({ id, data }: { id: number; data: SavePlanRequest }) => updatePlan(id, data),
    successMessage: "Subscription plan updated",
    errorMessage: "Failed to update plan",
    invalidateKeys: [["admin-settings", "plans"]],
  });
}

export function useTogglePlanStatus() {
  return useMutationWithToast({
    mutationFn: ({ id, active }: { id: number; active: boolean }) => togglePlanStatus(id, active),
    successMessage: "Plan status updated",
    errorMessage: "Failed to update plan status",
    invalidateKeys: [["admin-settings", "plans"]],
  });
}

export function useGatewayStatuses(enabled = true) {
  return useQuery<PaymentGateway[]>({
    queryKey: ["admin-settings", "gateways"],
    queryFn: getGatewayStatuses,
    enabled,
  });
}

export function useConnectPaystack() {
  return useMutationWithToast({
    mutationFn: (data: ConnectPaystackRequest) => connectPaystack(data),
    successMessage: "Paystack connected",
    errorMessage: "Failed to connect Paystack",
    invalidateKeys: [["admin-settings", "gateways"]],
  });
}

export function useDisconnectPaystack() {
  return useMutationWithToast({
    mutationFn: () => disconnectPaystack(),
    successMessage: "Paystack disconnected",
    errorMessage: "Failed to disconnect Paystack",
    invalidateKeys: [["admin-settings", "gateways"]],
  });
}

export function usePlatformSettings(enabled = true) {
  return useQuery<PlatformSettings>({
    queryKey: ["admin-settings", "platform"],
    queryFn: getPlatformSettings,
    enabled,
  });
}

export function useUpdatePlatformSettings() {
  return useMutationWithToast({
    mutationFn: ({ data, logoFile }: { data: UpdatePlatformSettingsRequest; logoFile: File | null }) =>
      updatePlatformSettings(data, logoFile),
    successMessage: "Platform settings updated",
    errorMessage: "Failed to update platform settings",
    invalidateKeys: [["admin-settings", "platform"]],
  });
}
