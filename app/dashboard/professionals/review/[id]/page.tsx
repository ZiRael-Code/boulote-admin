"use client";

import { useParams, useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import Button from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorState } from "@/components/ui/error-state";
import { BackButton } from "@/components/ui/back-button";
import {
  usePendingApprovals,
  useApproveProfessional,
  useRejectProfessional,
} from "@/hooks/use-professionals";
import { formatDate } from "@/lib/utils/format-date";
import { pluralize } from "@/lib/utils/string-helpers";

export default function ApplicationReviewPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const { data, isLoading, error } = usePendingApprovals();
  const approveMutation = useApproveProfessional();
  const rejectMutation = useRejectProfessional();

  const approval = data?.pendingApprovals?.find((p) => p.id === id);

  const handleApprove = () => {
    approveMutation.mutate(id, {
      onSuccess: () => router.push("/dashboard/professionals/pending"),
    });
  };

  const handleReject = () => {
    rejectMutation.mutate(id, {
      onSuccess: () => router.push("/dashboard/professionals/pending"),
    });
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading application..." className="py-32" />;
  }

  if (error || !approval) {
    return <ErrorState title="Failed to load application" className="py-32" />;
  }

  return (
      <div className="flex flex-col gap-8 px-8 py-8 max-w-7xl">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-2xl font-semibold text-secondary-500">Application Review</h1>
        </div>

        <div className="bg-[#FCFDCA8F] border border-[#FFD46982] rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">Pending Review</p>
            <p className="text-sm text-neutral-500 mt-4">
              Applied on {formatDate(approval.appliedDate)} — Waiting {approval.waitingDays} {pluralize(approval.waitingDays, "day")}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
                className="bg-success-500 text-white px-6 py-2 h-auto"
                onClick={handleApprove}
                loading={approveMutation.isPending}
                disabled={approveMutation.isPending || rejectMutation.isPending}
            >
              <span className="text-sm font-medium">Approve</span>
            </Button>
            <Button
                className="bg-error-500 text-white px-6 py-2 h-auto"
                onClick={handleReject}
                loading={rejectMutation.isPending}
                disabled={approveMutation.isPending || rejectMutation.isPending}
            >
              <span className="text-sm font-medium">Reject</span>
            </Button>
          </div>
        </div>

        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-[#C7D7E8] flex items-center justify-center shrink-0">
            <span className="text-2xl font-medium text-secondary-500">{approval.initials}</span>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-secondary-500">{approval.name}</h2>
            <p className="text-base text-secondary-500">{approval.experience}</p>
          </div>
        </div>

        <div className="bg-white border border-border-500 rounded-lg p-6 flex flex-col gap-6">
          <h3 className="text-lg font-semibold text-secondary-500">Review Checklist</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" readOnly checked={!!approval.name} />
              <span className="text-sm text-secondary-500">Professional Information Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" readOnly checked={approval.hasResume} />
              <span className="text-sm text-secondary-500">Resume Uploaded</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" readOnly checked={approval.hasPortfolio} />
              <span className="text-sm text-secondary-500">Portfolio/work samples</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" readOnly checked={approval.skills?.length > 0} />
              <span className="text-sm text-secondary-500">Skills & Expertise listed</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 text-sm">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-neutral-500 uppercase">FULL NAME</p>
            <p className="text-sm text-secondary-500">{approval.name}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-neutral-500 uppercase">EMAIL</p>
            <p className="text-sm text-secondary-500">{approval.email}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-neutral-500 uppercase">EXPERIENCE LEVEL</p>
            <p className="text-sm text-secondary-500">{approval.experience}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-neutral-500 uppercase">WAITING</p>
            <p className="text-sm text-secondary-500">{approval.waitingDays} {pluralize(approval.waitingDays, "day")}</p>
          </div>
        </div>

        {approval.skills?.length > 0 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-secondary-500">Primary Skills</h3>
              <div className="flex flex-wrap gap-3">
                {approval.skills.map((skill) => (
                    <span key={skill} className="px-4 py-2 bg-primary-50 rounded-full text-sm text-secondary-500">
                {skill}
              </span>
                ))}
              </div>
            </div>
        )}

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-secondary-500">Uploaded Documents</h3>
          <div className="flex flex-col gap-3">
            {approval.hasResume && (
                <div className="border border-border-500 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-10 h-10 text-neutral-500" />
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-secondary-500">Resume</p>
                      <p className="text-xs text-neutral-500">Uploaded</p>
                    </div>
                  </div>
                </div>
            )}
            {approval.hasPortfolio && (
                <div className="border border-border-500 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-10 h-10 text-neutral-500" />
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-secondary-500">Portfolio & Projects</p>
                      <p className="text-xs text-neutral-500">Uploaded</p>
                    </div>
                  </div>
                </div>
            )}
            {!approval.hasResume && !approval.hasPortfolio && (
                <p className="text-sm text-neutral-500">No documents uploaded</p>
            )}
          </div>
        </div>

        <div className="bg-border-500 border border-neutral-500 rounded-lg p-4 flex flex-col gap-2">
          <p className="text-sm font-semibold text-warning-800">Ready to make a decision?</p>
          <p className="text-sm text-warning-700">
            Review all information above before approving or rejecting this application.
          </p>
        </div>

        <div className="flex gap-4 justify-end">
          <Button
              className="bg-success-500 text-white px-8 py-3"
              onClick={handleApprove}
              loading={approveMutation.isPending}
              disabled={approveMutation.isPending || rejectMutation.isPending}
          >
            <span className="text-base font-medium">Approve</span>
          </Button>
          <Button
              className="bg-error-500 text-white px-8 py-3"
              onClick={handleReject}
              loading={rejectMutation.isPending}
              disabled={approveMutation.isPending || rejectMutation.isPending}
          >
            <span className="text-base font-medium">Reject</span>
          </Button>
        </div>
      </div>
  );
}