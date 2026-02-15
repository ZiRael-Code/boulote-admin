"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Edit, Archive, Trash2 } from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/ui/stat-card";
import { Tabs } from "@/components/ui/tabs";
import { useQuizDashboard, useQuizzes, useQuiz, useArchiveQuiz, useDeleteQuiz } from "@/hooks/use-quizzes";
import { formatRelativeTime } from "@/lib/utils/format-date";
import type { Quiz } from "@/lib/types/quiz";

export default function QuizzesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);

  const { data: dashboard, isLoading: isLoadingDashboard } = useQuizDashboard(true);
  const stats = dashboard?.stats;
  const { data: quizzesData, isLoading: isLoadingQuizzes } = useQuizzes(
    {
      search: search || undefined,
      status: statusFilter !== "All Status" ? statusFilter : undefined,
      category: categoryFilter !== "All categories" ? categoryFilter : undefined,
    },
    true
  );

  const { data: selectedQuiz, isLoading: isLoadingSelectedQuiz } = useQuiz(
    selectedQuizId || 0,
    !!selectedQuizId
  );

  const archiveMutation = useArchiveQuiz();
  const deleteMutation = useDeleteQuiz();

  const quizzes = quizzesData?.content || [];

  return (
    <div className="flex flex-col gap-6 px-4 py-8 lg:pl-16 lg:pr-8 lg:py-16">
      <h1 className="text-3xl font-bold text-secondary-500">Quiz Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard value={isLoadingDashboard ? "..." : stats?.totalQuizzes || 0} label="Total Quizzes" />
        <StatCard value={isLoadingDashboard ? "..." : stats?.activeQuizzes || 0} label="Active Quizzes" />
        <StatCard value={isLoadingDashboard ? "..." : stats?.totalAttempts || 0} label="Total Attempts" />
        <StatCard value={isLoadingDashboard ? "..." : `${stats?.averagePassRate || 0}%`} label="Avg. Pass Rate" />
      </div>

      <div className="flex gap-6">
        <div className="flex flex-col gap-6 flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-secondary-500">Quiz Library</h2>
            <div className="flex gap-4">
              <Button
                variant="primary"
                onClick={() => router.push("/dashboard/quizzes/manage")}
              >
                Manage Quiz
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/quizzes/create")}
              >
                Create Quiz
              </Button>
            </div>
          </div>

        <div className="flex gap-4 items-center">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              rightIcon={<Search className="w-5 h-5 text-neutral-500" />}
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-neutral-500 rounded-md px-4 py-2 pr-10 appearance-none bg-white text-base font-normal text-secondary-500 focus:outline-none focus:border-primary-500"
            >
              <option>All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown className="w-5 h-5 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-neutral-500 rounded-md px-4 py-2 pr-10 appearance-none bg-white text-base font-normal text-secondary-500 focus:outline-none focus:border-primary-500"
            >
              <option>All categories</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="AI">AI</option>
              <option value="Content">Content</option>
              <option value="Data Science">Data Science</option>
              <option value="Management">Management</option>
            </select>
            <ChevronDown className="w-5 h-5 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

          {isLoadingQuizzes ? (
            <LoadingSpinner />
          ) : quizzes.length === 0 ? (
            <EmptyState message="No quizzes found" />
          ) : (
            <div className="flex flex-col gap-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className={`bg-white border border-border-500 rounded-md p-6 flex items-center justify-between cursor-pointer transition-colors ${
                    selectedQuizId === quiz.id ? "bg-primary-50 border-primary-500" : ""
                  }`}
                  onClick={() => setSelectedQuizId(quiz.id)}
                >
                  <div className="flex flex-col gap-2 flex-1">
                    <h3 className="text-xl font-medium text-secondary-500">
                      {quiz.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                      <span>Score: {quiz.passRate}%</span>
                      <span>•</span>
                      <span>Duration: {quiz.timeLimitMinutes} min</span>
                      <span>•</span>
                      <span>{quiz.lastActivity}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={quiz.status} className="rounded-[15px] text-sm font-normal" />
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedQuizId(quiz.id);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedQuizId && (
          <div className="w-[500px] shrink-0">
            {isLoadingSelectedQuiz ? (
              <LoadingSpinner />
            ) : selectedQuiz ? (
              <QuizDetailsPanel
                quiz={selectedQuiz}
                onArchive={() => {
                  archiveMutation.mutate(selectedQuizId, {
                    onSuccess: () => {
                      setSelectedQuizId(null);
                    },
                  });
                }}
                onDelete={() => {
                  if (confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
                    deleteMutation.mutate(selectedQuizId, {
                      onSuccess: () => {
                        setSelectedQuizId(null);
                      },
                    });
                  }
                }}
                onSchedule={() => router.push(`/dashboard/quizzes/schedule?quizId=${selectedQuizId}`)}
                onViewAnalytics={() => router.push(`/dashboard/quizzes/${selectedQuizId}/analytics`)}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

type TabType = "overview" | "schedule" | "settings";

function QuizDetailsPanel({
  quiz,
  onArchive,
  onDelete,
  onSchedule,
  onViewAnalytics,
}: {
  quiz: any;
  onArchive: () => void;
  onDelete: () => void;
  onSchedule: () => void;
  onViewAnalytics: () => void;
}) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  return (
    <div className="bg-white border border-border-500 rounded-md p-6 flex flex-col gap-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-secondary-500">{quiz.title}</h2>

      <div className="text-sm text-neutral-500">
        Created: {new Date(quiz.createdAt).toLocaleDateString()} • Last updated:{" "}
        {formatRelativeTime(quiz.lastUpdated)}
      </div>

      <div className="flex gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold text-primary-500">
            {quiz.analytics?.totalAttempts || quiz.totalAttempts}
          </p>
          <p className="text-sm text-neutral-500">Total Attempts</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold text-primary-500">
            {quiz.analytics?.passRate || quiz.passRate}%
          </p>
          <p className="text-sm text-neutral-500">Avg. Pass Rate</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="success" onClick={onSchedule} className="flex-1">
          Schedule New Session
        </Button>
        <Button variant="primary" onClick={onViewAnalytics} className="flex-1">
          View Analytics
        </Button>
      </div>

      <Tabs
        tabs={[
          { value: "overview" as const, label: "Overview" },
          { value: "schedule" as const, label: "Schedule" },
          { value: "settings" as const, label: "Settings" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex flex-col gap-6">
        {activeTab === "overview" && <OverviewTabContent quiz={quiz} />}
        {activeTab === "schedule" && (
          <div className="flex flex-col gap-4">
            <p className="text-base text-neutral-500">
              Manage quiz scheduling and sessions. Click the button above to schedule a new session.
            </p>
          </div>
        )}
        {activeTab === "settings" && (
          <div className="flex flex-col gap-4">
            <p className="text-base text-neutral-500">
              Quiz settings and configuration options will be displayed here.
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-4 justify-end pt-6 border-t border-border-500 mt-auto">
        <Button variant="secondary" onClick={onArchive}>
          <Archive className="w-4 h-4 mr-2" />
          Archive quiz
        </Button>
        <Button variant="danger" onClick={onDelete}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete quiz
        </Button>
      </div>
    </div>
  );
}

function OverviewTabContent({ quiz }: { quiz: any }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-secondary-500">Description</h3>
        <p className="text-base text-neutral-500">
          {quiz.description ||
            "Comprehensive assessment covering JavaScript basics, ES6 features, DOM manipulation, and async programming concepts."}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-secondary-500">Quiz Details</h3>
        <div className="flex flex-col gap-2 text-base text-neutral-500">
          <p>Category: {quiz.category}</p>
          {quiz.skill && <p>Skill: {quiz.skill}</p>}
          <p>Questions: {quiz.questionsCount}</p>
          <p>Duration: {quiz.timeLimitMinutes} minutes</p>
          <p>Passing Score: {quiz.passingScore || 70}%</p>
          <p>Difficulty: {quiz.difficulty || "N/A"}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-secondary-500">Recent Activity</h3>
        <div className="flex flex-col gap-2">
          {quiz.recentActivities && quiz.recentActivities.length > 0 ? (
            quiz.recentActivities.map((activity: any, index: number) => (
              <div key={index} className="text-base text-neutral-500">
                <span className="font-medium">{activity.professionalName}</span>{" "}
                {activity.passed ? "passed" : "failed"} - Score: {activity.score}% •{" "}
                {formatRelativeTime(activity.completedAt)}
              </div>
            ))
          ) : (
            <p className="text-base text-neutral-500">
              {quiz.lastActivity || "No recent activity"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
