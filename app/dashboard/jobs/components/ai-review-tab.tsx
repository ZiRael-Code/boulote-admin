"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronRight } from "lucide-react";
import Button from "@/components/ui/button";
import SearchInput from "@/components/ui/input/search-input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Pagination } from "@/components/ui/pagination";
import {
  useAIReviewJobs,
  useAIShortlistingStatus,
  useAIShortlistingResults,
  useBulkAssignSelectedProfessionals,
  useRejectAllAndManuallySelect,
} from "@/hooks/use-jobs";
import type { Job } from "@/lib/types/job";
import { pluralize } from "@/lib/utils/string-helpers";
import { ProfessionalCard } from "./professional-card";

export function AIReviewTab({ enabled = true }: { enabled?: boolean }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const { data: pendingJobs, isLoading, error } = useAIReviewJobs(enabled, { search, page });
  const [selections, setSelections] = useState<Record<number, number>>({});
  const bulkAssignMutation = useBulkAssignSelectedProfessionals();

  const selectionCount = Object.keys(selections).length;

  const setSelectionForJob = (jobId: number, professionalId: number | null) => {
    setSelections((prev) => {
      const next = { ...prev };
      if (professionalId === null) {
        delete next[jobId];
      } else {
        next[jobId] = professionalId;
      }
      return next;
    });
  };

  const handleBulkAssign = () => {
    const assignments = Object.entries(selections).map(([projectId, professionalId]) => ({
      projectId: Number(projectId),
      professionalId,
      assignmentNotes: "BY SYSTEM",
    }));
    if (assignments.length === 0) return;
    bulkAssignMutation.mutate(assignments, {
      onSuccess: () => setSelections({}),
    });
  };

  return (
      <div className="flex flex-col gap-8">
        <div className="flex gap-4 items-center flex-wrap">
          <button className="border border-neutral-500 rounded-md px-4 py-2 flex gap-4 items-center">
          <span className="text-base font-normal text-neutral-500">
            All Jobs
          </span>
            <ChevronDown className="w-8 h-8" />
          </button>

          <SearchInput
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="flex-1 max-w-md"
          />

          <Button
              variant="outline"
              className="border border-neutral-500 px-7 py-3"
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["ai-shortlisting"] });
                queryClient.invalidateQueries({ queryKey: ["jobs"] });
              }}
          >
            Refresh status
          </Button>

          <Button
              className="bg-primary-500 text-white px-7 py-3 ml-auto"
              onClick={handleBulkAssign}
              loading={bulkAssignMutation.isPending}
              disabled={selectionCount === 0 || bulkAssignMutation.isPending}
          >
            Assign selected ({selectionCount})
          </Button>
        </div>

        {isLoading ? (
            <LoadingSpinner message="Loading AI review jobs..." className="py-12" />
        ) : error ? (
            <ErrorState title="Failed to load jobs" className="py-12" />
        ) : !pendingJobs?.content?.length ? (
            <EmptyState message="No jobs found" className="py-12" />
        ) : (
            <div className="flex flex-col gap-4">
              {pendingJobs.content.map((job) => (
                  <AIReviewJobCard
                      key={job.id}
                      job={job}
                      enabled={enabled}
                      selectedProfessionalId={selections[job.id] ?? null}
                      onSelectProfessional={(profId) => setSelectionForJob(job.id, profId)}
                  />
              ))}
              {pendingJobs.totalPages > 1 && (
                  <Pagination
                      currentPage={page + 1}
                      totalPages={pendingJobs.totalPages}
                      totalItems={pendingJobs.totalElements}
                      shownItems={pendingJobs.numberOfElements}
                      itemLabel="jobs"
                      onPageChange={(p) => setPage(p - 1)}
                  />
              )}
            </div>
        )}
      </div>
  );
}

function AIReviewJobCard({
  job,
  enabled = true,
  selectedProfessionalId,
  onSelectProfessional,
}: {
  job: Job;
  enabled?: boolean;
  selectedProfessionalId: number | null;
  onSelectProfessional: (professionalId: number | null) => void;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const projectId = job.id;
  const { data: status } = useAIShortlistingStatus(projectId, enabled, 3000);
  const isCompleted = status?.status === "completed";
  const isFailed = status?.status === "failed";
  const isNoMatches = status?.status === "no_matches";
  const { data: results, isLoading: isLoadingResults, error: resultsError } = useAIShortlistingResults(
      projectId,
      enabled && isCompleted && expanded
  );
  const rejectMutation = useRejectAllAndManuallySelect();

  const professionals = results?.professionals || [];
  const totalCandidates = results?.candidatesFound ?? (isCompleted ? undefined : 0);

  const handleRejectAll = () => {
    setShowRejectConfirm(true);
  };

  const confirmRejectAll = () => {
    rejectMutation.mutate(
        {
          projectId,
          rejectionReason: "AI suggestions did not meet project requirements",
          alternativePlan: "Manual selection",
        },
        { onSettled: () => setShowRejectConfirm(false) }
    );
  };

  const statusBadge = !isCompleted && !isFailed && !isNoMatches
      ? { label: "Processing…", className: "bg-neutral-200 text-neutral-600" }
      : isFailed
      ? { label: "Failed", className: "bg-error-50 text-error-800" }
      : isNoMatches
      ? { label: "No matches", className: "bg-neutral-200 text-neutral-600" }
      : { label: "Ready for review", className: "bg-success-50 text-success-800" };

  return (
      <div className="border border-border-500 rounded-md overflow-hidden">
        <button
            type="button"
            className="w-full flex items-center justify-between gap-4 p-6 text-left"
            onClick={() => setExpanded((v) => !v)}
        >
          <div className="flex items-center gap-3">
            {expanded ? (
                <ChevronDown className="w-5 h-5 shrink-0 text-neutral-500" />
            ) : (
                <ChevronRight className="w-5 h-5 shrink-0 text-neutral-500" />
            )}
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-medium text-secondary-500">{job.title}</h3>
              <p className="text-sm font-normal text-neutral-500">
                {job.companyName} • ID: {job.jobId}
                {totalCandidates !== undefined
                    ? ` • ${totalCandidates} ${pluralize(totalCandidates, "candidate")}`
                    : ""}
              </p>
            </div>
          </div>
          <span className={`px-2 py-2 rounded-[15px] text-sm font-normal shrink-0 ${statusBadge.className}`}>
            {statusBadge.label}
          </span>
        </button>

        {expanded && (
            <div className="flex flex-col gap-6 p-6 pt-0 border-t border-border-500">
              {!isCompleted && !isFailed && !isNoMatches ? (
                  <div className="flex flex-col gap-2 items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-neutral-500">AI shortlisting in progress…</p>
                  </div>
              ) : isFailed ? (
                  <p className="text-sm text-error-600">
                    AI shortlisting failed{status?.errorMessage ? `: ${status.errorMessage}` : "."} Start AI shortlisting again from the Pending tab.
                  </p>
              ) : isNoMatches ? (
                  <p className="text-sm text-neutral-500">
                    No professionals on the platform have any overlap with this job&apos;s required skills.
                  </p>
              ) : isLoadingResults ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  </div>
              ) : !results || resultsError ? (
                  <p className="text-sm text-neutral-500">Could not load shortlisting results. Try refreshing.</p>
              ) : (
                  <>
                    <div className="flex gap-20 flex-wrap">
                      <div className="flex flex-col gap-2">
                        <p className="text-xs font-normal text-neutral-500">BUDGET</p>
                        <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">{job.budget}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-xs font-normal text-neutral-500">DURATION</p>
                        <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">{job.duration}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-xs font-normal text-neutral-500">URGENCY</p>
                        <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">{job.urgency}</p>
                      </div>
                    </div>

                    <div className="flex gap-4 self-end">
                      <Button
                          className="bg-primary-500 text-white px-7 py-3"
                          onClick={() => router.push(`/dashboard/jobs/${job.id}`)}
                      >
                        View Details
                      </Button>
                    </div>

                    {professionals.length > 0 ? (
                        <div className="flex flex-col gap-6">
                          <h3 className="text-xl font-medium text-secondary-500">
                            AI Shortlisted Professionals
                            <span className="ml-3 bg-primary-200 px-3 py-1 rounded-full text-sm">
                              AI Selected
                            </span>
                          </h3>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {professionals.map((shortlisted, index) => {
                              const professional = shortlisted.professional;
                              const professionalId = professional.id;
                              const isSelected = selectedProfessionalId === professionalId;

                              const professionalData = {
                                initials: `${professional.firstName?.[0] || ""}${professional.lastName?.[0] || ""}`.toUpperCase(),
                                name: `${professional.firstName} ${professional.lastName}`,
                                role: professional.profession || "Professional",
                                reviewCount: professional.totalRatings || 0,
                                successRate: professional.successRate || 0,
                                yearsExperience: shortlisted.yearsExperience || 0,
                                projectsCompleted: shortlisted.projectsCompleted || 0,
                                aiMatch: `${shortlisted.matchScore}%`,
                                skills: shortlisted.matchedSkills || [],
                              };

                              return (
                                  <div key={professionalId || index}>
                                    <ProfessionalCard
                                        professional={professionalData}
                                        matchScore={{
                                          matchScore: shortlisted.matchScore,
                                          reasoning: `Match Level: ${shortlisted.matchLevel}`,
                                        }}
                                        isSelected={isSelected}
                                        selectionGroupName={`job-${job.id}-professional`}
                                        onSelect={() =>
                                            onSelectProfessional(isSelected ? null : professionalId)
                                        }
                                    />
                                  </div>
                              );
                            })}
                          </div>

                          <div className="flex gap-4 justify-end">
                            <Button
                                variant="outline"
                                className="border border-neutral-500 px-7 py-3"
                                onClick={handleRejectAll}
                                loading={rejectMutation.isPending}
                                disabled={rejectMutation.isPending}
                            >
                              Reject all and manually select
                            </Button>
                          </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-border-500 rounded-lg p-6">
                          <p className="text-neutral-500 text-center">
                            No shortlisted professionals found
                          </p>
                        </div>
                    )}
                  </>
              )}
            </div>
        )}

        {showRejectConfirm && (
            <ConfirmModal
                title="Reject All Suggestions"
                message="Are you sure you want to reject all AI suggestions and manually select a professional?"
                confirmLabel="Reject All"
                onConfirm={confirmRejectAll}
                onCancel={() => setShowRejectConfirm(false)}
                isLoading={rejectMutation.isPending}
            />
        )}
      </div>
  );
}
