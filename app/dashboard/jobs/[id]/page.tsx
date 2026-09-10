"use client";

import { useParams } from "next/navigation";
import { BackButton } from "@/components/ui/back-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorState } from "@/components/ui/error-state";
import { useJobDetail } from "@/hooks/use-jobs";
import { formatDate } from "@/lib/utils/format-date";

export default function JobDetailPage() {
  const params = useParams();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = rawId ? Number(rawId) : 0;

  const { data: job, isLoading, error } = useJobDetail(id, id > 0);

  if (isLoading) {
    return <LoadingSpinner message="Loading job details..." className="py-32" />;
  }

  if (error || !job) {
    return <ErrorState title="Failed to load job details" className="py-32" />;
  }

  return (
    <div className="flex flex-col gap-8 px-4 py-8 lg:px-16 lg:py-16">
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-semibold text-secondary-500">Job Details</h1>
      </div>

      <div className="border border-border-500 rounded-md p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-medium text-secondary-500">{job.title}</h2>
            <p className="text-base text-secondary-500">{job.companyName}</p>
            <p className="text-xs text-neutral-500">ID: {job.jobId}</p>
          </div>
          <span className="bg-primary-50 text-primary-700 text-sm px-3 py-1 rounded-full whitespace-nowrap">
            {job.status.replaceAll("_", " ")}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Field label="Budget" value={job.budget} />
          <Field label="Duration" value={job.duration} />
          <Field label="Start Date" value={job.startDate ? formatDate(job.startDate) : "Not set"} />
          <Field label="Due Date" value={job.dueDate ? formatDate(job.dueDate) : "Not set"} />
          <Field label="Urgency" value={job.urgency} />
          <Field label="Progress" value={`${job.progressPercentage}%`} />
          <Field label="Experience Level" value={job.experienceLevel ?? "Not set"} />
          <Field
            label="Assigned Professional"
            value={job.assignedProfessionalName ?? "Not yet assigned"}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">DESCRIPTION</p>
          <p className="text-sm text-secondary-500">{job.description}</p>
        </div>

        {job.requiredSkills.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-normal text-neutral-500">REQUIRED SKILLS</p>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="bg-neutral-100 text-secondary-500 text-sm px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {job.milestones.length > 0 && (
        <div className="border border-border-500 rounded-md p-6 flex flex-col gap-4">
          <h3 className="text-lg font-medium text-secondary-500">Milestones</h3>
          <div className="flex flex-col gap-3">
            {job.milestones.map((m) => (
              <div key={m.id} className="flex items-center justify-between border-b border-border-500 pb-3 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-secondary-500">{m.title}</p>
                  {m.description && <p className="text-xs text-neutral-500">{m.description}</p>}
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 text-secondary-500">
                  {m.status?.replaceAll("_", " ") ?? "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border border-border-500 rounded-md p-6 flex flex-col gap-4">
        <h3 className="text-lg font-medium text-secondary-500">Deliverables</h3>
        {job.deliverables.length === 0 ? (
          <p className="text-sm text-neutral-500">No deliverables submitted yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {job.deliverables.map((d) => (
              <div key={d.id} className="flex items-center justify-between border-b border-border-500 pb-3 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-secondary-500">{d.name ?? d.fileName ?? "Deliverable"}</p>
                  {d.description && <p className="text-xs text-neutral-500">{d.description}</p>}
                  {d.submittedDate && (
                    <p className="text-xs text-neutral-500">Submitted {formatDate(d.submittedDate)}</p>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    d.isCompleted
                      ? "bg-success-50 text-success-800"
                      : "bg-warning-50 text-warning-800"
                  }`}
                >
                  {d.isCompleted ? "Completed" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border border-border-500 rounded-md p-6 flex flex-col gap-4">
        <h3 className="text-lg font-medium text-secondary-500">Payment</h3>
        {!job.payment ? (
          <p className="text-sm text-neutral-500">No payment record for this job yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Field label="Status" value={job.payment.status?.replaceAll("_", " ") ?? "—"} />
            <Field
              label="Amount"
              value={
                job.payment.amount != null
                  ? `₦${job.payment.amount.toLocaleString()}`
                  : "—"
              }
            />
            <Field label="Paid At" value={job.payment.paidAt ? formatDate(job.payment.paidAt) : "Not yet paid"} />
            <Field label="Reference" value={job.payment.transactionReference ?? "—"} />
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-normal text-neutral-500">{label.toUpperCase()}</p>
      <p className="text-sm text-secondary-500">{value}</p>
    </div>
  );
}
