"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Search, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import {
  useAIReviewJobs,
  useAIShortlistingResults,
  useAssignSelectedProfessional,
  useRejectAllAndManuallySelect,
} from "@/hooks/use-jobs";
import type { Job } from "@/lib/types/job";
import { pluralize } from "@/lib/utils/string-helpers";
import { ProfessionalCard } from "./professional-card";

export function AIReviewTab({ enabled = true }: { enabled?: boolean }) {
  const queryClient = useQueryClient();
  const { data: pendingJobs, isLoading, error } = useAIReviewJobs(enabled);

  if (isLoading) {
    return <LoadingSpinner message="Loading AI review jobs..." className="py-12" />;
  }

  if (error) {
    return <ErrorState title="Failed to load jobs" className="py-12" />;
  }

  if (!pendingJobs || !pendingJobs.content || pendingJobs.content.length === 0) {
    return <EmptyState message="No jobs found" className="py-12" />;
  }

  return (
      <div className="flex flex-col gap-8">
        <div className="flex gap-4 items-center">
          <button className="border border-neutral-500 rounded-md px-4 py-2 flex gap-4 items-center">
          <span className="text-base font-normal text-neutral-500">
            All Jobs
          </span>
            <ChevronDown className="w-8 h-8" />
          </button>

          <div className="border border-neutral-500 rounded-md h-12 px-6 py-4 flex items-center justify-between flex-1 max-w-md">
            <span className="text-lg font-light text-secondary-500">Search</span>
            <Search className="w-6 h-6" />
          </div>

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
        </div>

        <div className="flex flex-col gap-6">
          {pendingJobs.content.map((job) => (
              <AIReviewJobCard key={job.id} job={job} enabled={enabled} />
          ))}
        </div>
      </div>
  );
}

function AIReviewJobCard({ job, enabled = true }: { job: Job; enabled?: boolean }) {
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<number | null>(null);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const projectId = job.id;
  const { data: results, isLoading: isLoadingResults, error: resultsError } = useAIShortlistingResults(
      projectId,
      enabled
  );
  const assignMutation = useAssignSelectedProfessional();
  const rejectMutation = useRejectAllAndManuallySelect();

  const professionals = results?.professionals || [];
  const totalCandidates = results?.candidatesFound || 0;

  const handleAssign = () => {
    if (!selectedProfessionalId) {
      toast.error("Please select a professional to assign");
      return;
    }
    assignMutation.mutate({
      projectId,
      professionalId: selectedProfessionalId,
      assignmentNotes: "BY SYSTEM",
    });
  };

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

  if (isLoadingResults) {
    return (
        <div className="border border-border-500 rounded-md p-6 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );
  }

  if (!results || resultsError) {
    return null;
  }

  return (
      <div className="flex flex-col gap-6">
        <div className="border border-border-500 rounded-md p-6 flex flex-col gap-4">
          <div className="flex gap-4 items-start justify-between">
            <div className="flex flex-col gap-2 flex-1">
              <h3 className="text-xl font-medium text-secondary-500">
                {job.title}
              </h3>
              <div className="flex flex-col gap-4">
                <p className="text-base font-normal text-secondary-500">
                  {job.companyName}
                </p>
                <p className="text-xs font-normal text-neutral-500">
                  ID: {job.jobId}
                </p>
              </div>
            </div>
            <div className="bg-success-50 px-2 py-2 rounded-[15px]">
            <span className="text-sm font-normal text-success-800">
              Ready for review
            </span>
            </div>
          </div>

          <div className="flex gap-20">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-normal text-neutral-500">BUDGET</p>
              <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                {job.budget}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-normal text-neutral-500">DURATION</p>
              <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                {job.duration}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-normal text-neutral-500">
                CANDIDATES FOUND
              </p>
              <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                {totalCandidates} {pluralize(totalCandidates, "Professional")}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-normal text-neutral-500">URGENCY</p>
              <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                {job.urgency}
              </p>
            </div>
          </div>

          <div className="flex gap-4 self-end">
            <Button className="bg-primary-500 text-white px-7 py-3">
              View Details
            </Button>
          </div>
        </div>

        {professionals.length > 0 ? (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium text-secondary-500">
                  AI Shortlisted Professionals
                  <span className="ml-3 bg-primary-200 px-3 py-1 rounded-full text-sm">
                AI Selected
              </span>
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
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
                    yearsExperience: 0,
                    projectsCompleted: 0,
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
                            onSelect={() =>
                                setSelectedProfessionalId(
                                    isSelected ? null : professionalId
                                )
                            }
                        />
                      </div>
                  );
                })}
              </div>

              <div className="flex gap-4 justify-end">
                <Button
                    className="bg-primary-500 text-white px-7 py-3"
                    onClick={handleAssign}
                    loading={assignMutation.isPending}
                    disabled={!selectedProfessionalId || assignMutation.isPending || rejectMutation.isPending}
                >
                  Assign selected professional
                </Button>
                <Button
                    variant="outline"
                    className="border border-neutral-500 px-7 py-3"
                    onClick={handleRejectAll}
                    loading={rejectMutation.isPending}
                    disabled={assignMutation.isPending || rejectMutation.isPending}
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