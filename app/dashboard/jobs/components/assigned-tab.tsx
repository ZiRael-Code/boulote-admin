"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Button from "@/components/ui/button";
import SearchInput from "@/components/ui/input/search-input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Pagination } from "@/components/ui/pagination";
import { Avatar } from "@/components/ui/avatar";
import { useAssignedJobs } from "@/hooks/use-jobs";
import type { Job } from "@/lib/types/job";
import { formatRelativeTime } from "@/lib/utils/format-date";
import { getInitials } from "@/lib/utils/string-helpers";

export function AssignedJobsTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const { data, isLoading, error } = useAssignedJobs(true, { search, page });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-center">
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
        <LoadingSpinner message="Loading assigned jobs..." className="py-12" />
      ) : error ? (
        <ErrorState title="Failed to load assigned jobs" className="py-12" />
      ) : !data?.content?.length ? (
        <EmptyState message="No jobs have a professional assigned yet" className="py-12" />
      ) : (
        <div className="flex flex-col gap-6">
          {data.content.map((job) => (
            <AssignedJobCard key={job.id} job={job} />
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

function AssignedJobCard({ job }: { job: Job }) {
  const router = useRouter();
  const isDeclined = job.offerStatus === "DECLINED";

  return (
    <div className="border border-border-500 rounded-md p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-medium text-secondary-500 mb-2">
            {job.title}
          </h3>
          <p className="text-base text-secondary-500 mb-1">{job.companyName}</p>
          <p className="text-xs text-neutral-500">ID: {job.jobId}</p>
        </div>
        <div
          className={`px-2 py-2 rounded-[15px] shrink-0 ${
            isDeclined ? "bg-error-50 text-error-800" : "bg-warning-50 text-warning-600"
          }`}
        >
          <span className="text-sm font-normal">
            {isDeclined ? "Declined - needs reassignment" : "Awaiting acceptance"}
          </span>
        </div>
      </div>

      {job.assignedProfessionalName && (
        <div className="flex items-center gap-4">
          <Avatar initials={getInitials(job.assignedProfessionalName)} />
          <div className="flex-1">
            <h4 className="font-medium">{job.assignedProfessionalName}</h4>
            <p className="text-sm text-neutral-500">
              Assigned {job.assignedAt ? formatRelativeTime(job.assignedAt) : "recently"}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-4 self-end flex-wrap">
        {job.assignedProfessionalId && (
          <Button
            variant="outline"
            className="border border-neutral-500 px-7 py-3"
            onClick={() => router.push(`/dashboard/professionals/${job.assignedProfessionalId}`)}
          >
            View Professional
          </Button>
        )}
        <Button
          variant="outline"
          className="border border-neutral-500 px-7 py-3"
          onClick={() => toast("Reassigning professionals isn't available yet.")}
        >
          Reassign
        </Button>
        <Button
          className="bg-primary-500 text-white px-7 py-3"
          onClick={() => router.push(`/dashboard/jobs/${job.id}`)}
        >
          View Project
        </Button>
      </div>
    </div>
  );
}
