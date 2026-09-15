"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  usePlans,
  useCreatePlan,
  useUpdatePlan,
  useGatewayStatuses,
  useConnectPaystack,
  useDisconnectPaystack,
  usePlatformSettings,
  useUpdatePlatformSettings,
  useChangePassword,
} from "@/hooks/use-admin-settings";
import type { SubscriptionPlan, SavePlanRequest } from "@/lib/types/admin-settings";

type View = "main" | "edit-plan" | "upload-logo" | "connect-paystack";

function formatNaira(value: number) {
  return `₦${value.toLocaleString()}`;
}

function EditPlanView({
  plan,
  isNew,
  onSave,
  onCancel,
  isSaving,
}: {
  plan: SubscriptionPlan;
  isNew: boolean;
  onSave: (p: SavePlanRequest) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState({
    name: plan.name,
    monthlyPrice: String(plan.monthlyPrice),
    yearlyPrice: String(plan.yearlyPrice),
    active: plan.active,
  });

  const set = (field: keyof typeof form, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    onSave({
      name: form.name,
      monthlyPrice: Number(form.monthlyPrice) || 0,
      yearlyPrice: Number(form.yearlyPrice) || 0,
      active: form.active,
    });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-secondary-600 mb-1 pb-4 border-b border-gray-200">
        {isNew ? "Add subscription plan" : "Edit subscription plan"}
      </h2>

      <div className="space-y-5 mt-6">

        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Plan name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Enter plan name"
            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-secondary-600 focus:outline-none focus:border-primary-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Monthly price (Naira)</label>
          <input
            type="number"
            value={form.monthlyPrice}
            onChange={(e) => set("monthlyPrice", e.target.value)}
            placeholder="0"
            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-secondary-600 focus:outline-none focus:border-primary-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Yearly price (Naira)</label>
          <input
            type="number"
            value={form.yearlyPrice}
            onChange={(e) => set("yearlyPrice", e.target.value)}
            placeholder="0"
            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-secondary-600 focus:outline-none focus:border-primary-400 transition-colors"
          />
        </div>

        <p className="text-xs text-gray-400">
          Feature toggles for this plan (community access, job application limits, and similar) are not
          editable from this screen yet.
        </p>

        <div>
          <p className="text-sm font-semibold text-secondary-600 mb-3">Status</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => set("active", !form.active)}
              className={cn(
                "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
                form.active ? "bg-green-500" : "bg-gray-300"
              )}
            >
              <span className={cn(
                "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                form.active ? "translate-x-6" : "translate-x-1"
              )} />
            </button>
            <span className="text-sm text-secondary-500">{form.active ? "Active" : "Inactive"}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={isSaving || !form.name}
            className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-200 text-secondary-500 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function UploadLogoView({
  currentLogoUrl,
  onApply,
  onCancel,
  isSaving,
}: {
  currentLogoUrl: string | null;
  onApply: (file: File) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-secondary-600 mb-1 pb-4 border-b border-gray-200">
        Upload platform logo
      </h2>

      <div className="border border-gray-200 rounded-lg p-6 mt-5 bg-white">

        <p className="text-sm font-medium text-secondary-600 mb-3">Current logo</p>
        {currentLogoUrl ? (
          <img src={currentLogoUrl} alt="Current logo" className="w-44 h-24 object-contain bg-gray-50 rounded-md mb-6 border border-gray-200" />
        ) : (
          <div className="w-44 h-24 bg-gray-100 rounded-md mb-6 flex items-center justify-center text-xs text-gray-400">
            No logo set
          </div>
        )}

        {file && (
          <>
            <p className="text-sm font-medium text-secondary-600 mb-3">New logo</p>
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-md px-4 py-3 mb-4">
              <div className="w-8 h-8 bg-gray-300 rounded shrink-0" />
              <div>
                <p className="text-sm font-medium text-secondary-600">{file.name}</p>
                <p className="text-xs text-gray-400">Size: {Math.round(file.size / 1024)}KB</p>
              </div>
            </div>

            {previewUrl && (
              <img src={previewUrl} alt="New logo preview" className="w-56 h-24 object-contain bg-gray-100 rounded-md mb-6" />
            )}
          </>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => file && onApply(file)}
            disabled={!file || isSaving}
            className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors"
          >
            {isSaving ? "Uploading..." : "Apply Logo"}
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="px-6 py-2.5 border border-gray-200 text-secondary-500 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            Choose A Different File
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-200 text-secondary-500 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/png,image/jpg,image/jpeg" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
}

function ConnectPaystackView({
  onConnect,
  onCancel,
  isSaving,
}: {
  onConnect: (data: { publicKey: string; secretKey: string; webhookSecret: string; sandboxMode: boolean }) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [publicKey, setPublicKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [sandboxMode, setSandboxMode] = useState(true);

  return (
    <div>
      <h2 className="text-lg font-semibold text-secondary-600 mb-1 pb-4 border-b border-gray-200">
        Connect Paystack
      </h2>

      <div className="space-y-5 mt-6">
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Public key</label>
          <input
            type="text"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder="pk_test_..."
            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-secondary-600 focus:outline-none focus:border-primary-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Secret key</label>
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="sk_test_..."
            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-secondary-600 focus:outline-none focus:border-primary-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Webhook secret</label>
          <input
            type="password"
            value={webhookSecret}
            onChange={(e) => setWebhookSecret(e.target.value)}
            placeholder="Webhook secret"
            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-secondary-600 focus:outline-none focus:border-primary-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="sandbox-mode"
            checked={sandboxMode}
            onChange={(e) => setSandboxMode(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="sandbox-mode" className="text-sm text-secondary-500">Sandbox mode</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => onConnect({ publicKey, secretKey, webhookSecret, sandboxMode })}
            disabled={isSaving || !publicKey || !secretKey}
            className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors"
          >
            {isSaving ? "Connecting..." : "Connect"}
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-200 text-secondary-500 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function ChangePasswordSection() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const mutation = useChangePassword();

  const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const canSubmit = oldPassword.length > 0 && newPassword.length >= 6 && newPassword === confirmPassword;

  const handleSubmit = () => {
    if (!canSubmit) return;
    mutation.mutate(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      }
    );
  };

  return (
    <section>
      <h2 className="text-base font-semibold text-secondary-600 mb-4 pb-2 border-b border-gray-200">
        Account Security
      </h2>

      <div className="space-y-5 max-w-md">
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Current password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-secondary-600 focus:outline-none focus:border-primary-400 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-secondary-600 focus:outline-none focus:border-primary-400 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Confirm new password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-secondary-600 focus:outline-none focus:border-primary-400 transition-colors"
          />
          {mismatch && <p className="text-xs text-error-500 mt-1.5">Passwords don't match</p>}
        </div>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || mutation.isPending}
          className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
        >
          {mutation.isPending ? "Changing..." : "Change password"}
        </button>
      </div>
    </section>
  );
}

export default function AdminPlatformSettingsPage() {
  const router = useRouter();

  const [view, setView] = useState<View>("main");
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isNewPlan, setIsNewPlan] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#383838");
  const primaryRef = useRef<HTMLInputElement>(null);

  const { data: plans = [], isLoading: plansLoading } = usePlans();
  const createPlanMutation = useCreatePlan();
  const updatePlanMutation = useUpdatePlan();

  const { data: gateways = [] } = useGatewayStatuses();
  const connectPaystackMutation = useConnectPaystack();
  const disconnectPaystackMutation = useDisconnectPaystack();

  const { data: platformSettings } = usePlatformSettings();
  const updatePlatformSettingsMutation = useUpdatePlatformSettings();

  useEffect(() => {
    if (platformSettings?.primaryColor) {
      setPrimaryColor(platformSettings.primaryColor);
    }
  }, [platformSettings?.primaryColor]);

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setIsNewPlan(false);
    setView("edit-plan");
  };

  const handleAddPlan = () => {
    setEditingPlan({ id: 0, name: "", monthlyPrice: 0, yearlyPrice: 0, active: true });
    setIsNewPlan(true);
    setView("edit-plan");
  };

  const handleSavePlan = (data: SavePlanRequest) => {
    if (isNewPlan) {
      createPlanMutation.mutate(data, { onSuccess: () => setView("main") });
    } else if (editingPlan) {
      updatePlanMutation.mutate(
        { id: editingPlan.id, data },
        { onSuccess: () => setView("main") },
      );
    }
  };

  const handleApplyLogo = (file: File) => {
    updatePlatformSettingsMutation.mutate(
      { data: {}, logoFile: file },
      { onSuccess: () => setView("main") },
    );
  };

  const handleSavePrimaryColor = () => {
    updatePlatformSettingsMutation.mutate({ data: { primaryColor }, logoFile: null });
  };

  const handleConnectPaystack = (data: { publicKey: string; secretKey: string; webhookSecret: string; sandboxMode: boolean }) => {
    connectPaystackMutation.mutate(data, { onSuccess: () => setView("main") });
  };

  if (view === "edit-plan" && editingPlan) {
    return (
      <div className="px-4 py-8 lg:pl-16 lg:pr-8 lg:py-12 bg-white min-h-screen">
        <div className="flex items-start gap-3 mb-6 pb-4 border-b border-gray-200">
          <button onClick={() => setView("main")} className="text-secondary-500 hover:text-primary-500 transition-colors mt-1">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-secondary-600">Platform Settings</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage your platform configuration and preferences</p>
          </div>
        </div>
        <EditPlanView
          plan={editingPlan}
          isNew={isNewPlan}
          onSave={handleSavePlan}
          onCancel={() => setView("main")}
          isSaving={createPlanMutation.isPending || updatePlanMutation.isPending}
        />
      </div>
    );
  }

  if (view === "upload-logo") {
    return (
      <div className="px-4 py-8 lg:pl-16 lg:pr-8 lg:py-12 bg-white min-h-screen">
        <div className="flex items-start gap-3 mb-6 pb-4 border-b border-gray-200">
          <button onClick={() => setView("main")} className="text-secondary-500 hover:text-primary-500 transition-colors mt-1">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-secondary-600">Platform Settings</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage your platform configuration and preferences</p>
          </div>
        </div>
        <UploadLogoView
          currentLogoUrl={platformSettings?.logoUrl ?? null}
          onApply={handleApplyLogo}
          onCancel={() => setView("main")}
          isSaving={updatePlatformSettingsMutation.isPending}
        />
      </div>
    );
  }

  if (view === "connect-paystack") {
    return (
      <div className="px-4 py-8 lg:pl-16 lg:pr-8 lg:py-12 bg-white min-h-screen">
        <div className="flex items-start gap-3 mb-6 pb-4 border-b border-gray-200">
          <button onClick={() => setView("main")} className="text-secondary-500 hover:text-primary-500 transition-colors mt-1">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-secondary-600">Platform Settings</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage your platform configuration and preferences</p>
          </div>
        </div>
        <ConnectPaystackView
          onConnect={handleConnectPaystack}
          onCancel={() => setView("main")}
          isSaving={connectPaystackMutation.isPending}
        />
      </div>
    );
  }

  return (
    <div className="px-4 py-8 lg:pl-16 lg:pr-8 lg:py-12 bg-white min-h-screen">

      <div className="flex items-start gap-3 mb-6 pb-4 border-b border-gray-200">
        <button onClick={() => router.back()} className="text-secondary-500 hover:text-primary-500 transition-colors mt-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-secondary-600">Platform Settings</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your platform configuration and preferences</p>
        </div>
      </div>

      <div className="space-y-10">

        <section>
          <h2 className="text-base font-semibold text-secondary-600 mb-4 pb-2 border-b border-gray-200">
            Subscription Management
          </h2>

          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">

            <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200">
              {["Plan name", "Monthly price", "Status", "Actions"].map((h) => (
                <div key={h} className="px-6 py-3 text-sm font-medium text-secondary-500">{h}</div>
              ))}
            </div>

            {plansLoading ? (
              <div className="px-6 py-6 text-sm text-gray-400">Loading plans...</div>
            ) : plans.length === 0 ? (
              <div className="px-6 py-6 text-sm text-gray-400">No subscription plans yet.</div>
            ) : (
              plans.map((plan, i) => (
                <div
                  key={plan.id}
                  className={cn("grid grid-cols-4 items-center", i < plans.length - 1 && "border-b border-gray-200")}
                >
                  <div className="px-6 py-4 text-sm text-secondary-500">{plan.name}</div>
                  <div className="px-6 py-4 text-sm text-secondary-500">{formatNaira(plan.monthlyPrice)}</div>
                  <div className="px-6 py-4 text-sm text-secondary-500">{plan.active ? "Active" : "Inactive"}</div>
                  <div className="px-6 py-4">
                    <button
                      onClick={() => handleEditPlan(plan)}
                      className="px-4 py-1.5 border border-gray-200 text-sm text-secondary-500 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={handleAddPlan}
            className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-md transition-colors"
          >
            Add New Plan
          </button>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-200">
            <h2 className="text-base font-semibold text-secondary-600">Branding Controls</h2>
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold text-secondary-600 mb-3">Platform logo</p>

            {platformSettings?.logoUrl ? (
              <div className="flex items-center gap-4">
                <img src={platformSettings.logoUrl} alt="Platform logo" className="w-44 h-24 object-contain bg-gray-50 rounded-md border border-gray-200" />
                <button
                  onClick={() => setView("upload-logo")}
                  className="px-4 py-2 border border-gray-200 text-sm text-secondary-500 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Change logo
                </button>
              </div>
            ) : (
              <button
                onClick={() => setView("upload-logo")}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg py-12 flex flex-col items-center gap-2 hover:border-primary-300 hover:bg-primary-50/20 transition-colors"
              >
                <div className="w-10 h-10 bg-gray-200 rounded" />
                <p className="text-sm font-medium text-secondary-500">Click to upload logo</p>
                <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
              </button>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-secondary-600 mb-2">Primary colour</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => primaryRef.current?.click()}
                className="w-10 h-10 rounded-md border border-gray-200 shrink-0"
                style={{ backgroundColor: primaryColor }}
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="border border-gray-200 rounded-md px-3 py-2 text-sm text-secondary-500 w-32 focus:outline-none focus:border-primary-400"
              />
              <input ref={primaryRef} type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="hidden" />
              <button
                onClick={handleSavePrimaryColor}
                disabled={updatePlatformSettingsMutation.isPending}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-secondary-600 mb-4 pb-2 border-b border-gray-200">
            Payment Gateway Management
          </h2>

          <div className="space-y-3">
            {gateways.map((gw) => {
              const isPaystack = gw.gateway === "PAYSTACK";
              return (
                <div key={gw.gateway} className="border border-gray-200 rounded-lg px-5 py-4 flex items-center justify-between bg-white">
                  <div>
                    <p className="text-sm font-semibold text-secondary-600 capitalize">{gw.gateway.toLowerCase()}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Status: {gw.connected ? <>Connected <span className="text-green-500">Yes</span></> : "Not Connected"}
                    </p>
                    {!isPaystack && (
                      <p className="text-xs text-gray-400 mt-0.5">Not yet supported for connection.</p>
                    )}
                  </div>

                  {isPaystack ? (
                    gw.connected ? (
                      <button
                        onClick={() => disconnectPaystackMutation.mutate()}
                        disabled={disconnectPaystackMutation.isPending}
                        className="px-4 py-2 border border-gray-200 text-sm text-secondary-500 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        {disconnectPaystackMutation.isPending ? "Disconnecting..." : "Disconnect"}
                      </button>
                    ) : (
                      <button
                        onClick={() => setView("connect-paystack")}
                        className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-md transition-colors"
                      >
                        Connect
                      </button>
                    )
                  ) : (
                    <button
                      disabled
                      className="px-5 py-2 bg-gray-200 text-gray-400 text-sm font-medium rounded-md cursor-not-allowed"
                    >
                      Connect
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <ChangePasswordSection />

      </div>
    </div>
  );
}
