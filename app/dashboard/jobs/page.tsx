"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import Button from "@/components/ui/button";
import {
  usePendingJobs,
  useOngoingJobs,
  useAIReviewJobs,
  useCompletedJobs,
} from "@/hooks/use-jobs";
import type { Job, AIReviewJob } from "@/lib/types/job";
import { formatRelativeTime } from "@/lib/utils/format-date";

type TabType = "pending" | "ai-review" | "ongoing" | "completed";

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("pending");

  const { data: pendingData } = usePendingJobs(activeTab === "pending");
  const { data: aiReviewData } = useAIReviewJobs(activeTab === "ai-review");
  const { data: completedData } = useCompletedJobs(activeTab === "completed");
  return (
    <div className="flex flex-col gap-6 px-4 py-8 lg:pl-16 lg:pr-8 lg:py-16">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-[32px] font-semibold leading-[38.4px] tracking-[1px] text-secondary-500">
            Job Management
          </h1>
          <p className="text-xl font-medium leading-6 tracking-[0.1px] text-secondary-500">
            Manage job requests, AI shortlisting, and professional assignments
          </p>
        </div>
        <div className="h-px w-full bg-border-500" />
      </div>

      <div className="flex flex-col gap-8">
        <div className="border-b border-border-500 flex gap-8 h-16 items-center">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex gap-4 items-center px-6 py-4 h-full border-b-2 transition-colors ${
              activeTab === "pending"
                ? "border-primary-500"
                : "border-transparent"
            }`}
          >
            <span
              className={`text-lg font-normal ${
                activeTab === "pending"
                  ? "text-primary-500"
                  : "text-secondary-500"
              }`}
            >
              Pending Requests
            </span>
            {pendingData && pendingData.totalElements > 0 && (
              <div className="bg-primary-200 rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-base font-medium text-primary-900">
                  {pendingData.totalElements}
                </span>
              </div>
            )}
          </button>

          <button
            onClick={() => setActiveTab("ai-review")}
            className={`flex gap-4 items-center px-6 py-4 h-full border-b-2 transition-colors ${
              activeTab === "ai-review"
                ? "border-primary-500"
                : "border-transparent"
            }`}
          >
            <span
              className={`text-lg font-normal ${
                activeTab === "ai-review"
                  ? "text-primary-500"
                  : "text-secondary-500"
              }`}
            >
              AI Review
            </span>
            {aiReviewData && aiReviewData.length > 0 && (
              <div className="bg-neutral-200 rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-base font-medium text-primary-900">
                  {aiReviewData.length}
                </span>
              </div>
            )}
          </button>

          <button
            onClick={() => setActiveTab("ongoing")}
            className={`flex gap-4 items-center px-6 py-4 h-full border-b-2 transition-colors ${
              activeTab === "ongoing"
                ? "border-primary-500"
                : "border-transparent"
            }`}
          >
            <span
              className={`text-lg font-normal ${
                activeTab === "ongoing"
                  ? "text-primary-500"
                  : "text-secondary-500"
              }`}
            >
              Ongoing Jobs
            </span>
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`flex gap-4 items-center px-6 py-4 h-full border-b-2 transition-colors ${
              activeTab === "completed"
                ? "border-primary-500"
                : "border-transparent"
            }`}
          >
            <span
              className={`text-lg font-normal ${
                activeTab === "completed"
                  ? "text-primary-500"
                  : "text-secondary-500"
              }`}
            >
              Completed
            </span>
            {completedData && completedData.totalElements > 0 && (
              <div className="bg-neutral-200 rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-base font-medium text-primary-900">
                  {completedData.totalElements}
                </span>
              </div>
            )}
          </button>
        </div>

        {activeTab === "pending" && <PendingRequestsTab />}
        {activeTab === "ai-review" && <AIReviewTab />}
        {activeTab === "ongoing" && <OngoingJobsTab />}
        {activeTab === "completed" && <CompletedTab />}
      </div>
    </div>
  );
}

function PendingRequestsTab() {
  const { data, isLoading, error } = usePendingJobs(true);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-500">Loading pending jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-error-500 text-lg font-medium mb-2">
            Failed to load pending jobs
          </p>
          <p className="text-neutral-500">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!data || data.empty) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-neutral-500 text-lg">No pending jobs found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-center flex-wrap">
        <div className="border border-neutral-500 rounded-md h-12 px-6 py-4 flex items-center justify-between w-[278px]">
          <span className="text-lg font-light text-secondary-500">Search</span>
          <Search className="w-6 h-6" />
        </div>

        <button className="border border-neutral-500 rounded-md px-4 py-2 flex gap-4 items-center">
          <span className="text-base font-normal text-neutral-500">
            All categories
          </span>
          <ChevronDown className="w-8 h-8" />
        </button>

        <button className="border border-neutral-500 rounded-md px-4 py-2 flex gap-4 items-center">
          <span className="text-base font-normal text-neutral-500">
            All Budgets
          </span>
          <ChevronDown className="w-8 h-8" />
        </button>

        <button className="border border-neutral-500 rounded-md h-12 px-6 py-4 flex items-center">
          <span className="text-lg font-light text-secondary-500">Export</span>
        </button>

        <Button className="bg-primary-500 text-white px-7 py-3 rounded-md h-auto">
          <span className="text-base font-medium capitalize">
            bulk AI process
          </span>
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {data.content && data.content.length > 0 ? (
          data.content.map((job) => (
            <PendingJobCard key={job.id} job={job} />
          ))
        ) : (
          <p className="text-neutral-500 text-lg">No pending jobs found</p>
        )}
      </div>
    </div>
  );
}

function PendingJobCard({ job }: { job: Job }) {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "high":
        return "text-error-500";
      case "normal":
        return "text-warning-500";
      default:
        return "text-success-500";
    }
  };

  return (
    <div className="border border-border-500 rounded-md p-6 flex flex-col gap-4">
      <div className="flex gap-4 items-start justify-between">
        <div className="flex flex-col gap-2 flex-1">
          <h3 className="text-xl font-medium text-secondary-500">
            {job.title}
          </h3>
          <div className="flex flex-col gap-4">
            <p className="text-base font-normal text-secondary-500">
              {job.companyName}
            </p>
            <p className="text-xs font-normal text-neutral-500">
              ID: {job.jobId}
            </p>
          </div>
        </div>
        <div className="bg-success-50 px-2 py-2 rounded-[15px] h-8 flex items-center justify-center">
          <span className="text-sm font-normal text-success-800">
            Ready for review
          </span>
        </div>
      </div>

      <div className="flex gap-20">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">BUDGET</p>
          <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
            {job.budget}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">DURATION</p>
          <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
            {job.duration}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">SUBMITTED</p>
          <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
            {formatRelativeTime(job.submittedAt)}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">URGENCY</p>
          <p
            className={`text-sm font-normal tracking-[0.1px] ${getUrgencyColor(
              job.urgency
            )}`}
          >
            {job.urgency}
          </p>
        </div>
      </div>

      <p className="text-base font-normal text-neutral-500 leading-[19.2px]">
        {job.description}
      </p>

      <div className="flex gap-4 items-center self-end">
        <Button className="bg-primary-500 text-white px-7 py-3 rounded-md h-12">
          <span className="text-lg font-medium">View Details</span>
        </Button>
        <Button
          variant="outline"
          className="border border-neutral-500 px-7 py-3 rounded-md h-12"
        >
          <span className="text-lg font-medium">Start AI Shortlisting</span>
        </Button>
      </div>
    </div>
  );
}

function AIReviewTab() {
  const { data, isLoading, error } = useAIReviewJobs(true);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-500">Loading AI review jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-error-500 text-lg font-medium mb-2">
            Failed to load AI review jobs
          </p>
          <p className="text-neutral-500">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-neutral-500 text-lg">No AI review jobs found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-center">
        <button className="border border-neutral-500 rounded-md px-4 py-2 flex gap-4 items-center">
          <span className="text-base font-normal text-neutral-500">
            All Jobs
          </span>
          <ChevronDown className="w-8 h-8" />
        </button>

        <div className="border border-neutral-500 rounded-md h-12 px-6 py-4 flex items-center justify-between flex-1 max-w-md">
          <span className="text-lg font-light text-secondary-500">Search</span>
          <Search className="w-6 h-6" />
        </div>

        <Button
          variant="outline"
          className="border border-neutral-500 px-7 py-3"
        >
          Refresh status
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {data.map((job) => (
          <AIReviewJobCard key={job.jobId} job={job} />
        ))}
      </div>
    </div>
  );
}

function AIReviewJobCard({ job }: { job: AIReviewJob }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="border border-border-500 rounded-md p-6 flex flex-col gap-4">
        <div className="flex gap-4 items-start justify-between">
          <div className="flex flex-col gap-2 flex-1">
            <h3 className="text-xl font-medium text-secondary-500">
              {job.title}
            </h3>
            <div className="flex flex-col gap-4">
              <p className="text-base font-normal text-secondary-500">
                {job.companyName}
              </p>
              <p className="text-xs font-normal text-neutral-500">
                ID: {job.jobId}
              </p>
            </div>
          </div>
          <div className="bg-success-50 px-2 py-2 rounded-[15px]">
            <span className="text-sm font-normal text-success-800">
              Ready for review
            </span>
          </div>
        </div>

        <div className="flex gap-20">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-normal text-neutral-500">
              AI MATCH SCORE
            </p>
            <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
              {job.aiMatchScore}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-normal text-neutral-500">PROCESSED</p>
            <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
              {job.processedTime}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-normal text-neutral-500">
              CANDIDATES FOUND
            </p>
            <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
              {job.candidatesFound} Professional{job.candidatesFound !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-normal text-neutral-500">URGENCY</p>
            <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
              {job.urgency}
            </p>
          </div>
        </div>

        <div className="flex gap-4 self-end">
          <Button className="bg-primary-500 text-white px-7 py-3">
            View Details
          </Button>
          <Button
            variant="outline"
            className="border border-neutral-500 px-7 py-3"
          >
            Processing ...
          </Button>
        </div>
      </div>

      {job.shortlistedProfessionals && job.shortlistedProfessionals.length > 0 && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium text-secondary-500">
              AI Shortlisted Professional
              <span className="ml-3 bg-primary-200 px-3 py-1 rounded-full text-sm">
                AI Selected
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {job.shortlistedProfessionals.map((professional, index) => (
              <ProfessionalCard key={index} professional={professional} />
            ))}
          </div>

          <div className="flex gap-4 justify-end">
            <Button className="bg-primary-500 text-white px-7 py-3">
              Assign selected professionals
            </Button>
            <Button
              variant="outline"
              className="border border-neutral-500 px-7 py-3"
            >
              Reject all and manually select
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfessionalCard({
  professional,
}: {
  professional: {
    initials: string;
    name: string;
    role: string;
    reviewCount: number;
    successRate: number;
    yearsExperience: number;
    projectsCompleted: number;
    aiMatch: string;
    skills: string[];
  };
}) {
  return (
    <div className="border border-border-500 rounded-md p-6 flex gap-4 items-start">
      <div className="flex-1 flex gap-4">
        <div className="w-[70px] h-[70px] rounded-full bg-[#CFD3D7] flex items-center justify-center shrink-0">
          <span className="text-[16.8px] font-medium">{professional.initials}</span>
        </div>

        <div className="flex flex-col gap-6 flex-1">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-4">
              <p className="text-base font-medium text-secondary-500">
                {professional.name}
              </p>
              <p className="text-base font-normal text-neutral-500">
                {professional.role}
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-warning-500 text-2xl">★</span>
              <p className="text-base font-normal text-neutral-500">
                ({professional.reviewCount} reviews) • {professional.successRate}% success rate
              </p>
            </div>
          </div>

          <div className="flex gap-16">
            <div className="flex flex-col gap-2 items-center">
              <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                {professional.yearsExperience}+
              </p>
              <p className="text-xs font-normal text-neutral-500">YEARS EXP</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                {professional.projectsCompleted}
              </p>
              <p className="text-xs font-normal text-neutral-500">PROJECTS</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                {professional.aiMatch}
              </p>
              <p className="text-xs font-normal text-neutral-500">AI MATCH</p>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            {professional.skills.map((skill, index) => (
              <div
                key={index}
                className="bg-[rgba(204,226,243,0.29)] px-2 py-2 rounded-[15px]"
              >
                <span className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                  {skill}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Button className="bg-primary-500 text-white flex-1 h-12">
              <span className="text-lg font-medium">View Details</span>
            </Button>
            <Button
              variant="outline"
              className="border border-neutral-500 flex-1 h-[46px]"
            >
              <span className="text-lg font-medium">Processing ...</span>
            </Button>
          </div>
        </div>
      </div>

      <input type="checkbox" className="w-6 h-6 shrink-0" />
    </div>
  );
}

function OngoingJobsTab() {
  const { data, isLoading, error } = useOngoingJobs(true);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-500">Loading ongoing jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-error-500 text-lg font-medium mb-2">
            Failed to load ongoing jobs
          </p>
          <p className="text-neutral-500">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!data || data.empty) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-neutral-500 text-lg">No ongoing jobs found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-center">
        <button className="border border-neutral-500 rounded-md px-4 py-2 flex gap-4 items-center">
          <span className="text-base font-normal text-neutral-500">
            All Status
          </span>
          <ChevronDown className="w-8 h-8" />
        </button>

        <button className="border border-neutral-500 rounded-md px-4 py-2 flex gap-4 items-center">
          <span className="text-base font-normal text-neutral-500">
            All Professionals
          </span>
          <ChevronDown className="w-8 h-8" />
        </button>

        <div className="border border-neutral-500 rounded-md h-12 px-6 py-4 flex items-center justify-between flex-1 max-w-md">
          <span className="text-lg font-light text-secondary-500">Search</span>
          <Search className="w-6 h-6" />
        </div>

        <Button
          variant="outline"
          className="border border-neutral-500 text-border-neutral-800 px-7 py-3"
        >
          Progress report
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {data.content && data.content.length > 0 ? (
          data.content.map((job) => (
            <OngoingJobCard key={job.id} job={job} />
          ))
        ) : (
          <p className="text-neutral-500 text-lg">No ongoing jobs found</p>
        )}
      </div>
    </div>
  );
}

function OngoingJobCard({ job }: { job: Job }) {
  const isAtRisk = job.progressPercentage < 50 && job.dueDate;
  const dueDate = job.dueDate ? new Date(job.dueDate) : null;
  const now = new Date();
  const daysUntilDue = dueDate
    ? Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="border border-border-500 rounded-md p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-medium text-secondary-500 mb-2">
            {job.title}
          </h3>
          <p className="text-base text-secondary-500 mb-1">
            {job.companyName}
            {job.assignedProfessionalName &&
              ` → ${job.assignedProfessionalName}`}
          </p>
          <p className="text-xs text-neutral-500">ID: {job.jobId}</p>
        </div>
        <div
          className={`px-2 py-2 rounded-[15px] ${
            isAtRisk
              ? "bg-warning-50 text-warning-600"
              : "bg-success-50 text-success-800"
          }`}
        >
          <span className="text-sm font-normal">
            {isAtRisk ? "At risk" : "Ready for review"}
          </span>
        </div>
      </div>

      <div className="flex gap-20">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">
            PROJECT PROGRESS
          </p>
          <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
            {job.progressPercentage}% Complete
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">STARTED</p>
          <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
            {job.startDate
              ? formatRelativeTime(job.startDate)
              : "Not started"}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">
            {isAtRisk ? "DUE DATE" : "BUDGET USED"}
          </p>
          <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
            {isAtRisk && daysUntilDue !== null
              ? `In ${daysUntilDue} ${daysUntilDue === 1 ? "day" : "days"}`
              : job.actualBudget
                ? `${job.actualBudget} / ${job.budget}`
                : job.budget}
          </p>
        </div>
        {isAtRisk && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-normal text-neutral-500">ISSUE</p>
            <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
              Client Feedback delay
            </p>
          </div>
        )}
      </div>

      <div className="w-full bg-neutral-200 h-2 rounded-full">
        <div
          className="bg-primary-500 h-2 rounded-full transition-all"
          style={{ width: `${job.progressPercentage}%` }}
        />
      </div>

      {job.assignedProfessionalName && (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center">
            <span className="text-sm font-medium">
              {job.assignedProfessionalName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </span>
          </div>
          <div className="flex-1">
            <h4 className="font-medium">{job.assignedProfessionalName}</h4>
            <div className="flex items-center gap-2">
              <span className="text-warning-500">★</span>
              <span className="text-sm text-neutral-500">
                {job.professionalRating
                  ? `${job.professionalRating} • Last active: ${formatRelativeTime(job.submittedAt)}`
                  : "No rating"}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 self-end">
        <Button
          variant="outline"
          className="border border-neutral-500 text-border-neutral-800 px-7 py-3"
        >
          {isAtRisk ? "View issues" : "Track Progress"}
        </Button>
        <Button
          variant="outline"
          className="border border-neutral-500 text-border-neutral-800 px-7 py-3"
        >
          {isAtRisk ? "Contact parties" : "View messages"}
        </Button>
        <Button className="bg-primary-500 text-white px-7 py-3">
          {isAtRisk ? "Escalate issue" : "Manage Jobs"}
        </Button>
      </div>
    </div>
  );
}

function CompletedTab() {
  const { data, isLoading, error } = useCompletedJobs(true);

  // Debug: Log the actual data received
  if (data) {
    console.log("Completed Tab - Data received:", {
      totalElements: data.totalElements,
      empty: data.empty,
      contentLength: data.content?.length,
      content: data.content,
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-500">Loading completed jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Completed Tab - Error:", error);
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-error-500 text-lg font-medium mb-2">
            Failed to load completed jobs
          </p>
          <p className="text-neutral-500">Please try again later</p>
        </div>
      </div>
    );
  }

  // Check if data exists and has content
  // Don't rely on data.empty - check the actual content array
  if (!data) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-neutral-500 text-lg">No completed jobs found</p>
      </div>
    );
  }

  // Check if content array exists and has items
  const hasContent = data.content && Array.isArray(data.content) && data.content.length > 0;
  
  if (!hasContent) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-neutral-500 text-lg">No completed jobs found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 items-center">
        <button className="border border-neutral-500 rounded-md px-4 py-2 flex gap-4 items-center">
          <span className="text-base font-normal text-neutral-500">
            Last 30 days
          </span>
          <ChevronDown className="w-8 h-8" />
        </button>

        <button className="border border-neutral-500 rounded-md px-4 py-2 flex gap-4 items-center">
          <span className="text-base font-normal text-neutral-500">
            All Ratings
          </span>
          <ChevronDown className="w-8 h-8" />
        </button>

        <div className="border border-neutral-500 rounded-md h-12 px-6 py-4 flex items-center justify-between flex-1 max-w-md">
          <span className="text-lg font-light text-secondary-500">Search</span>
          <Search className="w-6 h-6" />
        </div>

        <Button
          variant="outline"
          className="border border-neutral-500 px-7 py-3"
        >
          Generate report
        </Button>
      </div>

      <Button
        variant="outline"
        className="border border-neutral-500 px-7 py-3 self-start"
      >
        Give feedback request
      </Button>

      <div className="flex flex-col gap-6">
        {data.content && data.content.length > 0 ? (
          data.content.map((job) => (
            <CompletedJobCard key={job.id} job={job} />
          ))
        ) : (
          <p className="text-neutral-500 text-lg">No completed jobs found</p>
        )}
      </div>
    </div>
  );
}

function CompletedJobCard({ job }: { job: Job }) {
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
            {job.actualBudget || job.budget}
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
        >
          View details
        </Button>
        <Button
          variant="outline"
          className="border border-neutral-500 text-border-neutral-800 px-7 py-3"
        >
          Performance Reports
        </Button>
      </div>
    </div>
  );
}
