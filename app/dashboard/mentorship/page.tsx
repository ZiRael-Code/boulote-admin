"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search, ChevronDown, ArrowLeftRight, Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  useMentorshipDashboard,
  usePendingApplications,
  useActivePairs,
  useEligibleMentors,
  useEligibleMentorsForApplication,
  useMenteeRequirements,
  useAssignMentor,
  useReassignMentor,
  useEndMentorship,
  useDeclineRequest,
} from "@/hooks/use-mentorship";

function StarRating({ rating, max = 5, size = 14 }: { rating: number; max?: number; size?: number }) {
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

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
      <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 flex-1 max-w-xs bg-white">
        <Search size={15} className="text-gray-400 shrink-0" />
        <input
            type="text"
            placeholder="Search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="text-sm outline-none flex-1 placeholder-gray-400"
        />
      </div>
  );
}

function IndustryFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
      <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm text-secondary-500 bg-white"
      >
        <option value="">All Industry</option>
        <option value="TECH & DEVELOPMENT">Tech & Development</option>
        <option value="CREATIVE & DESIGN">Creative & Design</option>
        <option value="MARKETING & SALES">Marketing & Sales</option>
        <option value="FINANCIAL AND LEGAL">Financial & Legal</option>
        <option value="OPERATIONS">Operations</option>
        <option value="AI">AI</option>
      </select>
  );
}

function StatCards() {
  const { data, isLoading } = useMentorshipDashboard();
  return (
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Pending Applications", value: isLoading ? "..." : data?.pendingApplications ?? 0 },
          { label: "Active Pairs",         value: isLoading ? "..." : data?.activePairs ?? 0 },
          { label: "Available Mentors",    value: isLoading ? "..." : data?.availableMentors ?? 0 },
        ].map((s) => (
            <div key={s.label} className="border border-gray-200 rounded-lg p-6 flex flex-col items-center gap-2 bg-white">
              <span className="text-3xl font-bold text-primary-500">{s.value}</span>
              <span className="text-sm text-secondary-500">{s.label}</span>
            </div>
        ))}
      </div>
  );
}

type Tab = "eligible" | "pairs" | "requests";

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs: { key: Tab; label: string }[] = [
    { key: "eligible", label: "Eligible professionals" },
    { key: "pairs",    label: "Active pairs" },
    { key: "requests", label: "Requests and action" },
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

function EligibleProfessionalsTab({ onAssignDirect }: { onAssignDirect: (id: number) => void }) {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const assignMutation = useAssignMentor();
  const router = useRouter();

  const { data: mentors, isLoading } = useEligibleMentors({ search, industry });

  if (isLoading) return <LoadingSpinner message="Loading eligible professionals..." className="py-12" />;

  return (
      <div>
        <div className="flex items-center gap-3 mb-5">
          <SearchBar value={search} onChange={setSearch} />
          <IndustryFilter value={industry} onChange={setIndustry} />
        </div>

        {!mentors?.length ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm border border-gray-200 rounded-lg">
              No eligible professionals found.
            </div>
        ) : (
            <div className="flex flex-col gap-4">
              {mentors.map((pro: any) => (
                  <div key={pro.id} className="border border-gray-200 rounded-lg p-5 bg-white">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <p className="text-sm font-semibold text-secondary-600">
                          {pro.name}
                          <span className="font-normal text-gray-400"> • {pro.role}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Company: {pro.company} • Current Mentees: {pro.currentMentees}
                        </p>
                      </div>
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-50 text-green-600 border border-green-200 whitespace-nowrap">
                  {pro.matchLevel}
                </span>
                    </div>

                    <div className="grid grid-cols-3 border border-gray-200 rounded-md overflow-hidden mb-4">
                      <div className="flex flex-col items-center py-4 gap-1 border-r border-gray-200">
                        <span className="text-sm font-semibold text-secondary-600">{pro.rating?.toFixed(1)}/5</span>
                        <StarRating rating={pro.rating} />
                      </div>
                      <div className="flex flex-col items-center py-4 gap-1 border-r border-gray-200">
                        <span className="text-sm font-semibold text-secondary-600">{pro.currentMentees}</span>
                        <span className="text-xs text-gray-400">Current Mentees</span>
                      </div>
                      <div className="flex flex-col items-center py-4 gap-1">
                        <span className="text-sm font-semibold text-secondary-600">{pro.availability}</span>
                        <span className="text-xs text-gray-400">Availability</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                          onClick={() => router.push(`/dashboard/professionals/${pro.id}/assign-mentor`)}
                          className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md transition-colors"
                      >
                        Assign as mentor
                      </button>
                      <button
                          onClick={() => router.push(`/dashboard/professionals/${pro.id}`)}
                          className="px-5 py-2 border border-gray-200 text-secondary-500 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                      >
                        View profile
                      </button>
                    </div>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
}

function ActivePairsTab() {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [reassigningId, setReassigningId] = useState<number | null>(null);
  const [selectedNewMentorId, setSelectedNewMentorId] = useState<number | null>(null);

  const { data: pairs, isLoading } = useActivePairs({ search, industry });
  const { data: eligibleMentors } = useEligibleMentors({});
  const endMutation = useEndMentorship();
  const reassignMutation = useReassignMentor();
  const router = useRouter();

  if (isLoading) return <LoadingSpinner message="Loading active pairs..." className="py-12" />;

  return (
      <div>
        <div className="flex items-center gap-3 mb-5">
          <SearchBar value={search} onChange={setSearch} />
          <IndustryFilter value={industry} onChange={setIndustry} />
        </div>

        {!pairs?.length ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm border border-gray-200 rounded-lg">
              No active mentorship pairs.
            </div>
        ) : (
            <div className="flex flex-col gap-4">
              {pairs.map((pair: any) => (
                  <div key={pair.id} className="border border-gray-200 rounded-lg p-5 bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-semibold text-secondary-600">Mentorship pair</p>
                      <p className="text-sm text-gray-400">Started: {pair.startedAt}</p>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 border border-gray-200 rounded-md p-4">
                        <p className="text-xs font-medium text-green-500 mb-2">Mentor</p>
                        <p className="text-sm font-semibold text-secondary-600">
                          {pair.mentor?.name}
                          <span className="font-normal text-gray-400"> • {pair.mentor?.role}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{pair.mentor?.experienceYears} years exp • {pair.mentor?.company}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-secondary-500">{pair.mentorRating?.toFixed(1)}</span>
                          <StarRating rating={pair.mentorRating ?? 0} size={13} />
                        </div>
                      </div>

                      <div className="text-gray-400 shrink-0">
                        <ArrowLeftRight size={18} />
                      </div>

                      <div className="flex-1 border border-gray-200 rounded-md p-4">
                        <p className="text-xs font-medium text-primary-500 mb-2">Mentee</p>
                        <p className="text-sm font-semibold text-secondary-600">
                          {pair.mentee?.name}
                          <span className="font-normal text-gray-400"> • {pair.mentee?.role}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{pair.mentee?.experienceYears} years exp • {pair.mentee?.company}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-secondary-500">{pair.completedSessions} sessions</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mb-4 text-xs text-secondary-500">
                      <span><span className="font-medium">Sessions:</span> {pair.completedSessions} completed</span>
                      <span><span className="font-medium">Last activity:</span> {pair.lastActivity}</span>
                    </div>

                    {reassigningId === pair.id ? (
                        <div className="border border-gray-200 rounded-md p-4 mb-4 flex flex-col gap-3">
                          <p className="text-sm font-medium text-secondary-600">Select new mentor:</p>
                          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                            {(eligibleMentors ?? []).map((m: any) => (
                                <div
                                    key={m.id}
                                    onClick={() => setSelectedNewMentorId(m.id)}
                                    className={cn(
                                        "flex items-center gap-3 p-3 border rounded-md cursor-pointer",
                                        selectedNewMentorId === m.id ? "border-primary-500 bg-primary-50" : "border-gray-200"
                                    )}
                                >
                                  <input type="radio" checked={selectedNewMentorId === m.id} readOnly className="w-4 h-4" />
                                  <div>
                                    <p className="text-sm font-medium text-secondary-600">{m.name} • {m.role}</p>
                                    <p className="text-xs text-gray-400">Rating: {m.rating?.toFixed(1)} • {m.currentMentees} mentees</p>
                                  </div>
                                </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <button
                                disabled={!selectedNewMentorId || reassignMutation.isPending}
                                onClick={() => reassignMutation.mutate(
                                    { applicationId: pair.id, newMentorId: selectedNewMentorId! },
                                    { onSuccess: () => { setReassigningId(null); setSelectedNewMentorId(null); } }
                                )}
                                className="px-4 py-2 bg-primary-500 text-white text-sm rounded-md disabled:opacity-50"
                            >
                              {reassignMutation.isPending ? "Reassigning..." : "Confirm Reassign"}
                            </button>
                            <button
                                onClick={() => { setReassigningId(null); setSelectedNewMentorId(null); }}
                                className="px-4 py-2 border border-gray-200 text-secondary-500 text-sm rounded-md"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                    ) : null}

                    <div className="flex gap-3">
                      <button
                          onClick={() => setReassigningId(reassigningId === pair.id ? null : pair.id)}
                          className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md transition-colors"
                      >
                        Reassign mentor
                      </button>
                      <button
                          onClick={() => {
                            if (confirm("End this mentorship?")) {
                              endMutation.mutate(pair.id);
                            }
                          }}
                          disabled={endMutation.isPending}
                          className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                      >
                        End mentorship
                      </button>
                      <button
                          onClick={() => router.push(`/dashboard/professionals/${pair.mentee?.id}`)}
                          className="px-5 py-2 border border-gray-200 text-secondary-500 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                      >
                        View details
                      </button>
                    </div>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
}

function RequestsTab({ onFindMentor }: { onFindMentor: (req: any) => void }) {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const declineMutation = useDeclineRequest();
  const router = useRouter();

  const { data: requests, isLoading } = usePendingApplications({ search, industry });

  if (isLoading) return <LoadingSpinner message="Loading requests..." className="py-12" />;

  return (
      <div>
        <div className="flex items-center gap-3 mb-5">
          <SearchBar value={search} onChange={setSearch} />
          <IndustryFilter value={industry} onChange={setIndustry} />
        </div>

        {!requests?.length ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm border border-gray-200 rounded-lg">
              No pending requests.
            </div>
        ) : (
            <div className="flex flex-col gap-4">
              {requests.map((req: any) => (
                  <div key={req.id} className="border border-gray-200 rounded-lg p-5 bg-white">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <p className="text-sm font-semibold text-secondary-600">
                          {req.professional?.name}
                          <span className="font-normal text-gray-400"> • {req.professional?.role}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Applied: {req.appliedAt} • Experience: {req.experienceYears} years • Company: {req.company}
                        </p>
                      </div>
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-200 whitespace-nowrap">
                  Pending
                </span>
                    </div>

                    <div className="grid grid-cols-4 border border-gray-200 rounded-md overflow-hidden mb-4">
                      <div className="flex flex-col items-center py-4 gap-1 border-r border-gray-200">
                        <span className="text-sm font-semibold text-secondary-600">{req.rating?.toFixed(1)}/5</span>
                        <StarRating rating={req.rating ?? 0} />
                      </div>
                      <div className="flex flex-col items-center py-4 gap-1 border-r border-gray-200">
                        <span className="text-sm font-semibold text-secondary-600">{req.postsCount}</span>
                        <span className="text-xs text-gray-400">Q&A Posts</span>
                      </div>
                      <div className="flex flex-col items-center py-4 gap-1 border-r border-gray-200">
                        <span className="text-sm font-semibold text-secondary-600">{req.responseRate}</span>
                        <span className="text-xs text-gray-400">Response rate</span>
                      </div>
                      <div className="flex flex-col items-center py-4 gap-1">
                        <span className="text-sm font-semibold text-secondary-600">{req.activity}</span>
                        <span className="text-xs text-gray-400">Activity</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                          onClick={() => onFindMentor(req)}
                          className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md transition-colors"
                      >
                        Find mentor
                      </button>
                      <button
                          onClick={() => {
                            if (confirm("Decline this request?")) {
                              declineMutation.mutate(req.id);
                            }
                          }}
                          disabled={declineMutation.isPending}
                          className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                      >
                        Decline request
                      </button>
                      <button
                          onClick={() => router.push(`/dashboard/professionals/${req.professional?.id}`)}
                          className="px-5 py-2 border border-gray-200 text-secondary-500 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                      >
                        View profile
                      </button>
                    </div>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
}

function FindMentorView({
                          request,
                          onBack,
                          onAssigned,
                        }: {
  request: any;
  onBack: () => void;
  onAssigned: () => void;
}) {
  const [selectedMentorId, setSelectedMentorId] = useState<number | null>(null);
  const assignMutation = useAssignMentor();

  const { data: mentors, isLoading: isLoadingMentors } = useEligibleMentorsForApplication(request.id, true);
  const { data: requirements, isLoading: isLoadingReqs } = useMenteeRequirements(request.id, true);

  const handleAssign = () => {
    if (!selectedMentorId) return;
    assignMutation.mutate(
        { applicationId: request.id, mentorId: selectedMentorId },
        { onSuccess: onAssigned }
    );
  };

  return (
      <div className="px-4 py-8 lg:pl-16 lg:pr-8 lg:py-12 bg-white min-h-screen">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <button onClick={onBack} className="text-secondary-500 hover:text-primary-500 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-secondary-600">Find mentor</h1>
        </div>

        <p className="text-base font-semibold text-secondary-600 mb-5">
          Assign Mentor to {request.professional?.name}
        </p>

        {isLoadingReqs ? (
            <LoadingSpinner className="py-8" />
        ) : requirements ? (
            <div className="border border-gray-200 rounded-lg p-5 bg-gray-50/50 mb-7">
              <p className="text-sm font-semibold text-secondary-600 mb-4">Mentee Requirements</p>
              <div className="grid grid-cols-2 gap-y-2 gap-x-8">
                <div className="flex flex-col gap-2">
                  {[
                    `Industry: ${requirements.industry}`,
                    `Focus: ${requirements.focus}`,
                    `Experience level: ${requirements.experienceLevel} year(s)`,
                  ].map((r) => (
                      <div key={r} className="flex items-center gap-2 text-sm text-secondary-500">
                        <span className="text-primary-500">✓</span> {r}
                      </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Resume Uploaded", value: requirements.resumeUploaded },
                    { label: "Portfolio / Work samples", value: requirements.portfolioUploaded },
                    { label: "References", value: requirements.referencesProvided },
                  ].map(({ label, value }) => (
                      <div key={label} className="flex items-center gap-2 text-sm text-secondary-500">
                        <span className={value ? "text-primary-500" : "text-gray-300"}>✓</span>
                        {label}{!value && " (Not provided)"}
                      </div>
                  ))}
                </div>
              </div>
            </div>
        ) : null}

        <p className="text-base font-semibold text-secondary-600 mb-4">Recommended Mentors</p>

        {isLoadingMentors ? (
            <LoadingSpinner className="py-8" />
        ) : !mentors?.length ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm border border-gray-200 rounded-lg mb-8">
              No eligible mentors found for this application.
            </div>
        ) : (
            <div className="flex flex-col gap-3 mb-8">
              {mentors.map((mentor: any) => {
                const isSelected = selectedMentorId === mentor.id;
                const isPerfect = mentor.matchLevel === "Perfect match";
                return (
                    <div
                        key={mentor.id}
                        onClick={() => setSelectedMentorId(mentor.id)}
                        className={cn(
                            "border rounded-lg p-4 cursor-pointer transition-colors",
                            isSelected ? "border-primary-400 bg-blue-50/40" : "border-gray-200 bg-white hover:border-gray-300"
                        )}
                    >
                      <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="w-4 h-4 accent-primary-500 mt-1 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <p className="text-sm font-semibold text-secondary-600">
                                {mentor.name}
                                <span className="font-normal text-gray-400"> • {mentor.role}</span>
                              </p>
                            </div>
                            <span className={cn(
                                "text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap",
                                isPerfect
                                    ? "bg-green-50 text-green-600 border border-green-200"
                                    : "bg-yellow-50 text-yellow-600 border border-yellow-200"
                            )}>
                        {mentor.matchLevel}
                      </span>
                          </div>
                          <div className="flex items-start gap-8">
                            <div>
                              <p className="text-xs font-medium text-secondary-600 mb-1">Rating: {mentor.rating?.toFixed(1)}</p>
                              <StarRating rating={mentor.rating ?? 0} size={13} />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-secondary-600 mb-1">Available</p>
                              <p className="text-xs text-secondary-500">{mentor.availability}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-secondary-600 mb-1">Current Mentees</p>
                              <p className="text-xs text-secondary-500">{mentor.currentMentees}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                );
              })}
            </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
              onClick={onBack}
              className="px-8 py-2.5 border border-gray-200 text-secondary-500 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
              onClick={handleAssign}
              disabled={!selectedMentorId || assignMutation.isPending}
              className="px-8 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-sm font-medium rounded-md transition-colors"
          >
            {assignMutation.isPending ? "Assigning..." : "Assign Mentor"}
          </button>
        </div>
      </div>
  );
}

export default function AdminMentorshipPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("eligible");
  const [view, setView] = useState<"main" | "find-mentor">("main");
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [successBanner, setSuccessBanner] = useState(false);

  const handleFindMentor = (req: any) => {
    setSelectedRequest(req);
    setView("find-mentor");
  };

  const handleAssigned = () => {
    setView("main");
    setActiveTab("pairs");
    setSuccessBanner(true);
    setTimeout(() => setSuccessBanner(false), 8000);
  };

  if (view === "find-mentor" && selectedRequest) {
    return (
        <FindMentorView
            request={selectedRequest}
            onBack={() => setView("main")}
            onAssigned={handleAssigned}
        />
    );
  }

  return (
      <div className="px-4 py-8 lg:pl-16 lg:pr-8 lg:py-12 bg-white min-h-screen">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <button onClick={() => router.back()} className="text-secondary-500 hover:text-primary-500 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-secondary-600">Mentorship Management</h1>
        </div>

        {successBanner && (
            <div className="border border-green-300 bg-green-50 rounded-lg p-5 mb-6">
              <p className="text-sm font-semibold text-green-700 mb-1">✅ Mentor Successfully Assigned</p>
              <p className="text-sm text-green-600 mb-3">
                The mentor has been successfully assigned and will be notified.
              </p>
              <button
                  onClick={() => setSuccessBanner(false)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-md transition-colors"
              >
                Dismiss
              </button>
            </div>
        )}

        <StatCards />
        <TabBar active={activeTab} onChange={setActiveTab} />

        {activeTab === "eligible" && <EligibleProfessionalsTab onAssignDirect={(id) => console.log(id)} />}
        {activeTab === "pairs"    && <ActivePairsTab />}
        {activeTab === "requests" && <RequestsTab onFindMentor={handleFindMentor} />}
      </div>
  );
}