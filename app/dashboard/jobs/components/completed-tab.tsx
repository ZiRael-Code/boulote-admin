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
import { useCompletedJobs, useJobCategories } from "@/hooks/use-jobs";
import type { Job } from "@/lib/types/job";
import { formatRelativeTime } from "@/lib/utils/format-date";

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

// No backend "completed within N days" param exists — filters the
// completionDate of whatever's already loaded on the current page.
const DAYS_OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

// Same as above — client-side over the current page, no backend rating param.
const RATING_OPTIONS = [
  { value: "4", label: "4 and above" },
  { value: "3", label: "3 to 4" },
  { value: "below3", label: "Below 3" },
];

export function CompletedTab() {
  const [search, setSearch] = useState("");
  const [budget, setBudget] = useState("");
  const [urgency, setUrgency] = useState("");
  const [category, setCategory] = useState("");
  const [daysFilter, setDaysFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [page, setPage] = useState(0);
  const { data, isLoading, error } = useCompletedJobs(true, {
    search,
    budget,
    urgency,
    category,
    page,
  });
  const { data: categoryOptions } = useJobCategories();

  const visibleJobs = useMemo(() => {
    let jobs = data?.content ?? [];
    if (daysFilter) {
      const cutoff = Date.now() - Number(daysFilter) * 24 * 60 * 60 * 1000;
      jobs = jobs.filter(
        (j) => j.completionDate && new Date(j.completionDate).getTime() >= cutoff,
      );
    }
    if (ratingFilter) {
      jobs = jobs.filter((j) => {
        const rating = j.professionalRating ?? 0;
        if (ratingFilter === "4") return rating >= 4;
        if (ratingFilter === "3") return rating >= 3 && rating < 4;
        return rating < 3;
      });
    }
    return jobs;
  }, [data?.content, daysFilter, ratingFilter]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-center flex-wrap">
        <Select
          value={daysFilter}
          onChange={(e) => setDaysFilter(e.target.value)}
          options={DAYS_OPTIONS}
          placeholder="Last 30 days"
          className="!h-12 !py-2 w-auto"
          title="Filters within the jobs currently shown on this page"
        />

        <Select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          options={RATING_OPTIONS}
          placeholder="All Ratings"
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
        <LoadingSpinner message="Loading completed jobs..." className="py-12" />
      ) : error ? (
        <ErrorState title="Failed to load completed jobs" className="py-12" />
      ) : !data?.content?.length ? (
        <EmptyState message="No completed jobs found" className="py-12" />
      ) : visibleJobs.length === 0 ? (
        <EmptyState message="No completed jobs match these filters on this page" className="py-12" />
      ) : (
        <div className="flex flex-col gap-6">
          {visibleJobs.map((job) => (
            <CompletedJobCard key={job.id} job={job} />
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

function CompletedJobCard({ job }: { job: Job }) {
  const router = useRouter();
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
            {job.budget}
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
          onClick={() => router.push(`/dashboard/jobs/${job.id}`)}
        >
          View details
        </Button>
      </div>
    </div>
  );
}
