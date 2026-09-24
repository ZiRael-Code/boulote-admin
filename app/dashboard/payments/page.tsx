"use client";

import { useState } from "react";
import { ChevronDown, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { Pagination } from "@/components/ui/pagination";
import { usePayments, useReconcileTransfer } from "@/hooks/use-payments";
import { formatRelativeTime } from "@/lib/utils/format-date";
import type { AdminPaymentTransaction } from "@/lib/types/payment";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "TRANSFER_FAILED", label: "Transfer Failed" },
  { value: "CHARGE_CARD_FAILED", label: "Charge Failed" },
  { value: "DISPUTED", label: "Disputed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "COMPLETED", label: "Completed" },
];

function formatNaira(amount: number | null) {
  if (amount == null) return "N/A";
  return `₦${amount.toLocaleString()}`;
}

export default function PaymentsPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = usePayments({ status, page: page - 1 });
  const reconcileMutation = useReconcileTransfer();

  const transactions = data?.content ?? [];

  return (
    <div className="flex flex-col gap-6 px-4 py-8 lg:pl-16 lg:pr-8 lg:py-16">
      <div className="flex flex-col gap-4">
        <h1 className="text-[32px] font-semibold leading-[38.4px] tracking-[1px] text-secondary-500">
          Payments
        </h1>
        <p className="text-xl font-medium leading-6 tracking-[0.1px] text-secondary-500">
          Track project payments and payouts to professionals, and manually resolve any that got stuck.
        </p>
      </div>
      <div className="h-px w-full bg-border-500" />

      <div className="relative w-64">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="w-full border border-neutral-500 rounded-md px-4 py-2 pr-10 appearance-none bg-white text-base text-secondary-500 focus:outline-none"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="w-5 h-5 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {isLoading ? (
        <LoadingSpinner message="Loading payments..." className="py-12" />
      ) : error ? (
        <ErrorState title="Failed to load payments" className="py-12" />
      ) : transactions.length === 0 ? (
        <EmptyState message="No payments found" className="py-12" />
      ) : (
        <div className="flex flex-col gap-4">
          {transactions.map((tx) => (
            <PaymentRow
              key={tx.id}
              tx={tx}
              onReconcile={() => reconcileMutation.mutate(tx.id)}
              isReconciling={reconcileMutation.isPending && reconcileMutation.variables === tx.id}
            />
          ))}

          {data && data.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              totalItems={data.totalElements}
              shownItems={data.numberOfElements}
              itemLabel="payments"
              onPageChange={setPage}
            />
          )}
        </div>
      )}
    </div>
  );
}

function PaymentRow({
  tx,
  onReconcile,
  isReconciling,
}: {
  tx: AdminPaymentTransaction;
  onReconcile: () => void;
  isReconciling: boolean;
}) {
  // A transfer can need a reconcile click without being an urgent problem,
  // settling is expected and temporary, so the button stays available for it,
  // it just doesn't get the same alarming red styling as a genuine failure.
  const canReconcile = tx.status === "TRANSFER_FAILED" || tx.status === "CHARGE_CARD_FAILED" || tx.status === "DISPUTED";

  return (
    <div
      className={`border rounded-md p-6 flex flex-col gap-4 ${
        tx.needsAttention ? "border-error-500 bg-error-50" : "border-border-500 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium text-secondary-500">{tx.projectTitle ?? "Untitled project"}</h3>
            {tx.needsAttention && <AlertTriangle className="w-4 h-4 text-error-500" />}
          </div>
          <p className="text-sm text-neutral-500">
            {tx.companyName ?? "Unknown company"} &rarr; {tx.professionalName ?? "Unknown professional"}
          </p>
        </div>
        {tx.pendingSettlement ? (
          // Same TRANSFER_FAILED status as a real failure underneath, but this
          // is just Paystack's normal T+1 settlement delay, and StatusBadge's
          // color map always renders TRANSFER_FAILED red - override it here so
          // this doesn't look like the same problem as a genuine payout failure.
          <span className="px-2 py-1 rounded text-xs font-medium bg-primary-50 text-primary-600">
            Settling
          </span>
        ) : (
          <StatusBadge status={tx.status} />
        )}
      </div>

      <div className="flex gap-10 flex-wrap text-sm">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-neutral-500">CHARGED</span>
          <span className="text-secondary-500 font-medium">{formatNaira(tx.amount)}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-neutral-500">PROFESSIONAL PAYOUT</span>
          <span className="text-secondary-500 font-medium">{formatNaira(tx.professionalPayout)}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-neutral-500">SUBMITTED</span>
          <span className="text-secondary-500 font-medium">
            {tx.submittedAt ? formatRelativeTime(tx.submittedAt) : "N/A"}
          </span>
        </div>
      </div>

      {tx.message && (
        <p
          className={`text-sm rounded-md p-3 ${
            tx.pendingSettlement ? "text-primary-600 bg-primary-50" : "text-error-600 bg-white/60"
          }`}
        >
          {tx.pendingSettlement
            ? "Not an actual failure, waiting on funds to settle with Paystack: " + tx.message
            : tx.message}
        </p>
      )}

      {canReconcile && (
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={onReconcile}
            loading={isReconciling}
            disabled={isReconciling}
          >
            Reconcile with Paystack
          </Button>
        </div>
      )}
    </div>
  );
}
