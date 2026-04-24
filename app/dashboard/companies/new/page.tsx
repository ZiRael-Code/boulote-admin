"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/button";

import { useOnboardingData } from "@/hooks/use-onboarding";
import { onboardingService } from "@/lib/api/services/onboarding";
import api from "@/lib/api/axios-config";
import toast from "react-hot-toast";

export default function AddCompanyPage() {
    const router = useRouter();

    const { data: onboardingData, isLoading } = useOnboardingData();
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [companyType, setCompanyType] = useState("");
    const [companySize, setCompanySize] = useState("");
    const [selectedPurposeIds, setSelectedPurposeIds] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const companyTypeOptions = useMemo(
        () => onboardingData?.companyDetails?.companyTypes ?? [],
        [onboardingData]
    );

    const companySizeOptions = useMemo(
        () => onboardingData?.companyDetails?.companySizes ?? [],
        [onboardingData]
    );

    const purposes = useMemo(
        () => onboardingData?.purposes ?? [],
        [onboardingData]
    );

    const togglePurpose = (id: number) => {
        setSelectedPurposeIds((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        if (!companyName.trim()) { toast.error("Company name is required"); return; }
        if (!email.trim()) { toast.error("Email is required"); return; }
        if (!companyType) { toast.error("Company type is required"); return; }
        if (!companySize) { toast.error("Company size is required"); return; }

        setIsSubmitting(true);
        try {
            await onboardingService.adminCreateCompany({
                companyName: companyName.trim(),
                email: email.trim(),
                companyType,
                companySize,
                purposeIds: selectedPurposeIds,
            });
            toast.success("Company created. Default password: Boulote@2025");
            router.push("/dashboard/companies");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to create company");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 px-8 py-8">

            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center w-10 h-10 border border-neutral-300 rounded-md hover:border-neutral-400 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-secondary-500" />
                </button>
                <div className="flex flex-col gap-1">
                    <h1 className="text-[32px] font-semibold tracking-[1px] text-secondary-500">
                        Add New Company
                    </h1>
                    <p className="text-base font-normal text-secondary-500">
                        Create a company account. A default password will be assigned.
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="bg-white border border-border-500 rounded-lg p-8 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">


                    <div className="flex flex-col gap-6">


                        <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-6">
                            <h2 className="text-lg font-semibold text-secondary-500">
                                Company Information
                            </h2>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-secondary-500">
                                    Company Name <span className="text-error-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="Enter company name"
                                    className="w-full h-12 px-4 border border-neutral-300 rounded-md text-sm text-secondary-500 placeholder-neutral-400 focus:outline-none focus:border-primary-400 transition-colors"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-secondary-500">
                                    Email Address <span className="text-error-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter company email"
                                    className="w-full h-12 px-4 border border-neutral-300 rounded-md text-sm text-secondary-500 placeholder-neutral-400 focus:outline-none focus:border-primary-400 transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-secondary-500">
                                        Company Type <span className="text-error-500">*</span>
                                    </label>
                                    <select
                                        value={companyType}
                                        onChange={(e) => setCompanyType(e.target.value)}
                                        className="w-full h-12 px-4 border border-neutral-300 rounded-md text-sm text-secondary-500 bg-white focus:outline-none focus:border-primary-400 transition-colors"
                                    >
                                        <option value="">Select company type</option>
                                        {companyTypeOptions.map((type) => (
                                            <option key={type.id} value={type.name}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-secondary-500">
                                        Company Size <span className="text-error-500">*</span>
                                    </label>
                                    <select
                                        value={companySize}
                                        onChange={(e) => setCompanySize(e.target.value)}
                                        className="w-full h-12 px-4 border border-neutral-300 rounded-md text-sm text-secondary-500 bg-white focus:outline-none focus:border-primary-400 transition-colors"
                                    >
                                        <option value="">Select company size</option>
                                        {companySizeOptions.map((size) => (
                                            <option
                                                key={size.id}
                                                value={`${size.employeesFrom}-${size.employeesTo} employees`}
                                            >
                                                {size.employeesFrom}-{size.employeesTo} employees
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>


                        {purposes.length > 0 && (
                            <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-secondary-500">
                                        Hiring Purposes
                                    </h2>
                                    <p className="text-sm text-neutral-500 mt-1">
                                        Optional — select the company's hiring intent
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {purposes.map((purpose) => {
                                        const selected = selectedPurposeIds.includes(purpose.id);
                                        return (
                                            <button
                                                key={purpose.id}
                                                type="button"
                                                onClick={() => togglePurpose(purpose.id)}
                                                className={`flex flex-col gap-1 p-4 border rounded-lg text-left transition-all ${
                                                    selected
                                                        ? "border-primary-500 bg-primary-50"
                                                        : "border-neutral-300 hover:border-neutral-400"
                                                }`}
                                            >
                                                <p className={`text-sm font-medium ${selected ? "text-primary-600" : "text-secondary-500"}`}>
                                                    {purpose.name}
                                                </p>
                                                {purpose.description && (
                                                    <p className="text-xs text-neutral-500">{purpose.description}</p>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-4">
                            <h2 className="text-lg font-semibold text-secondary-500">
                                Default Credentials
                            </h2>
                            <div className="bg-neutral-50 border border-neutral-200 rounded-md p-4 flex flex-col gap-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500">Email</span>
                                    <span className="text-secondary-500 font-medium">
                    {email || "—"}
                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500">Password</span>
                                    <span className="text-secondary-500 font-medium">
                    Boulote@2025
                  </span>
                                </div>
                            </div>
                            <p className="text-xs text-neutral-400">
                                The company will be prompted to change their password on first login.
                            </p>
                        </div>

                        <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-3">
                            <h2 className="text-lg font-semibold text-secondary-500">Summary</h2>
                            <div className="flex flex-col gap-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Company</span>
                                    <span className="text-secondary-500 font-medium">{companyName || "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Type</span>
                                    <span className="text-secondary-500 font-medium">{companyType || "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Size</span>
                                    <span className="text-secondary-500 font-medium">{companySize || "—"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">Purposes</span>
                                    <span className="text-secondary-500 font-medium">{selectedPurposeIds.length} selected</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                variant="primary"
                                onClick={handleSubmit}
                                loading={isSubmitting}
                                className="w-full h-12"
                            >
                                Create Company
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.back()}
                                className="w-full h-12"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


