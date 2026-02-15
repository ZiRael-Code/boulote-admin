"use client";

import { useState } from "react";
import { Search, ChevronDown, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import Button from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import {
  usePendingJobs,
  useStartAIShortlisting,
  useAIShortlistingStatus,
  useAIShortlistingResults,
} from "@/hooks/use-jobs";
import type { Job, ShortlistingResult } from "@/lib/types/job";
import { formatRelativeTime } from "@/lib/utils/format-date";
import { ShortlistingResultsModal } from "./shortlisting-modal";

export function PendingRequestsTab() {
  const { data, isLoading, error } = usePendingJobs(true);

  if (isLoading) {
    return <LoadingSpinner message="Loading pending jobs..." className="py-12" />;
  }

  if (error) {
    return <ErrorState title="Failed to load pending jobs" className="py-12" />;
  }

  if (!data || data.empty) {
    return <EmptyState message="No pending jobs found" className="py-12" />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-center flex-wrap">
        <div className="border border-neutral-500 rounded-md h-12 px-6 py-4 flex items-center justify-between w-[278px]">
          <span className="text-lg font-light text-secondary-500">Search</span>
          <Search className="w-6 h-6" />
        </div>

        <button className="border border-neutral-500 rounded-md px-4 py-2 flex gap-4 items-center">
          <span className="text-base font-normal text-neutral-500">
            All categories
          </span>
          <ChevronDown className="w-8 h-8" />
        </button>

        <button className="border border-neutral-500 rounded-md px-4 py-2 flex gap-4 items-center">
          <span className="text-base font-normal text-neutral-500">
            All Budgets
          </span>
          <ChevronDown className="w-8 h-8" />
        </button>

        <button className="border border-neutral-500 rounded-md h-12 px-6 py-4 flex items-center">
          <span className="text-lg font-light text-secondary-500">Export</span>
        </button>

        <Button className="bg-primary-500 text-white px-7 py-3 rounded-md h-auto">
          <span className="text-base font-medium capitalize">
            bulk AI process
          </span>
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {data.content && data.content.length > 0 ? (
          data.content.map((job) => (
            <PendingJobCard key={job.id} job={job} />
          ))
        ) : (
          <p className="text-neutral-500 text-lg">No pending jobs found</p>
        )}
      </div>
    </div>
  );
}

function PendingJobCard({ job }: { job: Job }) {
  const [showResults, setShowResults] = useState(false);
  const startShortlisting = useStartAIShortlisting();
  const { data: status } = useAIShortlistingStatus(job.id, true, 3000);
  const { data: results } = useAIShortlistingResults(
    job.id,
    status?.status === "completed"
  );

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "high":
        return "text-error-500";
      case "normal":
        return "text-warning-500";
      default:
        return "text-success-500";
    }
  };

  const getStatusBadge = () => {
    if (!status) return null;

    switch (status.status) {
      case "processing":
        return (
          <div className="bg-warning-50 px-2 py-2 rounded-[15px] h-8 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 text-warning-800 animate-spin" />
            <span className="text-sm font-normal text-warning-800">
              Processing
            </span>
          </div>
        );
      case "completed":
        return (
          <div className="bg-success-50 px-2 py-2 rounded-[15px] h-8 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success-800" />
            <span className="text-sm font-normal text-success-800">
              Completed
            </span>
          </div>
        );
      case "failed":
        return (
          <div className="bg-error-50 px-2 py-2 rounded-[15px] h-8 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-error-800" />
            <span className="text-sm font-normal text-error-800">Failed</span>
          </div>
        );
      default:
        return (
          <div className="bg-success-50 px-2 py-2 rounded-[15px] h-8 flex items-center justify-center">
            <span className="text-sm font-normal text-success-800">
              Ready for review
            </span>
          </div>
        );
    }
  };

  return (
    <>
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
          {getStatusBadge()}
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
            <p className="text-xs font-normal text-neutral-500">SUBMITTED</p>
            <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
              {formatRelativeTime(job.submittedAt)}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-normal text-neutral-500">URGENCY</p>
            <p
              className={`text-sm font-normal tracking-[0.1px] ${getUrgencyColor(
                job.urgency
              )}`}
            >
              {job.urgency}
            </p>
          </div>
        </div>

        <p className="text-base font-normal text-neutral-500 leading-[19.2px]">
          {job.description}
        </p>

        <div className="flex gap-4 items-center self-end">
          <Button className="bg-primary-500 text-white px-7 py-3 rounded-md h-12">
            <span className="text-lg font-medium">View Details</span>
          </Button>
          {status?.status === "completed" ? (
            <Button
              className="bg-success-500 text-white px-7 py-3 rounded-md h-12"
              onClick={() => setShowResults(true)}
            >
              <span className="text-lg font-medium">View Results</span>
            </Button>
          ) : status?.status === "processing" || status?.status === "pending" ? (
            <Button
              variant="outline"
              className="border border-neutral-500 px-7 py-3 rounded-md h-12"
              disabled
            >
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span className="text-lg font-medium">Processing...</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              className="border border-neutral-500 px-7 py-3 rounded-md h-12"
              onClick={() => startShortlisting.mutate(job.id)}
              loading={startShortlisting.isPending}
              disabled={startShortlisting.isPending}
            >
              <span className="text-lg font-medium">Start AI Shortlisting</span>
            </Button>
          )}
        </div>
      </div>

      {showResults && results && (
        <ShortlistingResultsModal
          job={job}
          results={results}
          onClose={() => setShowResults(false)}
        />
      )}
    </>
  );
}
