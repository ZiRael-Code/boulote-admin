import axiosInstance from "../axios-config";
import type {
  SubscriptionPlan,
  SavePlanRequest,
  PaymentGateway,
  ConnectPaystackRequest,
  PlatformSettings,
  UpdatePlatformSettingsRequest,
} from "@/lib/types/admin-settings";

export async function changePassword(data: { oldPassword: string; newPassword: string }): Promise<void> {
  await axiosInstance.post("/user/change", data);
}

export async function changeEmail(data: { currentPassword: string; newEmail: string }): Promise<void> {
  await axiosInstance.post("/user/change-email", data);
}

export async function getPlans(): Promise<SubscriptionPlan[]> {
  const response = await axiosInstance.get<SubscriptionPlan[]>("/admin/subscription/plans");
  return response.data;
}

export async function createPlan(data: SavePlanRequest): Promise<SubscriptionPlan> {
  const response = await axiosInstance.post<SubscriptionPlan>("/admin/subscription/plans", data);
  return response.data;
}

export async function updatePlan(id: number, data: SavePlanRequest): Promise<SubscriptionPlan> {
  const response = await axiosInstance.put<SubscriptionPlan>(`/admin/subscription/plans/${id}`, data);
  return response.data;
}

export async function togglePlanStatus(id: number, active: boolean): Promise<void> {
  await axiosInstance.patch(`/admin/subscription/plans/${id}/toggle`, null, {
    params: { active },
  });
}

export async function getGatewayStatuses(): Promise<PaymentGateway[]> {
  const response = await axiosInstance.get<PaymentGateway[]>("/admin/subscription/gateways");
  return response.data;
}

export async function connectPaystack(data: ConnectPaystackRequest): Promise<void> {
  await axiosInstance.post("/admin/subscription/gateways/paystack/connect", data);
}

export async function disconnectPaystack(): Promise<void> {
  await axiosInstance.post("/admin/subscription/gateways/paystack/disconnect");
}

export async function getPlatformSettings(): Promise<PlatformSettings> {
  const response = await axiosInstance.get<PlatformSettings>("/admin/subscription/settings");
  return response.data;
}

export async function updatePlatformSettings(
  data: UpdatePlatformSettingsRequest,
  logoFile: File | null,
): Promise<PlatformSettings> {
  const formData = new FormData();
  if (logoFile) {
    formData.append("logo", logoFile);
  }
  formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));

  const response = await axiosInstance.put<PlatformSettings>("/admin/subscription/settings", formData, {
    headers: { "Content-Type": undefined },
  });
  return response.data;
}
