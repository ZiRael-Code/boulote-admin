"use client";

import { Loader2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useActiveAIShortlistingProcesses } from "@/hooks/use-jobs";

export function ActiveProcessesSection() {
  const { data, isLoading } = useActiveAIShortlistingProcesses(true);

  if (isLoading) {
    return <LoadingSpinner size="sm" className="py-8" />;
  }

  const activeProcesses = data?.activeProcesses || [];

  if (activeProcesses.length === 0) {
    return null;
  }

  return (
    <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-warning-900">
          Active AI Shortlisting Processes
        </h3>
        <span className="bg-warning-200 text-warning-900 px-3 py-1 rounded-full text-sm font-medium">
          {activeProcesses.length} Active
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {activeProcesses.map((process) => (
          <div
            key={process.projectId}
            className="bg-white rounded-md p-3 flex items-center justify-between"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-secondary-500">
                {process.projectTitle}
              </p>
              <p className="text-xs text-neutral-500">
                Started: {new Date(process.startedAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {process.status === "processing" && (
                <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
              )}
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${
                  process.status === "processing"
                    ? "bg-primary-100 text-primary-700"
                    : "bg-neutral-100 text-neutral-700"
                }`}
              >
                {process.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
