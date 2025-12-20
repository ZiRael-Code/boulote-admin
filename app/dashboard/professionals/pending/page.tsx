"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";
import Button from "@/components/ui/button";
import {
  usePendingApprovals,
  useApproveProfessional,
} from "@/hooks/use-professionals";
import { formatDate } from "@/lib/utils/format-date";

export default function PendingApprovalsPage() {
  const router = useRouter();
  const { data, isLoading } = usePendingApprovals();
  const approveMutation = useApproveProfessional();
  const [dismissedBanner, setDismissedBanner] = useState(false);

  const pendingApprovals = data?.pendingApprovals || [];
  const hasPending = pendingApprovals.length > 0;

  const handleApprove = (id: number) => {
    approveMutation.mutate(id);
  };

  if (!isLoading && !hasPending) {
    return (
      <div className="flex flex-col gap-8 px-8 py-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100 rounded-md"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold text-secondary-500">
            Pending Professionals Approvals
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-3xl">👥</span>
          </div>
          <h2 className="text-2xl font-semibold text-secondary-500">All Caught Up!</h2>
          <p className="text-base text-neutral-500 text-center max-w-md">
            Great work! There are no pending professional applications to review right now. New applications will appear here when submitted.
          </p>
          <div className="flex gap-4">
            <Button className="bg-primary-500 text-white px-6 py-3">
              <span className="text-base font-medium">View All Professionals</span>
            </Button>
            <Button variant="outline" className="border border-neutral-500 px-6 py-3">
              <span className="text-base font-medium">Invite Professionals</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 px-8 py-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100 rounded-md"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-semibold text-secondary-500">
          Pending Professionals Approvals
        </h1>
      </div>

      {!dismissedBanner && pendingApprovals.length > 0 && (
        <div className="bg-warning-50 border border-[#FFB636] rounded-lg p-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-warning-800">
              {pendingApprovals.length} professional{pendingApprovals.length !== 1 ? "s" : ""} waiting for approval
            </p>
            <p className="text-sm text-warning-700">
              Review and approve pending professional applications.
            </p>
          </div>
          <button
            onClick={() => setDismissedBanner(true)}
            className="w-6 h-6 flex items-center justify-center text-warning-700 hover:text-warning-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="bg-white border border-border-500 rounded-lg p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-neutral-500">Loading pending approvals...</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-border-500 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">
                  Professional
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">
                  Skills
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">
                  Experience
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">
                  Documents
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">
                  Applied
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">
                  Waiting
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-secondary-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-500">
              {pendingApprovals.map((approval) => (
                <tr key={approval.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                        <span className="text-sm font-medium text-secondary-500">
                          {approval.initials}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-secondary-500">
                          {approval.name}
                        </p>
                        <p className="text-xs text-neutral-500">{approval.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {approval.skills.slice(0, 3).map((skill, index) => (
                        <p key={index} className="text-sm text-secondary-500">
                          {skill}
                        </p>
                      ))}
                      {approval.skills.length > 3 && (
                        <p className="text-xs text-neutral-500">
                          +{approval.skills.length - 3} more
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-secondary-500">
                      {approval.experience}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-sm">
                      {approval.hasResume && (
                        <span className="text-success-600">✓ Resume</span>
                      )}
                      {approval.hasPortfolio && (
                        <span className="text-success-600">✓ Portfolio</span>
                      )}
                      {!approval.hasResume && !approval.hasPortfolio && (
                        <span className="text-neutral-500">No documents</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-secondary-500">
                      {formatDate(approval.appliedDate)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-secondary-500">
                      {approval.waitingDays} day{approval.waitingDays !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        className="h-10 px-6 bg-primary-500 text-white"
                        onClick={() => handleApprove(approval.id)}
                        loading={approveMutation.isPending}
                        disabled={approveMutation.isPending}
                      >
                        <span className="text-sm font-medium">Approve</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-10 px-6 border border-neutral-500"
                        onClick={() =>
                          router.push(`/dashboard/professionals/review/${approval.id}`)
                        }
                      >
                        <span className="text-sm font-medium">Review</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


