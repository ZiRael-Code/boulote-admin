"use client";

import { Search, ChevronDown } from "lucide-react";
import Button from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Avatar } from "@/components/ui/avatar";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useOngoingJobs } from "@/hooks/use-jobs";
import type { Job } from "@/lib/types/job";
import { formatRelativeTime } from "@/lib/utils/format-date";
import { getInitials } from "@/lib/utils/string-helpers";
import { pluralize } from "@/lib/utils/string-helpers";

export function OngoingJobsTab() {
  const { data, isLoading, error } = useOngoingJobs(true);

  if (isLoading) {
    return <LoadingSpinner message="Loading ongoing jobs..." className="py-12" />;
  }

  if (error) {
    return <ErrorState title="Failed to load ongoing jobs" className="py-12" />;
  }

  if (!data || data.empty) {
    return <EmptyState message="No ongoing jobs found" className="py-12" />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-center">
        <button className="border border-neutral-500 rounded-md px-4 py-2 flex gap-4 items-center">
          <span className="text-base font-normal text-neutral-500">
            All Status
          </span>
          <ChevronDown className="w-8 h-8" />
        </button>

        <button className="border border-neutral-500 rounded-md px-4 py-2 flex gap-4 items-center">
          <span className="text-base font-normal text-neutral-500">
            All Professionals
          </span>
          <ChevronDown className="w-8 h-8" />
        </button>

        <div className="border border-neutral-500 rounded-md h-12 px-6 py-4 flex items-center justify-between flex-1 max-w-md">
          <span className="text-lg font-light text-secondary-500">Search</span>
          <Search className="w-6 h-6" />
        </div>

        <Button
          variant="outline"
          className="border border-neutral-500 text-border-neutral-800 px-7 py-3"
        >
          Progress report
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {data.content && data.content.length > 0 ? (
          data.content.map((job) => (
            <OngoingJobCard key={job.id} job={job} />
          ))
        ) : (
          <p className="text-neutral-500 text-lg">No ongoing jobs found</p>
        )}
      </div>
    </div>
  );
}

function OngoingJobCard({ job }: { job: Job }) {
  const isAtRisk = job.progressPercentage < 50 && job.dueDate;
  const dueDate = job.dueDate ? new Date(job.dueDate) : null;
  const now = new Date();
  const daysUntilDue = dueDate
    ? Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="border border-border-500 rounded-md p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-medium text-secondary-500 mb-2">
            {job.title}
          </h3>
          <p className="text-base text-secondary-500 mb-1">
            {job.companyName}
            {job.assignedProfessionalName &&
              ` → ${job.assignedProfessionalName}`}
          </p>
          <p className="text-xs text-neutral-500">ID: {job.jobId}</p>
        </div>
        <div
          className={`px-2 py-2 rounded-[15px] ${
            isAtRisk
              ? "bg-warning-50 text-warning-600"
              : "bg-success-50 text-success-800"
          }`}
        >
          <span className="text-sm font-normal">
            {isAtRisk ? "At risk" : "Ready for review"}
          </span>
        </div>
      </div>

      <div className="flex gap-20">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">
            PROJECT PROGRESS
          </p>
          <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
            {job.progressPercentage}% Complete
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">STARTED</p>
          <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
            {job.startDate
              ? formatRelativeTime(job.startDate)
              : "Not started"}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">
            {isAtRisk ? "DUE DATE" : "BUDGET USED"}
          </p>
          <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
            {isAtRisk && daysUntilDue !== null
              ? `In ${daysUntilDue} ${pluralize(daysUntilDue, "day")}`
              : job.actualBudget
                ? `${job.actualBudget} / ${job.budget}`
                : job.budget}
          </p>
        </div>
        {isAtRisk && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-normal text-neutral-500">ISSUE</p>
            <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
              Client Feedback delay
            </p>
          </div>
        )}
      </div>

      <ProgressBar percentage={job.progressPercentage} />

      {job.assignedProfessionalName && (
        <div className="flex items-center gap-4">
          <Avatar initials={getInitials(job.assignedProfessionalName)} />
          <div className="flex-1">
            <h4 className="font-medium">{job.assignedProfessionalName}</h4>
            <div className="flex items-center gap-2">
              <span className="text-warning-500">★</span>
              <span className="text-sm text-neutral-500">
                {job.professionalRating
                  ? `${job.professionalRating} • Last active: ${formatRelativeTime(job.submittedAt)}`
                  : "No rating"}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 self-end">
        <Button
          variant="outline"
          className="border border-neutral-500 text-border-neutral-800 px-7 py-3"
        >
          {isAtRisk ? "View issues" : "Track Progress"}
        </Button>
        <Button
          variant="outline"
          className="border border-neutral-500 text-border-neutral-800 px-7 py-3"
        >
          {isAtRisk ? "Contact parties" : "View messages"}
        </Button>
        <Button className="bg-primary-500 text-white px-7 py-3">
          {isAtRisk ? "Escalate issue" : "Manage Jobs"}
        </Button>
      </div>
    </div>
  );
}
