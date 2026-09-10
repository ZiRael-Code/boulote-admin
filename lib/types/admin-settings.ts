export type SubscriptionPlan = {
  id: number;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  active: boolean;
};

export type SavePlanRequest = {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  active: boolean;
};

export type PaymentGateway = {
  gateway: string;
  connected: boolean;
};

export type ConnectPaystackRequest = {
  publicKey: string;
  secretKey: string;
  webhookSecret: string;
  sandboxMode: boolean;
};

export type PlatformSettings = {
  logoUrl: string | null;
  primaryColor: string | null;
  companyName: string | null;
  supportEmail: string | null;
};

export type UpdatePlatformSettingsRequest = {
  primaryColor?: string;
  companyName?: string;
  supportEmail?: string;
};
