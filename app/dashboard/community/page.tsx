"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  useCommunityDashboard,
  useFlaggedContent,
  useApproveFlag,
  useRemoveFlag,
  useBulkApproveFlags,
  useBulkRemoveFlags,
  useCommunityUsers,
  useBanUser,
  useUnbanUser,
  useAllContent, useEditQuestion, useEditAnswer,
} from "@/hooks/use-community";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

type FlagReasonKey = "POTENTIAL_MISINFORMATION" | "SPAM" | "OFFENSIVE_LANGUAGE" | string;

const reasonColors: Record<string, string> = {
  MISINFORMATION: "bg-orange-50 text-orange-500 border border-orange-200",
  SPAM: "bg-pink-50 text-pink-500 border border-pink-200",
  OFFENSIVE_LANGUAGE: "bg-red-50 text-red-400 border border-red-200",
  COPYRIGHT: "bg-purple-50 text-purple-500 border border-purple-200",
  HARASSMENT: "bg-yellow-50 text-yellow-600 border border-yellow-200",
  OTHER: "bg-gray-100 text-gray-500 border border-gray-200",
};
function FilterDropdown({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}) {
  return (
      <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm text-secondary-500 hover:bg-gray-50 bg-white transition-colors whitespace-nowrap"
      >
        <option value="">{label}</option>
        {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
  );
}

function StatCards() {
  const { data, isLoading } = useCommunityDashboard();
  return (
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Pending Reviews", value: isLoading ? "..." : data?.pendingReviews ?? 0 },
          { label: "Active Bans", value: isLoading ? "..." : data?.activeBans ?? 0 },
          { label: "Total Flags", value: isLoading ? "..." : data?.totalFlags ?? 0 },
        ].map((s) => (
            <div key={s.label} className="border border-gray-200 rounded-lg p-6 flex flex-col items-center gap-2 bg-white">
              <span className="text-3xl font-bold text-primary-500">{s.value}</span>
              <span className="text-sm text-secondary-500">{s.label}</span>
            </div>
        ))}
      </div>
  );
}

type Tab = "flagged" | "all" | "users";

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs: { key: Tab; label: string }[] = [
    { key: "flagged", label: "Flagged Content" },
    { key: "all", label: "All Content" },
    { key: "users", label: "Users" },
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

function FlaggedContentTab() {
  const [search, setSearch] = useState("");
  const [reason, setReason] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [bulkMode, setBulkMode] = useState(false);

  const { data, isLoading } = useFlaggedContent({ search, reason, type, page });
  const approveFlag = useApproveFlag();
  const removeFlag = useRemoveFlag();
  const bulkApprove = useBulkApproveFlags();
  const bulkRemove = useBulkRemoveFlags();

  const items = data?.content ?? [];

  const toggleSelect = (id: number) =>
      setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleBulkApprove = () => {
    bulkApprove.mutate(selected, { onSuccess: () => { setSelected([]); setBulkMode(false); } });
  };

  const handleBulkRemove = () => {
    bulkRemove.mutate(selected, { onSuccess: () => { setSelected([]); setBulkMode(false); } });
  };

  return (
      <div>
        {bulkMode ? (
            <div className="flex items-center gap-4 mb-5 p-3 bg-white border border-gray-200 rounded-md">
              <input
                  type="checkbox"
                  checked={selected.length === items.length && items.length > 0}
                  onChange={(e) => setSelected(e.target.checked ? items.map((i: any) => i.flagId) : [])}
                  className="w-4 h-4 accent-primary-500"
              />
              <span className="text-sm text-secondary-500 flex-1">{selected.length} items selected</span>
              <button
                  onClick={handleBulkApprove}
                  disabled={bulkApprove.isPending}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
              >
                {bulkApprove.isPending ? "Processing..." : "Bulk approve"}
              </button>
              <button
                  onClick={handleBulkRemove}
                  disabled={bulkRemove.isPending}
                  className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
              >
                {bulkRemove.isPending ? "Processing..." : "Bulk Remove"}
              </button>
              <button
                  onClick={() => { setBulkMode(false); setSelected([]); }}
                  className="px-4 py-2 border border-gray-200 text-sm text-secondary-500 hover:bg-gray-50 rounded-md transition-colors"
              >
                Done
              </button>
            </div>
        ) : (
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 flex-1 max-w-xs bg-white">
                <Search size={15} className="text-gray-400 shrink-0" />
                <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                    className="text-sm outline-none flex-1 placeholder-gray-400"
                />
              </div>
              <FilterDropdown
                  label="All Reasons"
                  value={reason}
                  onChange={(v) => { setReason(v); setPage(0); }}
                  options={[
                    { label: "Misinformation", value: "MISINFORMATION" },
                    { label: "Spam", value: "SPAM" },
                    { label: "Offensive Language", value: "OFFENSIVE_LANGUAGE" },
                    { label: "Copyright", value: "COPYRIGHT" },
                    { label: "Harassment", value: "HARASSMENT" },
                    { label: "Other", value: "OTHER" },
                  ]}
              />
              <FilterDropdown
                  label="All Types"
                  value={type}
                  onChange={(v) => { setType(v); setPage(0); }}
                  options={[
                    { label: "Question", value: "QUESTION" },
                    { label: "Answer", value: "ANSWER" },
                  ]}
              />
              <button
                  onClick={() => setBulkMode(true)}
                  className="ml-auto px-4 py-2 border border-gray-200 rounded-md text-sm text-secondary-500 hover:bg-gray-50 transition-colors"
              >
                Bulk select
              </button>
            </div>
        )}

        {isLoading ? (
            <LoadingSpinner message="Loading flagged content..." className="py-12" />
        ) : (
            <div className="flex flex-col gap-4">
              {items.map((item: any) => {
                const isProcessing = approveFlag.isPending || removeFlag.isPending;
                const isSelected = selected.includes(item.flagId);

                return (
                    <div
                        key={item.flagId}
                        className={cn(
                            "border rounded-lg p-5 bg-white transition-colors",
                            isSelected ? "border-blue-400 bg-blue-50/40" : "border-gray-200"
                        )}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          {bulkMode && (
                              <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSelect(item.flagId)}
                                  className="w-4 h-4 accent-primary-500 mt-0.5"
                              />
                          )}
                          <div>
                            <p className="text-sm font-semibold text-secondary-600">
                              {item.author?.name ?? "Unknown"}
                              <span className="font-normal text-gray-400"> • {item.author?.role} • {item.timeAgo}</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Flagged by {item.flaggedByType === "AI_MODERATOR" ? "AI moderator" : item.flaggedBy?.name}
                            </p>
                          </div>
                        </div>
                        <span className={cn("text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap", reasonColors[item.reason] ?? "bg-gray-100 text-gray-500")}>
                    {item.reason?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())}
                  </span>
                      </div>

                      <div className="border border-gray-200 rounded-md p-4 mb-4 text-sm text-secondary-500 leading-relaxed">
                        {item.questionTitle && (
                            <p><span className="font-medium">Question: </span>{item.questionTitle}</p>
                        )}
                        <p className={item.questionTitle ? "mt-2" : ""}>
                          <span className="font-medium">{item.targetType === "QUESTION" ? "Question" : "Answer"}:</span> {item.content}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                            onClick={() => approveFlag.mutate(item.flagId)}
                            disabled={isProcessing}
                            className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                        >
                          {approveFlag.isPending ? <Loader2 size={14} className="animate-spin" /> : "Approve"}
                        </button>
                        <button
                            onClick={() => removeFlag.mutate(item.flagId)}
                            disabled={isProcessing}
                            className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                        >
                          {removeFlag.isPending ? <Loader2 size={14} className="animate-spin" /> : "Remove"}
                        </button>
                      </div>
                    </div>
                );
              })}

              {items.length === 0 && (
                  <div className="flex items-center justify-center py-16 text-gray-400 text-sm border border-gray-200 rounded-lg">
                    No flagged content at the moment.
                  </div>
              )}
            </div>
        )}

        {data?.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 border border-gray-200 rounded-md text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-secondary-500">
            Page {page + 1} of {data.totalPages}
          </span>
              <button
                  disabled={page + 1 >= data.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 border border-gray-200 rounded-md text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
        )}
      </div>
  );
}
function AllContentTab() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const { data, isLoading } = useAllContent({ search, type, page });
  const editQuestion = useEditQuestion();
  const editAnswer = useEditAnswer();

  const items = data?.content ?? [];

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditTitle(item.title ?? "");
    setEditContent(item.content ?? "");
  };

  const handleSave = (item: any) => {
    if (item.type === "ANSWER") {
      editAnswer.mutate(
          { id: item.id, data: { content: editContent } },
          { onSuccess: () => setEditingId(null) }
      );
    } else {
      editQuestion.mutate(
          { id: item.id, data: { title: editTitle, content: editContent } },
          { onSuccess: () => setEditingId(null) }
      );
    }
  };

  return (
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 flex-1 max-w-xs bg-white">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                className="text-sm outline-none flex-1 placeholder-gray-400"
            />
          </div>
          <FilterDropdown
              label="All Types"
              value={type}
              onChange={(v) => { setType(v); setPage(0); }}
              options={[
                { label: "Question", value: "QUESTION" },
                { label: "Answer", value: "ANSWER" },
              ]}
          />
        </div>

        {isLoading ? (
            <LoadingSpinner message="Loading content..." className="py-12" />
        ) : (
            <div className="flex flex-col gap-4">
              {items.map((item: any) => {
                const isEditing = editingId === item.id;
                const isSaving = editQuestion.isPending || editAnswer.isPending;

                return (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-5 bg-white">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="text-sm font-semibold text-secondary-600">
                            {item.author?.name}
                            <span className="font-normal text-gray-400"> • {item.author?.role} • {item.timeAgo}</span>
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Status: {item.status} • {item.likeCount} likes • {item.replyCount} {item.replyCount === 1 ? "reply" : "replies"}
                          </p>
                        </div>
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-50 text-green-600 border border-green-200 whitespace-nowrap">
                    {item.status}
                  </span>
                      </div>

                      {isEditing ? (
                          <div className="flex flex-col gap-3 mb-4">
                            {item.type === "QUESTION" && (
                                <div className="flex flex-col gap-1">
                                  <label className="text-xs font-medium text-secondary-500">Question</label>
                                  <input
                                      value={editTitle}
                                      onChange={(e) => setEditTitle(e.target.value)}
                                      className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none"
                                  />
                                </div>
                            )}
                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-medium text-secondary-500">
                                {item.type === "QUESTION" ? "Content" : "Answer"}
                              </label>
                              <textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="border border-gray-200 rounded-md px-3 py-2 text-sm outline-none resize-none h-24"
                              />
                            </div>
                          </div>
                      ) : (
                          <div className="border border-gray-200 rounded-md p-4 mb-4 text-sm text-secondary-500 leading-relaxed">
                            {item.title && (
                                <p><span className="font-medium">{item.type === "ANSWER" ? "Question: " : "Question: "}</span>{item.title}</p>
                            )}
                            <p className={item.title ? "mt-2" : ""}>
                              <span className="font-medium">{item.type === "ANSWER" ? "Answer: " : "Content: "}</span>{item.content}
                            </p>
                          </div>
                      )}

                      <div className="flex gap-3">
                        {isEditing ? (
                            <>
                              <button
                                  onClick={() => handleSave(item)}
                                  disabled={isSaving}
                                  className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                              >
                                {isSaving ? "Saving..." : "Save"}
                              </button>
                              <button
                                  onClick={() => setEditingId(null)}
                                  className="px-5 py-2 border border-gray-200 text-secondary-500 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                              >
                                Cancel
                              </button>
                            </>
                        ) : (
                            <button
                                onClick={() => startEdit(item)}
                                className="px-5 py-2 border border-gray-200 text-secondary-500 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                            >
                              Edit
                            </button>
                        )}
                      </div>
                    </div>
                );
              })}
              {items.length === 0 && (
                  <div className="flex items-center justify-center py-16 text-gray-400 text-sm border border-gray-200 rounded-lg">
                    No content found.
                  </div>
              )}
            </div>
        )}

        {data?.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="px-4 py-2 border border-gray-200 rounded-md text-sm disabled:opacity-40">Previous</button>
              <span className="px-4 py-2 text-sm text-secondary-500">Page {page + 1} of {data.totalPages}</span>
              <button disabled={page + 1 >= data.totalPages} onClick={() => setPage((p) => p + 1)} className="px-4 py-2 border border-gray-200 rounded-md text-sm disabled:opacity-40">Next</button>
            </div>
        )}
      </div>
  );
}

function UsersTab() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [bannedFilter, setBannedFilter] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [banConfirmId, setBanConfirmId] = useState<number | null>(null);
  const [banReason, setBanReason] = useState("");

  const { data, isLoading } = useCommunityUsers({ search, banned: bannedFilter, page });
  const banMutation = useBanUser();
  const unbanMutation = useUnbanUser();

  const users = data?.content ?? [];

  const handleBan = (userId: number) => {
    banMutation.mutate(
        { userId, reason: banReason },
        { onSuccess: () => { setBanConfirmId(null); setBanReason(""); } }
    );
  };

  return (
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 flex-1 max-w-xs bg-white">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                className="text-sm outline-none flex-1 placeholder-gray-400"
            />
          </div>
          <FilterDropdown
              label="All Status"
              value={bannedFilter === undefined ? "" : String(bannedFilter)}
              onChange={(v) => {
                setBannedFilter(v === "" ? undefined : v === "true");
                setPage(0);
              }}
              options={[
                { label: "Active", value: "false" },
                { label: "Banned", value: "true" },
              ]}
          />
        </div>

        {isLoading ? (
            <LoadingSpinner message="Loading users..." className="py-12" />
        ) : (
            <div className="flex flex-col gap-4">
              {users.map((user: any) => {
                const isBanned = user.banned;
                const isConfirming = banConfirmId === user.id;

                return (
                    <div
                        key={user.id}
                        className={cn(
                            "border rounded-lg p-5 transition-colors",
                            isBanned ? "bg-red-50/40 border-red-100" : "bg-white border-gray-200"
                        )}
                    >
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div>
                          <p className="text-sm font-semibold text-secondary-600">
                            {user.name}
                            <span className="font-normal text-gray-400"> • {user.role}</span>
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                        </div>
                        <span className={cn(
                            "text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap",
                            isBanned
                                ? "bg-red-50 text-red-500 border border-red-200"
                                : "bg-green-50 text-green-600 border border-green-200"
                        )}>
                    {isBanned ? "Banned" : "Active"}
                  </span>
                      </div>

                      <div className="grid grid-cols-2 border border-gray-200 rounded-md overflow-hidden mb-4">
                        {[
                          { label: "Flags received", value: user.flagsCount, color: user.flagsCount > 0 ? "text-pink-500" : "text-primary-500" },
                          { label: "Company", value: user.company ?? "Independent", color: "text-primary-500" },
                        ].map((stat, i) => (
                            <div key={stat.label} className={cn("flex flex-col items-center py-4 gap-1", i < 1 && "border-r border-gray-200")}>
                              <span className={cn("text-lg font-bold", stat.color)}>{stat.value}</span>
                              <span className="text-xs text-gray-400">{stat.label}</span>
                            </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push(`/dashboard/professionals/${user.id}`)}
                            className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-md transition-colors"
                        >
                          View Profile
                        </button>
                        {isBanned ? (
                            <button
                                onClick={() => unbanMutation.mutate(user.id)}
                                disabled={unbanMutation.isPending}
                                className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                            >
                              Unban
                            </button>
                        ) : (
                            <button
                                onClick={() => setBanConfirmId(isConfirming ? null : user.id)}
                                className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-md transition-colors"
                            >
                              Ban
                            </button>
                        )}
                      </div>

                      {isConfirming && (
                          <div className="mt-4 border border-red-200 bg-red-50 rounded-lg p-4">
                            <p className="text-sm font-semibold text-secondary-600 mb-1">⚠️ Confirm Ban</p>
                            <p className="text-sm text-secondary-500 mb-3">Are you sure you want to ban {user.name}?</p>
                            <textarea
                                placeholder="Reason for ban..."
                                value={banReason}
                                onChange={(e) => setBanReason(e.target.value)}
                                className="w-full border border-gray-200 rounded-md p-2 text-sm mb-3 resize-none h-16"
                            />
                            <div className="flex gap-3">
                              <button
                                  onClick={() => handleBan(user.id)}
                                  disabled={!banReason || banMutation.isPending}
                                  className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                              >
                                {banMutation.isPending ? "Banning..." : "Confirm ban"}
                              </button>
                              <button
                                  onClick={() => { setBanConfirmId(null); setBanReason(""); }}
                                  className="px-5 py-2 bg-secondary-600 hover:bg-secondary-700 text-white text-sm font-medium rounded-md transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                      )}
                    </div>
                );
              })}

              {users.length === 0 && (
                  <div className="flex items-center justify-center py-16 text-gray-400 text-sm border border-gray-200 rounded-lg">
                    No users found.
                  </div>
              )}
            </div>
        )}

        {data?.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="px-4 py-2 border border-gray-200 rounded-md text-sm disabled:opacity-40">Previous</button>
              <span className="px-4 py-2 text-sm text-secondary-500">Page {page + 1} of {data.totalPages}</span>
              <button disabled={page + 1 >= data.totalPages} onClick={() => setPage((p) => p + 1)} className="px-4 py-2 border border-gray-200 rounded-md text-sm disabled:opacity-40">Next</button>
            </div>
        )}
      </div>
  );
}
export default function AdminCommunityPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("flagged");

  return (
      <div className="px-4 py-8 lg:pl-16 lg:pr-8 lg:py-12 bg-white min-h-screen">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <button onClick={() => router.back()} className="text-secondary-500 hover:text-primary-500 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-secondary-600">Community</h1>
        </div>

        <StatCards />
        <TabBar active={activeTab} onChange={setActiveTab} />

        {activeTab === "flagged" && <FlaggedContentTab />}
        {activeTab === "all" && <AllContentTab />}
        {activeTab === "users" && <UsersTab />}
      </div>
  );
}