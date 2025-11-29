"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import Button from "@/components/ui/button";

type TabType = "pending" | "ai-review" | "ongoing" | "completed";

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("pending");

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
            <div className="bg-primary-200 rounded-full w-8 h-8 flex items-center justify-center">
              <span className="text-base font-medium text-primary-900">2</span>
            </div>
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
            <div className="bg-neutral-200 rounded-full w-8 h-8 flex items-center justify-center">
              <span className="text-base font-medium text-primary-900">2</span>
            </div>
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
            <div className="bg-neutral-200 rounded-full w-8 h-8 flex items-center justify-center">
              <span className="text-base font-medium text-primary-900">2</span>
            </div>
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
        <JobCard />
        <JobCard />
      </div>
    </div>
  );
}

function JobCard() {
  return (
    <div className="border border-border-500 rounded-md p-6 flex flex-col gap-4">
      <div className="flex gap-4 items-start justify-between">
        <div className="flex flex-col gap-2 flex-1">
          <h3 className="text-xl font-medium text-secondary-500">
            Senior fullstack developer
          </h3>
          <div className="flex flex-col gap-4">
            <p className="text-base font-normal text-secondary-500">
              TechcorpInc.
            </p>
            <p className="text-xs font-normal text-neutral-500">
              ID: #JOB-5847
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
            $8,500
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">DURATION</p>
          <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
            3-6 Months
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">SUBMITTED</p>
          <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
            2 hours ago
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">URGENCY</p>
          <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
            High
          </p>
        </div>
      </div>

      <p className="text-base font-normal text-neutral-500 leading-[19.2px]">
        We need an experienced full-stack developer to build a comprehensive
        e-commerce platform with React frontend and Node.js backend. The project
        includes payment integration, admin dashboard, and mobile
        responsiveness.
      </p>

      <div className="flex gap-4 items-end flex-wrap">
        <div className="bg-[rgba(204,226,243,0.29)] px-2 py-2 rounded-[15px]">
          <span className="text-base font-normal text-secondary-500">
            Problem Solving
          </span>
        </div>
        <div className="bg-[rgba(204,226,243,0.29)] px-2 py-2 rounded-[15px]">
          <span className="text-base font-normal text-secondary-500">
            Team collaboration
          </span>
        </div>
        <div className="bg-[rgba(204,226,243,0.29)] px-2 py-2 rounded-[15px]">
          <span className="text-base font-normal text-secondary-500">
            Communication
          </span>
        </div>
        <div className="bg-[rgba(204,226,243,0.29)] px-2 py-2 rounded-[15px]">
          <span className="text-base font-normal text-secondary-500">
            Time Management
          </span>
        </div>
      </div>

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

      <div className="border border-border-500 rounded-md p-6 flex flex-col gap-4">
        <div className="flex gap-4 items-start justify-between">
          <div className="flex flex-col gap-2 flex-1">
            <h3 className="text-xl font-medium text-secondary-500">
              Senior fullstack developer
            </h3>
            <div className="flex flex-col gap-4">
              <p className="text-base font-normal text-secondary-500">
                TechcorpInc.
              </p>
              <p className="text-xs font-normal text-neutral-500">
                ID: #JOB-5847
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
              94% Average
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-normal text-neutral-500">PROCESSED</p>
            <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
              5 minutes ago
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-normal text-neutral-500">
              CANDIDATES FOUND
            </p>
            <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
              3 Professionals
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-normal text-neutral-500">URGENCY</p>
            <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
              High
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
          <ProfessionalCard />
          <ProfessionalCard />
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
    </div>
  );
}

function ProfessionalCard() {
  return (
    <div className="border border-border-500 rounded-md p-6 flex gap-4 items-start">
      <div className="flex-1 flex gap-4">
        <div className="w-[70px] h-[70px] rounded-full bg-[#CFD3D7] flex items-center justify-center shrink-0">
          <span className="text-[16.8px] font-medium">SM</span>
        </div>

        <div className="flex flex-col gap-6 flex-1">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-4">
              <p className="text-base font-medium text-secondary-500">
                Sarah Johnson
              </p>
              <p className="text-base font-normal text-neutral-500">
                Senior Fullstack Developer
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-warning-500 text-2xl">★</span>
              <p className="text-base font-normal text-neutral-500">
                (127 reviews) • 98% success rate
              </p>
            </div>
          </div>

          <div className="flex gap-16">
            <div className="flex flex-col gap-2 items-center">
              <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                5+
              </p>
              <p className="text-xs font-normal text-neutral-500">YEARS EXP</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                89
              </p>
              <p className="text-xs font-normal text-neutral-500">PROJECTS</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                96%
              </p>
              <p className="text-xs font-normal text-neutral-500">AI MATCH</p>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            <div className="bg-[rgba(204,226,243,0.29)] px-2 py-2 rounded-[15px]">
              <span className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                React
              </span>
            </div>
            <div className="bg-[rgba(204,226,243,0.29)] px-2 py-2 rounded-[15px]">
              <span className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                AWS
              </span>
            </div>
            <div className="bg-[rgba(204,226,243,0.29)] px-2 py-2 rounded-[15px]">
              <span className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                MongoDB
              </span>
            </div>
            <div className="bg-[rgba(204,226,243,0.29)] px-2 py-2 rounded-[15px]">
              <span className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
                TypeScript
              </span>
            </div>
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

      <OngoingJobCard />
      <OngoingJobCard status="at-risk" />
    </div>
  );
}

function OngoingJobCard({ status = "ready" }: { status?: string }) {
  return (
    <div className="border border-border-500 rounded-md p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-medium text-secondary-500 mb-2">
            E-commerce Platform Development
          </h3>
          <p className="text-base text-secondary-500 mb-1">
            TechcorpInc. → John Smith
          </p>
          <p className="text-xs text-neutral-500">ID: #JOB-5847</p>
        </div>
        <div
          className={`px-2 py-2 rounded-[15px] ${
            status === "at-risk"
              ? "bg-warning-50 text-warning-600"
              : "bg-success-50 text-success-800"
          }`}
        >
          <span className="text-sm font-normal">
            {status === "at-risk" ? "At risk" : "Ready for review"}
          </span>
        </div>
      </div>

      <div className="flex gap-20">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">
            PROJECT PROGRESS
          </p>
          <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
            65% Complete
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">STARTED</p>
          <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
            3 Weeks ago
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">
            {status === "at-risk" ? "DUE DATE" : "BUDGET USED"}
          </p>
          <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
            {status === "at-risk" ? "In 3 weeks" : "$5500 / $8500"}
          </p>
        </div>
        {status === "at-risk" && (
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
          className="bg-primary-500 h-2 rounded-full"
          style={{ width: "65%" }}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center">
          <span className="text-sm font-medium">SM</span>
        </div>
        <div className="flex-1">
          <h4 className="font-medium">Sarah chemi</h4>
          <div className="flex items-center gap-2">
            <span className="text-warning-500">★</span>
            <span className="text-sm text-neutral-500">
              4.9 • Last active: 2 hours ago
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 self-end">
        <Button
          variant="outline"
          className="border border-neutral-500 text-border-neutral-800 px-7 py-3"
        >
          {status === "at-risk" ? "View issues" : "Track Progress"}
        </Button>
        <Button
          variant="outline"
          className="border border-neutral-500 text-border-neutral-800 px-7 py-3"
        >
          {status === "at-risk" ? "Contact parties" : "View messages"}
        </Button>
        <Button className="bg-primary-500 text-white px-7 py-3">
          {status === "at-risk" ? "Escalate issue" : "Manage Jobs"}
        </Button>
      </div>
    </div>
  );
}

function CompletedTab() {
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

      <CompletedJobCard rating={5.0} />
      <CompletedJobCard rating={3.5} />
    </div>
  );
}

function CompletedJobCard({ rating }: { rating: number }) {
  const feedbackBg = rating >= 4 ? "bg-success-50" : "bg-warning-50";
  const feedbackText = rating >= 4 ? "text-success-900" : "text-warning-900";

  return (
    <div className="border border-border-500 rounded-md p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-medium text-secondary-500 mb-2">
            Senior fullstack developer
          </h3>
          <p className="text-base text-secondary-500 mb-1">TechcorpInc.</p>
          <p className="text-xs text-neutral-500">ID: #JOB-5847</p>
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
            5 Days ago
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">DURATION</p>
          <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
            4 Weeks
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">CLIENT RATINGS</p>
          <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
            {rating.toFixed(1)}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-normal text-neutral-500">FINAL PAYMENT</p>
          <p className="text-sm font-normal text-secondary-500 tracking-[0.1px]">
            $3200
          </p>
        </div>
      </div>

      <div className={`p-4 rounded-md ${feedbackBg}`}>
        <h4 className={`font-medium mb-2 ${feedbackText}`}>Client Feedback</h4>
        <p className={`text-sm ${feedbackText}`}>
          {rating >= 4
            ? '"Excellent work on our e-commerce platform. John delivered high quality code on time and was great to work with."'
            : "Initial design didn't meet expectations. Additional revisions provided. Client satisfied with final outcome."}
        </p>
      </div>

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
