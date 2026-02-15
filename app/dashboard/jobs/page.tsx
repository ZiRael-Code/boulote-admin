"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { usePendingJobs, useCompletedJobs } from "@/hooks/use-jobs";
import { ActiveProcessesSection } from "./components/active-processes";
import { PendingRequestsTab } from "./components/pending-tab";
import { AIReviewTab } from "./components/ai-review-tab";
import { OngoingJobsTab } from "./components/ongoing-tab";
import { CompletedTab } from "./components/completed-tab";

type TabType = "pending" | "ai-review" | "ongoing" | "completed";

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("pending");

  const { data: pendingData } = usePendingJobs(activeTab === "pending");
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

      <ActiveProcessesSection />

      <div className="flex flex-col gap-8">
        <Tabs
          tabs={[
            {
              value: "pending" as const,
              label: "Pending Requests",
              count: pendingData?.totalElements,
              countStyle: "bg-primary-200",
            },
            { value: "ai-review" as const, label: "AI Review" },
            { value: "ongoing" as const, label: "Ongoing Jobs" },
            {
              value: "completed" as const,
              label: "Completed",
              count: completedData?.totalElements,
              countStyle: "bg-neutral-200",
            },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="h-16 items-center"
        />

        {activeTab === "pending" && <PendingRequestsTab />}
        {activeTab === "ai-review" && <AIReviewTab enabled={activeTab === "ai-review"} />}
        {activeTab === "ongoing" && <OngoingJobsTab />}
        {activeTab === "completed" && <CompletedTab />}
      </div>
    </div>
  );
}
