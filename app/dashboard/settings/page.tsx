"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SubscriptionPlan {
  id: number;
  name: string;
  price: string;
  status: "Active" | "Inactive";
  monthlyPrice: string;
  annualPrice: string;
  features: string;
}

type Gateway = { name: string; connected: boolean };
type View = "main" | "edit-plan" | "upload-logo";

const initialPlans: SubscriptionPlan[] = [
  { id: 1, name: "Basic Plan",        price: "$9.99", status: "Active",   monthlyPrice: "9.99",  annualPrice: "99.99",  features: "Unlimited job postings\nUnlimited job postings\nUnlimited job postings\nUnlimited job postings" },
  { id: 2, name: "Professional plan", price: "$9.99", status: "Active",   monthlyPrice: "9.99",  annualPrice: "99.99",  features: "Unlimited job postings\nUnlimited job postings\nUnlimited job postings\nUnlimited job postings" },
  { id: 3, name: "Enterprise plan",   price: "$9.99", status: "Inactive", monthlyPrice: "29.99", annualPrice: "299.99", features: "Unlimited job postings\nUnlimited job postings\nUnlimited job postings\nUnlimited job postings" },
];

const initialGateways: Gateway[] = [
  { name: "Paystack", connected: true  },
  { name: "Stripe",   connected: false },
  { name: "Paypal",   connected: false },
];

function EditPlanView({
  plan,
  isNew,
  onSave,
  onCancel,
}: {
  plan: SubscriptionPlan;
  isNew: boolean;
  onSave: (p: SubscriptionPlan) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(plan);

  const set = (field: keyof SubscriptionPlan, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div>
      <h2 className="text-lg font-semibold text-secondary-600 mb-1 pb-4 border-b border-gray-200">
        {isNew ? "Add subscription plan" : "Edit suscription plan"}
      </h2>

      <div className="space-y-5 mt-6">

        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Plan name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Enter your name"
            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-secondary-600 focus:outline-none focus:border-primary-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Monthly price</label>
          <input
            type="text"
            value={form.monthlyPrice}
            onChange={(e) => set("monthlyPrice", e.target.value)}
            placeholder="Enter your name"
            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-secondary-600 focus:outline-none focus:border-primary-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Annual price</label>
          <input
            type="text"
            value={form.annualPrice}
            onChange={(e) => set("annualPrice", e.target.value)}
            placeholder="Enter your name"
            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-secondary-600 focus:outline-none focus:border-primary-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Features</label>
          <textarea
            value={form.features}
            onChange={(e) => set("features", e.target.value)}
            rows={6}
            className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-secondary-500 focus:outline-none focus:border-primary-400 transition-colors resize-none"
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-secondary-600 mb-3">Status</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => set("status", form.status === "Active" ? "Inactive" : "Active")}
              className={cn(
                "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
                form.status === "Active" ? "bg-green-500" : "bg-gray-300"
              )}
            >
              <span className={cn(
                "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                form.status === "Active" ? "translate-x-6" : "translate-x-1"
              )} />
            </button>
            <span className="text-sm text-secondary-500">{form.status}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => onSave(form)}
            className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-md transition-colors"
          >
            Save Changes
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
  onApply,
  onCancel,
}: {
  onApply: (fileName: string) => void;
  onCancel: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ name: string; size: string; dimensions: string } | null>({
    name: "new-logo.png",
    size: "256KB",
    dimensions: "400×120px",
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile({ name: f.name, size: `${Math.round(f.size / 1024)}KB`, dimensions: "400×120px" });
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-secondary-600 mb-1 pb-4 border-b border-gray-200">
        upload platform logo
      </h2>

      <div className="border border-gray-200 rounded-lg p-6 mt-5 bg-white">

        <p className="text-sm font-medium text-secondary-600 mb-3">Current logo</p>
        <div className="w-44 h-24 bg-gray-300 rounded-md mb-6" />

        {file && (
          <>
            <p className="text-sm font-medium text-secondary-600 mb-3">New logo</p>
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-md px-4 py-3 mb-4">
              <div className="w-8 h-8 bg-gray-300 rounded shrink-0" />
              <div>
                <p className="text-sm font-medium text-secondary-600">{file.name}</p>
                <p className="text-xs text-gray-400">Size: {file.size} | Dimensions: {file.dimensions}</p>
              </div>
            </div>

            <div className="w-56 h-24 bg-gray-100 rounded-md flex items-center justify-center mb-6">
              <p className="text-xs text-gray-400">Preview of logo image</p>
            </div>
          </>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => file && onApply(file.name)}
            disabled={!file}
            className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors"
          >
            Apply Logo
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

export default function AdminPlatformSettingsPage() {
  const router = useRouter();

  const [view, setView]               = useState<View>("main");
  const [plans, setPlans]             = useState(initialPlans);
  const [gateways, setGateways]       = useState(initialGateways);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isNewPlan, setIsNewPlan]     = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#383838");
  const [secondaryColor, setSecondaryColor] = useState("#383838");
  const [logoName, setLogoName]       = useState<string | null>(null);
  const [logoUpdated, setLogoUpdated] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

  const primaryRef   = useRef<HTMLInputElement>(null);
  const secondaryRef = useRef<HTMLInputElement>(null);

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan({ ...plan });
    setIsNewPlan(false);
    setView("edit-plan");
  };

  const handleAddPlan = () => {
    const newPlan: SubscriptionPlan = {
      id: Date.now(),
      name: "",
      price: "$0.00",
      status: "Active",
      monthlyPrice: "",
      annualPrice: "",
      features: "",
    };
    setEditingPlan(newPlan);
    setIsNewPlan(true);
    setView("edit-plan");
  };

  const handleSavePlan = (updated: SubscriptionPlan) => {
    if (isNewPlan) {
      setPlans((prev) => [...prev, { ...updated, price: `$${updated.monthlyPrice}` }]);
    } else {
      setPlans((prev) =>
        prev.map((p) => (p.id === updated.id ? { ...updated, price: `$${updated.monthlyPrice}` } : p))
      );
    }
    setView("main");
    setSuccessBanner(true);
    setTimeout(() => setSuccessBanner(false), 5000);
  };

  const handleApplyLogo = (fileName: string) => {
    setLogoName(fileName);
    setLogoUpdated(true);
    setView("main");
    setSuccessBanner(true);
    setTimeout(() => setSuccessBanner(false), 5000);
  };

  const toggleGateway = (name: string) => {
    setGateways((prev) =>
      prev.map((g) => (g.name === name ? { ...g, connected: !g.connected } : g))
    );
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
        <UploadLogoView onApply={handleApplyLogo} onCancel={() => setView("main")} />
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

      {successBanner && (
        <div className="flex items-center justify-between gap-3 border border-green-300 bg-green-50 rounded-lg px-5 py-4 mb-6">
          <p className="text-sm text-green-700">Settings updated successfully! Your changes have been applied to the platform.</p>
          <button onClick={() => setSuccessBanner(false)} className="text-green-500 hover:text-green-700 transition-colors shrink-0">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="space-y-10">

        <section>
          <h2 className="text-base font-semibold text-secondary-600 mb-4 pb-2 border-b border-gray-200">
            Suscription Management
          </h2>

          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">

            <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200">
              {["Plan name", "Price", "Status", "Actions"].map((h) => (
                <div key={h} className="px-6 py-3 text-sm font-medium text-secondary-500">{h}</div>
              ))}
            </div>

            {plans.map((plan, i) => (
              <div
                key={plan.id}
                className={cn("grid grid-cols-4 items-center", i < plans.length - 1 && "border-b border-gray-200")}
              >
                <div className="px-6 py-4 text-sm text-secondary-500">{plan.name}</div>
                <div className="px-6 py-4 text-sm text-secondary-500">{plan.price}</div>
                <div className="px-6 py-4 text-sm text-secondary-500">{plan.status}</div>
                <div className="px-6 py-4">
                  <button
                    onClick={() => handleEditPlan(plan)}
                    className="px-4 py-1.5 border border-gray-200 text-sm text-secondary-500 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
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
            {logoUpdated && (
              <span className="text-xs font-medium text-green-600">Logo updated</span>
            )}
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold text-secondary-600 mb-3">Platform logo</p>

            {logoName ? (

              <div className="flex items-center gap-4">
                <div className="border border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center gap-2 w-44">
                  <div className="w-8 h-8 bg-gray-300 rounded" />
                  <p className="text-xs text-gray-400">Platform logoo</p>
                </div>
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

          <div className="mb-5">
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
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-secondary-600 mb-2">Secondary colour</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => secondaryRef.current?.click()}
                className="w-10 h-10 rounded-md border border-gray-200 shrink-0"
                style={{ backgroundColor: secondaryColor }}
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="border border-gray-200 rounded-md px-3 py-2 text-sm text-secondary-500 w-32 focus:outline-none focus:border-primary-400"
              />
              <input ref={secondaryRef} type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="hidden" />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-secondary-600 mb-4 pb-2 border-b border-gray-200">
            Payment Gateway Management
          </h2>

          <div className="space-y-3">
            {gateways.map((gw) => (
              <div key={gw.name} className="border border-gray-200 rounded-lg px-5 py-4 flex items-center justify-between bg-white">
                <div>
                  <p className="text-sm font-semibold text-secondary-600">{gw.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Status: {gw.connected ? <>Connected <span className="text-green-500">✅</span></> : "Not Connected"}
                  </p>
                </div>

                {gw.connected ? (
                  <div className="flex gap-2">
                    <button className="px-4 py-2 border border-gray-200 text-sm text-secondary-500 rounded-md hover:bg-gray-50 transition-colors">
                      Configure
                    </button>
                    <button
                      onClick={() => toggleGateway(gw.name)}
                      className="px-4 py-2 border border-gray-200 text-sm text-secondary-500 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => toggleGateway(gw.name)}
                    className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
