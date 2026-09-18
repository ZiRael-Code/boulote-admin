"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { BackButton } from "@/components/ui/back-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorState } from "@/components/ui/error-state";
import Button from "@/components/ui/button";
import { useSupportRequest, useReplySupportRequest } from "@/hooks/use-support";
import { formatDate } from "@/lib/utils/format-date";

export default function SupportRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const requestId = Number(id);
  const { data: request, isLoading, error } = useSupportRequest(requestId);
  const replyMutation = useReplySupportRequest();
  const [replyText, setReplyText] = useState("");

  if (isLoading) return <LoadingSpinner message="Loading request..." className="py-24" />;
  if (error || !request) return <ErrorState title="Support request not found" className="py-24" />;

  const canReplyInApp = request.requesterType != null && request.requesterId != null;

  const handleSend = () => {
    if (!replyText.trim()) return;
    replyMutation.mutate(
      { id: request.id, reply: replyText },
      { onSuccess: () => setReplyText("") }
    );
  };

  return (
    <div className="flex flex-col gap-8 px-8 py-8 max-w-3xl">
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-semibold text-secondary-500">Support Request</h1>
      </div>

      <div className="border border-border-500 rounded-md p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-medium text-secondary-500">{request.name}</h2>
            <p className="text-sm text-neutral-500">{request.email}</p>
          </div>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full border ${
              request.resolved
                ? "bg-green-50 text-green-600 border-green-200"
                : "bg-amber-50 text-amber-600 border-amber-200"
            }`}
          >
            {request.resolved ? "Replied" : "Awaiting reply"}
          </span>
        </div>

        <p className="text-sm text-secondary-600 whitespace-pre-wrap">{request.message}</p>

        {request.screenshotUrl && (
          <a
            href={request.screenshotUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-500 hover:underline w-fit"
          >
            View attached screenshot
          </a>
        )}

        <p className="text-xs text-neutral-400">Submitted {formatDate(request.createdAt)}</p>

        {!canReplyInApp && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
            This request has no linked account (submitted before this account link existed, or the
            account could not be resolved). A reply will still be emailed to {request.email}, but
            won&apos;t appear as an in-app notification for them.
          </p>
        )}
      </div>

      {request.adminReply && (
        <div className="border border-green-200 bg-green-50/50 rounded-md p-6 flex flex-col gap-2">
          <p className="text-xs font-medium text-green-700 uppercase tracking-wide">Your reply</p>
          <p className="text-sm text-secondary-600 whitespace-pre-wrap">{request.adminReply}</p>
          {request.repliedAt && (
            <p className="text-xs text-neutral-400">Sent {formatDate(request.repliedAt)}</p>
          )}
        </div>
      )}

      <div className="border border-border-500 rounded-md p-6 flex flex-col gap-4">
        <h3 className="text-base font-semibold text-secondary-500">
          {request.resolved ? "Send another reply" : "Reply"}
        </h3>
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          rows={5}
          placeholder="Write your response..."
          className="w-full border border-neutral-300 rounded-md px-4 py-3 text-sm text-secondary-600 focus:outline-none focus:border-primary-400 resize-none"
        />
        <Button
          onClick={handleSend}
          disabled={!replyText.trim() || replyMutation.isPending}
          loading={replyMutation.isPending}
          className="w-fit"
        >
          Send Reply
        </Button>
      </div>
    </div>
  );
}
