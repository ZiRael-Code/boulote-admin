"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Archive, Trash2 } from "lucide-react";
import Button from "@/components/ui/button";
import { useQuiz, useArchiveQuiz, useDeleteQuiz } from "@/hooks/use-quizzes";
import { formatRelativeTime } from "@/lib/utils/format-date";

type TabType = "overview" | "schedule" | "settings";

export default function QuizDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = Number(params.id);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const { data: quiz, isLoading } = useQuiz(quizId, true);
  const archiveMutation = useArchiveQuiz();
  const deleteMutation = useDeleteQuiz();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-error-500 text-lg">Quiz not found</p>
      </div>
    );
  }

  const handleArchive = () => {
    if (confirm("Are you sure you want to archive this quiz?")) {
      archiveMutation.mutate(quizId, {
        onSuccess: () => {
          router.push("/dashboard/quizzes");
        },
      });
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
      deleteMutation.mutate(quizId, {
        onSuccess: () => {
          router.push("/dashboard/quizzes");
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-8 lg:pl-16 lg:pr-8 lg:py-16">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-neutral-50 rounded-md"
        >
          <ArrowLeft className="w-6 h-6 text-secondary-500" />
        </button>
        <h1 className="text-3xl font-bold text-secondary-500">{quiz.title}</h1>
      </div>

      {/* Metadata */}
      <div className="text-sm text-neutral-500">
        Created: {new Date(quiz.createdAt).toLocaleDateString()} • Last updated:{" "}
        {formatRelativeTime(quiz.lastUpdated)}
      </div>

      {/* Summary Metrics */}
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

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          variant="success"
          onClick={() => router.push(`/dashboard/quizzes/schedule?quizId=${quizId}`)}
        >
          Schedule New Session
        </Button>
        <Button
          variant="primary"
          onClick={() => router.push(`/dashboard/quizzes/${quizId}/analytics`)}
        >
          View Analytics
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border-500">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-secondary-500"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("schedule")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === "schedule"
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-secondary-500"
          }`}
        >
          Schedule
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === "settings"
              ? "border-primary-500 text-primary-500"
              : "border-transparent text-secondary-500"
          }`}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex flex-col gap-6">
        {activeTab === "overview" && (
          <OverviewTab quiz={quiz} />
        )}
        {activeTab === "schedule" && (
          <ScheduleTab quizId={quizId} />
        )}
        {activeTab === "settings" && (
          <SettingsTab quiz={quiz} />
        )}
      </div>

      {/* Bottom Actions */}
      <div className="flex gap-4 justify-end pt-6 border-t border-border-500">
        <Button variant="secondary" onClick={handleArchive}>
          <Archive className="w-4 h-4 mr-2" />
          Archive quiz
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete quiz
        </Button>
      </div>
    </div>
  );
}

function OverviewTab({ quiz }: { quiz: any }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Description */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-secondary-500">Description</h3>
        <p className="text-base text-neutral-500">
          {quiz.description ||
            "Comprehensive assessment covering JavaScript basics, ES6 features, DOM manipulation, and async programming concepts."}
        </p>
      </div>

      {/* Quiz Details */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-secondary-500">Quiz Details</h3>
        <div className="flex flex-col gap-2 text-base text-neutral-500">
          <p>Category: {quiz.category}</p>
          <p>Skill: {quiz.skill}</p>
          <p>Questions: {quiz.questionsCount}</p>
          <p>Duration: {quiz.timeLimitMinutes} minutes</p>
          <p>Passing Score: {quiz.passingScore || 70}%</p>
          <p>Difficulty: {quiz.difficulty || "N/A"}</p>
        </div>
      </div>

      {/* Recent Activity */}
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

function ScheduleTab({ quizId }: { quizId: number }) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4">
      <p className="text-base text-neutral-500">
        Manage quiz scheduling and sessions. Click the button below to schedule a new session.
      </p>
      <Button
        variant="primary"
        onClick={() => router.push(`/dashboard/quizzes/schedule?quizId=${quizId}`)}
      >
        Schedule New Session
      </Button>
    </div>
  );
}

function SettingsTab({ quiz }: { quiz: any }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-base text-neutral-500">
        Quiz settings and configuration options will be displayed here.
      </p>
      {/* Add settings form here */}
    </div>
  );
}
