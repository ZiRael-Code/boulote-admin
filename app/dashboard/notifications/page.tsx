"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search, ChevronDown, Star, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  useCommunicationDashboard,
  usePreviousAnnouncements,
  useCreateAnnouncement,
  useSaveDraft,
  useSendAnnouncement,
  useJobPostings,
  useMatchingProfessionals,
  useSendJobInvites,
  useSystemAlerts,
} from "@/hooks/use-communication";

function StarRating({ rating, max = 5, size = 13 }: { rating: number; max?: number; size?: number }) {
  return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
            <Star
                key={i}
                size={size}
                className={i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}
            />
        ))}
      </div>
  );
}

function EmptyBox({ message }: { message: string }) {
  return (
      <div className="flex items-center justify-center py-16 text-gray-400 text-sm border border-gray-200 rounded-lg">
        {message}
      </div>
  );
}

function StatCards() {
  const { data, isLoading } = useCommunicationDashboard();
  return (
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Messages Sent Today",   value: isLoading ? "..." : data?.messagesSentToday ?? 0 },
          { label: "Pending System Alerts", value: isLoading ? "..." : data?.pendingSystemAlerts ?? 0 },
          { label: "Total Recipients",      value: isLoading ? "..." : data?.totalRecipients ?? 0 },
        ].map((s) => (
            <div key={s.label} className="border border-gray-200 rounded-lg p-6 flex flex-col items-center gap-2 bg-white">
              <span className="text-3xl font-bold text-primary-500">{s.value}</span>
              <span className="text-sm text-secondary-500">{s.label}</span>
            </div>
        ))}
      </div>
  );
}

type Tab = "announcements" | "job-invites" | "system-alerts";

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs: { key: Tab; label: string }[] = [
    { key: "announcements", label: "Announcements" },
    { key: "job-invites",   label: "Job Invites" },
    { key: "system-alerts", label: "System Alerts" },
  ];
  return (
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((t) => (
            <button
                key={t.key}
                onClick={() => onChange(t.key)}
                className={cn(
                    "px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px]",
                    active === t.key
                        ? "border-primary-500 text-primary-500"
                        : "border-transparent text-secondary-500 hover:text-secondary-700"
                )}
            >
              {t.label}
            </button>
        ))}
      </div>
  );
}

const MAX_CHARS = 450;

function AnnouncementsTab() {
  const [title, setTitle]               = useState("");
  const [message, setMessage]           = useState("");
  const [audience, setAudience]         = useState<"all" | "professionals" | "companies">("all");
  const [showPrevious, setShowPrevious] = useState(false);
  const [sentId, setSentId]             = useState<number | null>(null);

  const createMutation    = useCreateAnnouncement();
  const saveDraftMutation = useSaveDraft();
  const sendMutation      = useSendAnnouncement();
  const { data: previous, isLoading: isLoadingPrevious } = usePreviousAnnouncements(showPrevious);

  const audienceOptions = [
    { key: "all"           as const, label: "All users",             apiValue: "All users" },
    { key: "professionals" as const, label: "Only Professionals",    apiValue: "Only Professionals" },
    { key: "companies"     as const, label: "Only Companies",        apiValue: "Only Companies" },
  ];

  const audienceLabel = audienceOptions.find((a) => a.key === audience)?.label ?? "";
  const audienceApiValue = audienceOptions.find((a) => a.key === audience)?.apiValue ?? "All users";
  const hasContent = title.trim() && message.trim();

  const handleSend = () => {
    if (!hasContent) return;
    createMutation.mutate(
        { title, message, targetAudience: audienceApiValue },
        {
          onSuccess: (announcement) => {
            sendMutation.mutate(announcement.id, {
              onSuccess: () => {
                setSentId(announcement.id);
              },
            });
          },
        }
    );
  };

  const handleSaveDraft = () => {
    if (!hasContent) return;
    saveDraftMutation.mutate({ title, message, targetAudience: audienceApiValue });
  };

  if (sentId) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h3 className="text-lg font-bold text-secondary-600 mb-2">Announcement Sent!</h3>
          <p className="text-sm text-gray-400 max-w-sm mb-6">
            Your announcement has been sent to {audienceLabel}.
          </p>
          <button
              onClick={() => { setSentId(null); setTitle(""); setMessage(""); }}
              className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-md transition-colors"
          >
            Create Another
          </button>
        </div>
    );
  }

  return (
      <div>
        <div className="border border-gray-200 rounded-lg p-6 bg-white mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-secondary-600">Create New Announcement</h2>
            <button
                onClick={() => setShowPrevious(!showPrevious)}
                className="px-4 py-2 border border-gray-200 text-sm text-secondary-500 rounded-md hover:bg-gray-50 transition-colors"
            >
              {showPrevious ? "Hide previous" : "View previous announcements"}
            </button>
          </div>

          {showPrevious && (
              <div className="mb-5 border border-gray-200 rounded-md overflow-hidden">
                {isLoadingPrevious ? (
                    <LoadingSpinner className="py-6" />
                ) : !previous?.length ? (
                    <div className="px-4 py-6 text-sm text-gray-400 text-center">No previous announcements.</div>
                ) : (
                    <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto">
                      {previous.map((a: any) => (
                          <div key={a.id} className="px-4 py-3">
                            <p className="text-sm font-medium text-secondary-600">{a.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {a.targetAudience} • {a.recipientCount} recipients • {a.status}
                            </p>
                          </div>
                      ))}
                    </div>
                )}
              </div>
          )}

          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1.5">Announcement Title</label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter announcement title"
                className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-secondary-600 focus:outline-none focus:border-primary-400 transition-colors"
            />
          </div>

          <div className="mb-5">
            <label className="block text-xs text-gray-400 mb-1.5">Message</label>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS))}
                rows={5}
                placeholder="Write your announcement message..."
                className="w-full border border-gray-200 rounded-md px-4 py-3 text-sm text-secondary-500 focus:outline-none focus:border-primary-400 transition-colors resize-none"
            />
            <p className="text-xs text-gray-400 text-right mt-1">{message.length}/{MAX_CHARS} characters</p>
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold text-secondary-600 mb-3">Target Audience</p>
            <div className="flex items-center gap-3 flex-wrap">
              {audienceOptions.map((opt) => (
                  <button
                      key={opt.key}
                      onClick={() => setAudience(opt.key)}
                      className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors",
                          audience === opt.key
                              ? "border-primary-500 text-primary-500 bg-primary-50/40"
                              : "border-gray-200 text-secondary-500 hover:border-gray-300"
                      )}
                  >
                    <div className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                        audience === opt.key ? "border-primary-500" : "border-gray-300"
                    )}>
                      {audience === opt.key && <div className="w-2 h-2 rounded-full bg-primary-500" />}
                    </div>
                    {opt.label}
                  </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
                onClick={handleSend}
                disabled={!hasContent || createMutation.isPending || sendMutation.isPending}
                className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors"
            >
              {createMutation.isPending || sendMutation.isPending ? "Sending..." : "Send Announcement"}
            </button>
            <button
                onClick={handleSaveDraft}
                disabled={!hasContent || saveDraftMutation.isPending}
                className="px-6 py-2.5 border border-gray-200 text-secondary-500 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {saveDraftMutation.isPending ? "Saving..." : "Save As Draft"}
            </button>
          </div>
        </div>

        {hasContent && (
            <div>
              <h3 className="text-base font-semibold text-secondary-600 mb-3">Notification preview</h3>
              <div className="border border-gray-200 rounded-lg p-5 bg-white">
                <p className="text-sm font-semibold text-secondary-600 mb-1">{title}</p>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{message}</p>
                <p className="text-xs text-gray-400">
                  From: Platform Admin • To: {audienceLabel} • Estimated delivery: Immediately
                </p>
              </div>
            </div>
        )}
      </div>
  );
}

function JobInvitesTab() {
  const [selectedJobId, setSelectedJobId]     = useState<number | null>(null);
  const [selectedProfIds, setSelectedProfIds] = useState<number[]>([]);
  const [search, setSearch]                   = useState("");
  const [industry, setIndustry]               = useState("");
  const [rating, setRating]                   = useState("");

  const { data: jobs, isLoading: isLoadingJobs } = useJobPostings(true);
  const { data: professionals, isLoading: isLoadingProfessionals } = useMatchingProfessionals(
      selectedJobId,
      { search, industry, rating },
      !!selectedJobId
  );
  const sendInvitesMutation = useSendJobInvites();

  const toggleProf = (id: number) =>
      setSelectedProfIds((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );

  const handleSendInvites = () => {
    if (!selectedJobId || !selectedProfIds.length) return;
    sendInvitesMutation.mutate(
        { jobId: selectedJobId, professionalIds: selectedProfIds },
        { onSuccess: () => setSelectedProfIds([]) }
    );
  };

  return (
      <div className="flex gap-6">

        <div className="w-[45%] shrink-0">
          <p className="text-sm font-semibold text-secondary-600 mb-4">Step 1: Select Job Posting</p>
          {isLoadingJobs ? (
              <LoadingSpinner className="py-8" />
          ) : !jobs?.length ? (
              <EmptyBox message="No active job postings available." />
          ) : (
              <div className="flex flex-col gap-2">
                {jobs.map((job: any) => (
                    <button
                        key={job.id}
                        onClick={() => { setSelectedJobId(job.id); setSelectedProfIds([]); }}
                        className={cn(
                            "w-full text-left border rounded-md p-4 transition-colors",
                            selectedJobId === job.id
                                ? "border-primary-400 bg-primary-50/30"
                                : "border-gray-200 bg-white hover:border-gray-300"
                        )}
                    >
                      <p className="text-sm font-semibold text-secondary-600">{job.title}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Posted: {job.daysAgo} days ago • Company: {job.companyName}
                      </p>
                      <p className="text-xs text-primary-500 mt-0.5">
                        {job.matchingProfessionalsCount} matching professionals
                      </p>
                    </button>
                ))}
              </div>
          )}
        </div>

        <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-secondary-600">
                Step 2: Select Professionals to invite
              </p>
              {selectedJobId && (
                  <span className="text-xs text-gray-400">{selectedProfIds.length} selected</span>
              )}
            </div>
            {selectedJobId && (
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-1.5 bg-white flex-1 max-w-xs">
                    <Search size={14} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="text-sm outline-none flex-1"
                    />
                  </div>
                  <select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="border border-gray-200 rounded-md px-3 py-1.5 text-sm text-secondary-500 bg-white"
                  >
                    <option value="">All Ratings</option>
                    <option value="4+">4+ Stars</option>
                    <option value="3+">3+ Stars</option>
                  </select>
                </div>
            )}
          </div>

          {!selectedJobId ? (
              <div className="flex items-center justify-center h-48 text-sm text-gray-400">
                Select a job posting first
              </div>
          ) : isLoadingProfessionals ? (
              <LoadingSpinner className="py-12" />
          ) : !professionals?.length ? (
              <div className="flex items-center justify-center h-48 text-sm text-gray-400">
                No matching professionals found for this job.
              </div>
          ) : (
              <div>
                <div className="divide-y divide-gray-100 max-h-[340px] overflow-y-auto">
                  {professionals.map((prof: any) => {
                    const isSelected = selectedProfIds.includes(prof.id);
                    return (
                        <div
                            key={prof.id}
                            onClick={() => toggleProf(prof.id)}
                            className={cn(
                                "flex items-start gap-3 p-4 cursor-pointer transition-colors",
                                isSelected ? "bg-blue-50/40" : "hover:bg-gray-50/60"
                            )}
                        >
                          <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleProf(prof.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-4 h-4 accent-primary-500 mt-0.5 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-secondary-600">{prof.name}</p>
                              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200 whitespace-nowrap shrink-0">
                          {prof.matchLevel}
                        </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {prof.profession} • {prof.experienceYears} yrs exp
                            </p>
                            <div className="flex items-center gap-4 mt-1.5 text-xs text-secondary-500">
                        <span className="flex items-center gap-1">
                          Rating: {prof.rating?.toFixed(1)}
                          <StarRating rating={prof.rating} size={11} />
                        </span>
                              <span>{prof.skillsMatchPercentage}% Skills Match</span>
                              <span>Response: {prof.responseRate}</span>
                            </div>
                          </div>
                        </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-200 bg-white">
              <span className="text-xs text-gray-400 flex-1">
                {selectedProfIds.length} professional{selectedProfIds.length !== 1 ? "s" : ""} selected
              </span>
                  <button
                      onClick={() => setSelectedProfIds(professionals.map((p: any) => p.id))}
                      className="px-5 py-2 border border-gray-200 text-secondary-500 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Select All
                  </button>
                  <button
                      disabled={selectedProfIds.length === 0 || sendInvitesMutation.isPending}
                      onClick={handleSendInvites}
                      className="px-5 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    {sendInvitesMutation.isPending ? "Sending..." : "Send Invites"}
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}

function SystemAlertsTab() {
  const [typeFilter, setTypeFilter]         = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const { data: alerts, isLoading } = useSystemAlerts({
    type: typeFilter || undefined,
    priority: priorityFilter || undefined,
  });

  if (isLoading) return <LoadingSpinner message="Loading alerts..." className="py-12" />;

  return (
      <div>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-sm font-semibold text-secondary-600">Automated System Alerts</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              These alerts are automatically generated and sent to relevant users
            </p>
          </div>
          <div className="flex gap-2">
            <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-200 rounded-md px-3 py-2 text-sm text-secondary-500 bg-white"
            >
              <option value="">All Alert types</option>
              <option value="Payment">Payment</option>
              <option value="Subscription">Subscription</option>
              <option value="Job">Job</option>
              <option value="Report">Report</option>
            </select>
            <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="border border-gray-200 rounded-md px-3 py-2 text-sm text-secondary-500 bg-white"
            >
              <option value="">All Priority</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {!alerts?.length ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertTriangle size={52} className="text-yellow-400 mb-4" />
              <h3 className="text-lg font-bold text-secondary-600 mb-2">All Caught Up!</h3>
              <p className="text-sm text-gray-400 max-w-sm">
                No system alerts require your attention right now.
              </p>
            </div>
        ) : (
            <div className="flex flex-col gap-4">
              {alerts.map((alert: any) => {
                const isUrgent = alert.type === "Payment" || alert.priority === "HIGH";
                return (
                    <div
                        key={alert.id}
                        className={cn(
                            "border rounded-lg p-5",
                            isUrgent ? "bg-red-50/40 border-red-200" : "bg-white border-gray-200"
                        )}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle
                              size={16}
                              className={isUrgent ? "text-red-500 shrink-0" : "text-yellow-500 shrink-0"}
                          />
                          <p className={cn("text-sm font-semibold", isUrgent ? "text-red-600" : "text-secondary-600")}>
                            {alert.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                    <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        alert.priority === "HIGH" ? "bg-red-50 text-red-500" :
                            alert.priority === "MEDIUM" ? "bg-yellow-50 text-yellow-600" :
                                "bg-gray-100 text-gray-500"
                    )}>
                      {alert.priority}
                    </span>
                        </div>
                      </div>

                      <p className="text-sm text-secondary-500 mb-4 leading-relaxed">{alert.message}</p>

                      <div className="flex gap-2 flex-wrap">
                        {alert.actionLabel && alert.actionUrl && (
                            <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-md transition-colors">
                              {alert.actionLabel}
                            </button>
                        )}
                        {(alert.type === "Payment" || alert.type === "Subscription") && (
                            <>
                              <button className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-md transition-colors">
                                Contact company
                              </button>
                              <button className="px-4 py-2 border border-gray-200 text-secondary-500 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors">
                                View Account
                              </button>
                            </>
                        )}
                      </div>
                    </div>
                );
              })}
            </div>
        )}
      </div>
  );
}

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("announcements");

  return (
      <div className="px-4 py-8 lg:pl-16 lg:pr-8 lg:py-12 bg-white min-h-screen">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <button
              onClick={() => router.back()}
              className="text-secondary-500 hover:text-primary-500 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-secondary-600">Notifications & Messaging</h1>
        </div>

        <StatCards />
        <TabBar active={activeTab} onChange={setActiveTab} />

        {activeTab === "announcements" && <AnnouncementsTab />}
        {activeTab === "job-invites"   && <JobInvitesTab />}
        {activeTab === "system-alerts" && <SystemAlertsTab />}
      </div>
  );
}

