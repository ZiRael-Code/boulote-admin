"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/button";
import { useQuiz } from "@/hooks/use-quizzes";
import { formatRelativeTime } from "@/lib/utils/format-date";

export default function QuizAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = Number(params.id);

  const { data: quiz, isLoading } = useQuiz(quizId, true);

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

  const analytics = quiz.analytics;

  return (
    <div className="flex flex-col gap-6 px-4 py-8 lg:pl-16 lg:pr-8 lg:py-16">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-neutral-50 rounded-md"
          >
            <ArrowLeft className="w-6 h-6 text-secondary-500" />
          </button>
          <h1 className="text-3xl font-bold text-secondary-500">
            {quiz.title} - Analytics
          </h1>
        </div>
        <Button variant="secondary">Export</Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-secondary-500">
            Performance by Question
          </h2>
          <button className="text-primary-500 text-sm font-medium">View All</button>
        </div>
        {analytics && analytics.totalAttempts > 0 ? (
          <div className="bg-white border border-border-500 rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-500">
                    Question
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-500">
                    Correct%
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-500">
                    Avg. Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-500">
                    Difficulty
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border-500">
                  <td className="px-6 py-4 text-base text-neutral-500 text-center" colSpan={4}>
                    Question performance data will be displayed here when available
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white border border-border-500 rounded-md p-12 text-center">
            <p className="text-neutral-500">No performance data available yet</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-secondary-500">Recent Attempts</h2>
          <button className="text-primary-500 text-sm font-medium">View All</button>
        </div>
        {quiz.recentActivities && quiz.recentActivities.length > 0 ? (
          <div className="flex flex-col gap-4">
            {quiz.recentActivities.map((attempt) => (
              <div
                key={attempt.id}
                className="bg-white border border-border-500 rounded-md p-6 flex items-center justify-between"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium text-secondary-500">
                    {attempt.professionalName}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-neutral-500">
                    <span>Score: {attempt.score}%</span>
                    <span>•</span>
                    <span>Duration: {attempt.duration} min</span>
                    <span>•</span>
                    <span>{formatRelativeTime(attempt.completedAt)}</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    attempt.passed
                      ? "bg-success-50 text-success-800"
                      : "bg-error-50 text-error-800"
                  }`}
                >
                  {attempt.passed ? "Passed" : "Failed"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-border-500 rounded-md p-12 text-center">
            <p className="text-neutral-500">No recent attempts</p>
          </div>
        )}
      </div>
    </div>
  );
}
