"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import Button from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Avatar } from "@/components/ui/avatar";
import { BackButton } from "@/components/ui/back-button";
import { AlertBanner } from "@/components/ui/alert-banner";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  usePendingCompanyApprovals,
  useApproveCompany,
  useRejectCompany,
} from "@/hooks/use-companies";
import { formatRelativeTime } from "@/lib/utils/format-date";

export default function PendingCompanyApprovalsPage() {
  const router = useRouter();
  const { data, isLoading } = usePendingCompanyApprovals();
  const approveMutation = useApproveCompany();
  const rejectMutation = useRejectCompany();

  const pendingCompanies = Array.isArray(data) ? data : [];
  const hasPending = pendingCompanies.length > 0;

  const handleApprove = (id: number) => {
    approveMutation.mutate(id);
  };

  const handleReject = (id: number) => {
    if (confirm("Are you sure you want to reject this company?")) {
      rejectMutation.mutate({ companyId: id });
    }
  };

  if (!isLoading && !hasPending) {
    return (
      <div className="flex flex-col gap-8 px-8 py-8">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-2xl font-semibold text-secondary-500">
            Pending company Approval
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-3xl">🏢</span>
          </div>
          <h2 className="text-2xl font-semibold text-secondary-500">
            All Caught Up!
          </h2>
          <p className="text-base text-neutral-500 text-center max-w-md">
            Great work! There are no pending company applications to review right
            now. New applications will appear here when submitted.
          </p>
          <div className="flex gap-4">
            <Button
              className="bg-primary-500 text-white px-6 py-3"
              onClick={() => router.push("/dashboard/companies")}
            >
              <span className="text-base font-medium">View All Companies</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 px-8 py-8">
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-semibold text-secondary-500">
          Pending company Approval
        </h1>
      </div>

      <p className="text-base font-normal text-secondary-500">
        Manage job requests, AI shortlisting, and professional assignments
      </p>

      {pendingCompanies.length > 0 && (
        <AlertBanner
          title={`${pendingCompanies.length} Companies are waiting for approval. Average review time: 2-3 days.`}
        />
      )}

      <div className="flex gap-4 items-center">
        <button className="border border-neutral-500 rounded-md px-4 py-2 flex gap-4 items-center">
          <span className="text-base font-normal text-neutral-500">
            Date Submitted
          </span>
          <ChevronDown className="w-5 h-5" />
        </button>

        <button className="border border-neutral-500 rounded-md px-4 py-2 flex gap-4 items-center">
          <span className="text-base font-normal text-neutral-500">
            All Priority
          </span>
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white border border-border-500 rounded-lg p-6">
          <LoadingSpinner message="Loading pending approvals..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingCompanies.map((company) => (
            <PendingCompanyCard
              key={company.id}
              company={company}
              onReview={() =>
                router.push(`/dashboard/companies/review/${company.id}`)
              }
              onApprove={() => handleApprove(company.id)}
              onReject={() => handleReject(company.id)}
              isApproving={approveMutation.isPending}
              isRejecting={rejectMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PendingCompanyCard({
  company,
  onReview,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: {
  company: any;
  onReview: () => void;
  onApprove: () => void;
  onReject: () => void;
  isApproving: boolean;
  isRejecting: boolean;
}) {
  return (
    <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar initials={company.initials} size="lg" />
          <div className="flex flex-col">
            <h3 className="text-base font-semibold text-secondary-500">
              {company.name}
            </h3>
            <p className="text-xs text-neutral-500">
              Submitted {formatRelativeTime(company.submittedDate)}
            </p>
          </div>
        </div>
        <StatusBadge status="Pending" label="PENDING" />
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-500">Industry:</span>
          <span className="text-secondary-500 font-medium">
            {company.industry}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">Company Size:</span>
          <span className="text-secondary-500 font-medium">
            {company.size}
            {company.size === "Small"
              ? " (<50 employees)"
              : company.size === "Medium"
                ? " (50-200 employees)"
                : " (200+ employees)"}
          </span>
        </div>
        {company.requestedPlan && (
          <div className="flex justify-between">
            <span className="text-neutral-500">Requested Plan:</span>
            <span className="text-secondary-500 font-medium">
              {company.requestedPlan}
            </span>
          </div>
        )}
        {company.documents && company.documents.length > 0 && (
          <div className="flex flex-col gap-1">
            <span className="text-neutral-500">Documents:</span>
            <span className="text-secondary-500 text-xs">
              {company.documents.join(", ")}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          className="flex-1 bg-primary-500 text-white px-4 py-2 h-10"
          onClick={onReview}
        >
          <span className="text-sm font-medium">Review</span>
        </Button>
        <Button
          className="flex-1 bg-success-500 text-white px-4 py-2 h-10"
          onClick={onApprove}
          loading={isApproving}
          disabled={isApproving || isRejecting}
        >
          <span className="text-sm font-medium">Approve</span>
        </Button>
        <Button
          className="flex-1 bg-error-500 text-white px-4 py-2 h-10"
          onClick={onReject}
          loading={isRejecting}
          disabled={isApproving || isRejecting}
        >
          <span className="text-sm font-medium">Reject</span>
        </Button>
      </div>
    </div>
  );
}
