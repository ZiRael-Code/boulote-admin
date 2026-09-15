"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import SearchInput from "@/components/ui/input/search-input";
import Select from "@/components/ui/input/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Pagination } from "@/components/ui/pagination";
import { Avatar } from "@/components/ui/avatar";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useOngoingJobs, useJobCategories } from "@/hooks/use-jobs";
import type { Job } from "@/lib/types/job";
import { formatRelativeTime } from "@/lib/utils/format-date";
import { getInitials } from "@/lib/utils/string-helpers";
import { pluralize } from "@/lib/utils/string-helpers";

const BUDGET_OPTIONS = [
  { value: "Under ₦500,000", label: "Under ₦500,000" },
  { value: "₦500,000 - ₦2,000,000", label: "₦500,000 - ₦2,000,000" },
  { value: "Over ₦2,000,000", label: "Over ₦2,000,000" },
];

const URGENCY_OPTIONS = [
  { value: "Normal", label: "Normal" },
  { value: "High", label: "High" },
  { value: "Urgent", label: "Urgent" },
];

// "At risk" / "On track" isn't a real backend status — it's derived
// client-side the same way OngoingJobCard already computes it, so this
// filter only ever applies to jobs already loaded on the current page.
const RISK_OPTIONS = [
  { value: "at-risk", label: "At risk" },
  { value: "on-track", label: "On track" },
];

function isJobAtRisk(job: Job) {
  return job.progressPercentage < 50 && !!job.dueDate;
}

export function OngoingJobsTab() {
  const [search, setSearch] = useState("");
  const [budget, setBudget] = useState("");
  const [urgency, setUrgency] = useState("");
  const [category, setCategory] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [professionalFilter, setProfessionalFilter] = useState("");
  const [page, setPage] = useState(0);
  const { data, isLoading, error } = useOngoingJobs(true, {
    search,
    budget,
    urgency,
    category,
    page,
  });
  const { data: categoryOptions } = useJobCategories();

  // Professional names are only known from whatever's on the current page —
  // there's no backend "list assigned professionals" filter to page against.
  const professionalOptions = useMemo(() => {
    const names = new Set<string>();
    for (const job of data?.content ?? []) {
      if (job.assignedProfessionalName) names.add(job.assignedProfessionalName);
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [data?.content]);

  const visibleJobs = useMemo(() => {
    let jobs = data?.content ?? [];
    if (riskFilter) {
      jobs = jobs.filter((j) =>
        riskFilter === "at-risk" ? isJobAtRisk(j) : !isJobAtRisk(j),
      );
    }
    if (professionalFilter) {
      jobs = jobs.filter((j) => j.assignedProfessionalName === professionalFilter);
    }
    return jobs;
  }, [data?.content, riskFilter, professionalFilter]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-center flex-wrap">
        <Select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          options={RISK_OPTIONS}
          placeholder="All Status"
          className="!h-12 !py-2 w-auto"
          title="Filters within the jobs currently shown on this page"
        />

        <Select
          value={professionalFilter}
          onChange={(e) => setProfessionalFilter(e.target.value)}
          options={professionalOptions.map((n) => ({ value: n, label: n }))}
          placeholder="All Professionals"
          className="!h-12 !py-2 w-auto"
          title="Filters within the jobs currently shown on this page"
        />

        <Select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(0);
          }}
          options={(categoryOptions ?? []).map((c) => ({ value: c, label: c }))}
          placeholder="All categories"
          className="!h-12 !py-2 w-auto"
        />

        <Select
          value={budget}
          onChange={(e) => {
            setBudget(e.target.value);
            setPage(0);
          }}
          options={BUDGET_OPTIONS}
          placeholder="All Budgets"
          className="!h-12 !py-2 w-auto"
        />

        <Select
          value={urgency}
          onChange={(e) => {
            setUrgency(e.target.value);
            setPage(0);
          }}
          options={URGENCY_OPTIONS}
          placeholder="All Urgency"
          className="!h-12 !py-2 w-auto"
        />

        <SearchInput
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="flex-1 max-w-md"
        />
      </div>

      {isLoading ? (
        <LoadingSpinner message="Loading ongoing jobs..." className="py-12" />
      ) : error ? (
        <ErrorState title="Failed to load ongoing jobs" className="py-12" />
      ) : !data?.content?.length ? (
        <EmptyState message="No ongoing jobs found" className="py-12" />
      ) : visibleJobs.length === 0 ? (
        <EmptyState message="No ongoing jobs match these filters on this page" className="py-12" />
      ) : (
        <div className="flex flex-col gap-6">
          {visibleJobs.map((job) => (
            <OngoingJobCard key={job.id} job={job} />
          ))}
          {data.totalPages > 1 && (
            <Pagination
              currentPage={page + 1}
              totalPages={data.totalPages}
              totalItems={data.totalElements}
              shownItems={data.numberOfElements}
              itemLabel="jobs"
              onPageChange={(p) => setPage(p - 1)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function OngoingJobCard({ job }: { job: Job }) {
  const router = useRouter();
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
              : job.budget}
          </p>
        </div>
        {isAtRisk && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-normal text-neutral-500">ISSUE</p>
            <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
              Behind schedule
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
          className="bg-primary-500 text-white px-7 py-3"
          onClick={() => router.push(`/dashboard/jobs/${job.id}`)}
        >
          {isAtRisk ? "View issues" : "Manage Job"}
        </Button>
      </div>
    </div>
  );
}
