"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/back-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Pagination } from "@/components/ui/pagination";
import { useSupportRequests } from "@/hooks/use-support";
import { formatDate } from "@/lib/utils/format-date";

const FILTER_OPTIONS = [
  { value: "", label: "All Requests" },
  { value: "false", label: "Unresolved" },
  { value: "true", label: "Resolved" },
];

export default function SupportRequestsPage() {
  const router = useRouter();
  const [resolvedFilter, setResolvedFilter] = useState("");
  const [page, setPage] = useState(0);

  const { data, isLoading, error } = useSupportRequests({
    resolved: resolvedFilter === "" ? undefined : resolvedFilter === "true",
    page,
  });

  const requests = data?.content ?? [];

  return (
    <div className="flex flex-col gap-8 px-8 py-8">
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-semibold text-secondary-500">Support Requests</h1>
      </div>

      <select
        value={resolvedFilter}
        onChange={(e) => {
          setResolvedFilter(e.target.value);
          setPage(0);
        }}
        className="w-64 border border-neutral-500 rounded-md px-4 py-2 bg-white text-base text-secondary-500 focus:outline-none"
      >
        {FILTER_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {isLoading ? (
        <LoadingSpinner message="Loading support requests..." className="py-12" />
      ) : error ? (
        <ErrorState title="Failed to load support requests" className="py-12" />
      ) : requests.length === 0 ? (
        <EmptyState message="No support requests" className="py-12" />
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map((req) => (
            <button
              key={req.id}
              onClick={() => router.push(`/dashboard/support/${req.id}`)}
              className={`text-left border rounded-md p-6 flex flex-col gap-3 transition-colors hover:border-primary-300 ${
                req.resolved ? "border-border-500 bg-white" : "border-amber-300 bg-amber-50/40"
              }`}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-medium text-secondary-500">{req.name}</h3>
                  <p className="text-sm text-neutral-500">{req.email}</p>
                </div>
                <span
                  className={`flex-shrink-0 px-3 py-1 text-xs font-semibold rounded-full border ${
                    req.resolved
                      ? "bg-green-50 text-green-600 border-green-200"
                      : "bg-amber-50 text-amber-600 border-amber-200"
                  }`}
                >
                  {req.resolved ? "Replied" : "Awaiting reply"}
                </span>
              </div>
              <p className="text-sm text-secondary-600 line-clamp-2">{req.message}</p>
              <p className="text-xs text-neutral-400">{formatDate(req.createdAt)}</p>
            </button>
          ))}

          {data && data.totalPages > 1 && (
            <Pagination
              currentPage={page + 1}
              totalPages={data.totalPages}
              totalItems={data.totalElements}
              shownItems={data.numberOfElements}
              itemLabel="requests"
              onPageChange={(p) => setPage(p - 1)}
            />
          )}
        </div>
      )}
    </div>
  );
}
