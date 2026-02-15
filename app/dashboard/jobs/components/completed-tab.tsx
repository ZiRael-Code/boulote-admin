"use client";

import { Search, ChevronDown } from "lucide-react";
import Button from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { useCompletedJobs } from "@/hooks/use-jobs";
import type { Job } from "@/lib/types/job";
import { formatRelativeTime } from "@/lib/utils/format-date";

export function CompletedTab() {
  const { data, isLoading, error } = useCompletedJobs(true);

  if (isLoading) {
    return <LoadingSpinner message="Loading completed jobs..." className="py-12" />;
  }

  if (error) {
    return <ErrorState title="Failed to load completed jobs" className="py-12" />;
  }

  if (!data?.content?.length) {
    return <EmptyState message="No completed jobs found" className="py-12" />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-center">
        <button className="border border-neutral-500 rounded-md px-4 py-2 flex gap-4 items-center">
          <span className="text-base font-normal text-neutral-500">
            Last 30 days
          </span>
          <ChevronDown className="w-8 h-8" />
        </button>

        <button className="border border-neutral-500 rounded-md px-4 py-2 flex gap-4 items-center">
          <span className="text-base font-normal text-neutral-500">
            All Ratings
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
        >
          Generate report
        </Button>
      </div>

      <Button
        variant="outline"
        className="border border-neutral-500 px-7 py-3 self-start"
      >
        Give feedback request
      </Button>

      <div className="flex flex-col gap-6">
        {data.content.map((job) => (
          <CompletedJobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

function CompletedJobCard({ job }: { job: Job }) {
  const rating = job.professionalRating || 0;
  const feedbackBg = rating >= 4 ? "bg-success-50" : "bg-warning-50";
  const feedbackText = rating >= 4 ? "text-success-900" : "text-warning-900";

  return (
    <div className="border border-border-500 rounded-md p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-medium text-secondary-500 mb-2">
            {job.title}
          </h3>
          <p className="text-base text-secondary-500 mb-1">
            {job.companyName}
          </p>
          <p className="text-xs text-neutral-500">ID: {job.jobId}</p>
        </div>
        <div className="bg-success-50 px-2 py-2 rounded-[15px]">
          <span className="text-sm font-normal text-success-800">
            Completed
          </span>
        </div>
      </div>

      <div className="flex gap-20">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">COMPLETED</p>
          <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
            {job.completionDate
              ? formatRelativeTime(job.completionDate)
              : "N/A"}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">DURATION</p>
          <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
            {job.duration}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">CLIENT RATINGS</p>
          <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
            {rating > 0 ? rating.toFixed(1) : "N/A"}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">FINAL PAYMENT</p>
          <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
            {job.actualBudget || job.budget}
          </p>
        </div>
      </div>

      {job.companyFeedback && (
        <div className={`p-4 rounded-md ${feedbackBg}`}>
          <h4 className={`font-medium mb-2 ${feedbackText}`}>
            Client Feedback
          </h4>
          <p className={`text-sm ${feedbackText}`}>{job.companyFeedback}</p>
        </div>
      )}

      <div className="flex gap-4 self-end">
        <Button
          variant="outline"
          className="border border-neutral-500 text-border-neutral-800 px-7 py-3"
        >
          View details
        </Button>
        <Button
          variant="outline"
          className="border border-neutral-500 text-border-neutral-800 px-7 py-3"
        >
          Performance Reports
        </Button>
      </div>
    </div>
  );
}
