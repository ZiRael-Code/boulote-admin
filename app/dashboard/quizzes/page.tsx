"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Edit, Archive, Trash2, FileJson } from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/ui/stat-card";
import { Tabs } from "@/components/ui/tabs";
import {
    useQuizDashboard,
    useQuizzes,
    useQuiz,
    useArchiveQuiz,
    useDeleteQuiz,
    useJsonQuestions,
    useUpdateJsonQuestion,
    useProfessionsWithSkills, useQuizCategoryOptions,
} from "@/hooks/use-quizzes";
import { formatRelativeTime } from "@/lib/utils/format-date";
import type { QuizDetails, QuizAttempt } from "@/lib/types/quiz";

type MainTab = "library" | "json";

export default function QuizzesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
    const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [mainTab, setMainTab] = useState<MainTab>("library");

  const { data: dashboard, isLoading: isLoadingDashboard } = useQuizDashboard(true);
  const { data: professions } = useProfessionsWithSkills(true);
    const stats = dashboard;

    const { data: quizzesData, isLoading: isLoadingQuizzes } = useQuizzes(
        {
            search: search || undefined,
            status: statusFilter !== "All Status" ? statusFilter : undefined,
            category: categoryFilter || undefined,
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


    const { data: categoryOptions = [] } = useQuizCategoryOptions(true);

  return (
      <div className="flex flex-col gap-6 px-4 py-8 lg:pl-16 lg:pr-8 lg:py-16">
        <h1 className="text-3xl font-bold text-secondary-500">Quiz Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard value={isLoadingDashboard ? "..." : (stats?.totalQuizzes ?? quizzes.length)} label="Total Quizzes" />
            <StatCard value={isLoadingDashboard ? "..." : (stats?.activeQuizzes ?? quizzes.filter((q: any) => q.status === "Active").length)} label="Active Quizzes" />
            <StatCard value={isLoadingDashboard ? "..." : (stats?.totalAttempts ?? 0)} label="Total Attempts" />
            <StatCard value={isLoadingDashboard ? "..." : `${stats?.averagePassRate?.toFixed(1) ?? "0.0"}%`} label="Avg. Pass Rate" />
        </div>


        <div className="flex gap-2 border-b border-border-500">
          <button
              onClick={() => setMainTab("library")}
              className={`px-4 py-2 border-b-2 text-sm font-medium transition-colors ${
                  mainTab === "library"
                      ? "border-primary-500 text-primary-500"
                      : "border-transparent text-secondary-500"
              }`}
          >
            Quiz Library
          </button>
          <button
              onClick={() => setMainTab("json")}
              className={`px-4 py-2 border-b-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                  mainTab === "json"
                      ? "border-primary-500 text-primary-500"
                      : "border-transparent text-secondary-500"
              }`}
          >
            <FileJson className="w-4 h-4" />
            JSON Question Bank
          </button>
        </div>

        {mainTab === "library" ? (
            <div className="flex gap-6">
              <div className="flex flex-col gap-6 flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-secondary-500">Quiz Library</h2>
                  <div className="flex gap-4">
                    <Button variant="primary" onClick={() => router.push("/dashboard/quizzes/manage")}>
                      Manage Quiz
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/dashboard/quizzes/create")}>
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
                        className="border border-neutral-500 rounded-md px-4 py-2 pr-10 appearance-none bg-white text-base font-normal text-secondary-500 focus:outline-none"
                    >
                      <option>All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <ChevronDown className="w-5 h-5 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <div className="relative">
                      <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="border border-neutral-500 rounded-md px-4 py-2 pr-10 appearance-none bg-white text-base text-secondary-500 focus:outline-none"
                      >
                          <option value="">All categories</option>
                          {categoryOptions.map((cat: any) => (
                              <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
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
                      {quizzes.map((quiz: any) => (
                          <div
                              key={quiz.id}
                              className={`bg-white border border-border-500 rounded-md p-6 flex items-center justify-between cursor-pointer transition-colors ${
                                  selectedQuizId === quiz.id ? "bg-primary-50 border-primary-500" : ""
                              }`}
                              onClick={() => setSelectedQuizId(quiz.id)}
                          >
                            <div className="flex flex-col gap-2 flex-1">
                              <h3 className="text-xl font-medium text-secondary-500">{quiz.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-neutral-500">
                                <span>Category: {quiz.category}</span>
                                <span>•</span>
                                <span>Pass Rate: {quiz.passRate?.toFixed(1) ?? 0}%</span>
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
                                      router.push(`/dashboard/quizzes/${quiz.id}/edit`);
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
                            onArchive={() => archiveMutation.mutate(selectedQuizId, { onSuccess: () => setSelectedQuizId(null) })}
                            onDelete={() => {
                              if (confirm("Delete this quiz? This cannot be undone.")) {
                                deleteMutation.mutate(selectedQuizId, { onSuccess: () => setSelectedQuizId(null) });
                              }
                            }}
                            onSchedule={() => router.push(`/dashboard/quizzes/schedule?quizId=${selectedQuizId}`)}
                            onViewAnalytics={() => router.push(`/dashboard/quizzes/${selectedQuizId}/analytics`)}
                        />
                    ) : null}
                  </div>
              )}
            </div>
        ) : (
            <JsonQuestionsTab />
        )}
      </div>
  );
}

function JsonQuestionsTab() {
    const { data: groupedQuestions, isLoading } = useJsonQuestions(true);
    const updateMutation = useUpdateJsonQuestion();
    const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editData, setEditData] = useState<any>(null);
    const [skillPages, setSkillPages] = useState<Record<string, number>>({});
    const PAGE_SIZE = 5;

    const skills = Object.keys(groupedQuestions ?? {}).sort();

    const getPage = (skill: string) => skillPages[skill] ?? 0;
    const setPage = (skill: string, page: number) =>
        setSkillPages((prev) => ({ ...prev, [skill]: page }));

    const startEdit = (skill: string, index: number, question: any) => {
        setEditingKey(`${skill}:${index}`);
        setEditData({ ...question });
    };

    const handleSave = (skill: string, globalIndex: number) => {
        updateMutation.mutate(
            { index: globalIndex, data: editData },
            { onSuccess: () => setEditingKey(null) }
        );
    };

    if (isLoading) return <LoadingSpinner />;

    const totalQuestions = Object.values(groupedQuestions ?? {}).reduce(
        (sum, arr) => sum + arr.length, 0
    );

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-secondary-500">JSON Question Bank</h2>
                <span className="text-sm text-neutral-500">{totalQuestions} questions across {skills.length} skills</span>
            </div>

            <div className="flex flex-col gap-3">
                {skills.map((skill) => {
                    const allQuestions: any[] = (groupedQuestions ?? {})[skill] ?? [];
                    const isExpanded = expandedSkill === skill;
                    const page = getPage(skill);
                    const totalPages = Math.ceil(allQuestions.length / PAGE_SIZE);
                    const pageQuestions = allQuestions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);


                    const getGlobalIndex = (localIndex: number) => {
                        const allSkillsFlat = skills.flatMap((s) => (groupedQuestions ?? {})[s] ?? []);
                        const questionInPage = pageQuestions[localIndex];
                        return allSkillsFlat.indexOf(questionInPage);
                    };

                    return (
                        <div key={skill} className="bg-white border border-border-500 rounded-md overflow-hidden">

                            <button
                                onClick={() => setExpandedSkill(isExpanded ? null : skill)}
                                className="w-full flex items-center justify-between px-6 py-4 hover:bg-neutral-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-base font-semibold text-secondary-500">{skill}</span>
                                    <span className="px-2 py-0.5 bg-primary-50 text-primary-500 text-xs rounded-full">
                    {allQuestions.length} questions
                  </span>
                                </div>
                                <span className="text-neutral-400 text-sm">{isExpanded ? "▲ Collapse" : "▼ Expand"}</span>
                            </button>


                            {isExpanded && (
                                <div className="border-t border-border-500 flex flex-col divide-y divide-border-500">
                                    {pageQuestions.map((question: any, localIndex: number) => {
                                        const globalIndex = getGlobalIndex(localIndex);
                                        const key = `${skill}:${globalIndex}`;
                                        const isEditing = editingKey === key;

                                        return (
                                            <div key={key} className="p-6 flex flex-col gap-4">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-1 bg-neutral-100 text-neutral-500 text-xs rounded-md">
                              {question.skillLevel}
                            </span>
                                                        <span className="px-2 py-1 bg-neutral-100 text-neutral-500 text-xs rounded-md">
                              {question.difficulty}
                            </span>
                                                        {question.tags?.map((tag: string) => (
                                                            <span key={tag} className="px-2 py-1 bg-primary-50 text-primary-400 text-xs rounded-md">
                                #{tag}
                              </span>
                                                        ))}
                                                    </div>
                                                    {!isEditing && (
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => startEdit(skill, globalIndex, question)}
                                                        >
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit
                                                        </Button>
                                                    )}
                                                </div>

                                                {isEditing ? (
                                                    <div className="flex flex-col gap-4">
                                                        <div className="flex flex-col gap-1">
                                                            <label className="text-sm font-medium text-secondary-500">Question</label>
                                                            <textarea
                                                                value={editData.question}
                                                                onChange={(e) => setEditData({ ...editData, question: e.target.value })}
                                                                className="border border-neutral-500 rounded-md px-3 py-2 text-sm resize-none h-20"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <label className="text-sm font-medium text-secondary-500">
                                                                Options (select correct answer)
                                                            </label>
                                                            {editData.options?.map((opt: string, i: number) => (
                                                                <div key={i} className="flex items-center gap-2">
                                                                    <input
                                                                        type="radio"
                                                                        checked={editData.correctAnswer === opt}
                                                                        onChange={() => setEditData({ ...editData, correctAnswer: opt })}
                                                                        className="w-4 h-4"
                                                                    />
                                                                    <input
                                                                        value={opt}
                                                                        onChange={(e) => {
                                                                            const opts = [...editData.options];
                                                                            opts[i] = e.target.value;
                                                                            const newCorrect = editData.correctAnswer === opt
                                                                                ? e.target.value
                                                                                : editData.correctAnswer;
                                                                            setEditData({ ...editData, options: opts, correctAnswer: newCorrect });
                                                                        }}
                                                                        className="flex-1 border border-neutral-500 rounded-md px-3 py-1.5 text-sm"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <label className="text-sm font-medium text-secondary-500">Explanation</label>
                                                            <textarea
                                                                value={editData.explanation}
                                                                onChange={(e) => setEditData({ ...editData, explanation: e.target.value })}
                                                                className="border border-neutral-500 rounded-md px-3 py-2 text-sm resize-none h-16"
                                                            />
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <Button
                                                                variant="primary"
                                                                onClick={() => handleSave(skill, globalIndex)}
                                                                disabled={updateMutation.isPending}
                                                            >
                                                                {updateMutation.isPending ? "Saving..." : "Save"}
                                                            </Button>
                                                            <Button variant="secondary" onClick={() => setEditingKey(null)}>
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <p className="text-base font-medium text-secondary-500">{question.question}</p>
                                                        <div className="flex flex-col gap-1">
                                                            {question.options?.map((opt: string, i: number) => (
                                                                <div
                                                                    key={i}
                                                                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                                                                        opt === question.correctAnswer
                                                                            ? "bg-success-50 text-success-700 font-medium border border-success-200"
                                                                            : "bg-neutral-50 text-neutral-500"
                                                                    }`}
                                                                >
                                                                    <span>{String.fromCharCode(65 + i)}.</span>
                                                                    <span className="flex-1">{opt}</span>
                                                                    {opt === question.correctAnswer && (
                                                                        <span className="text-xs">✓ Correct</span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {question.explanation && (
                                                            <p className="text-sm text-neutral-400 italic">{question.explanation}</p>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}


                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between px-6 py-4 bg-neutral-50">
                      <span className="text-sm text-neutral-500">
                        Page {page + 1} of {totalPages} • {allQuestions.length} questions
                      </span>
                                            <div className="flex gap-2">
                                                <button
                                                    disabled={page === 0}
                                                    onClick={() => setPage(skill, page - 1)}
                                                    className="px-3 py-1.5 border border-border-500 rounded-md text-sm disabled:opacity-40 hover:bg-white"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    disabled={page + 1 >= totalPages}
                                                    onClick={() => setPage(skill, page + 1)}
                                                    className="px-3 py-1.5 border border-border-500 rounded-md text-sm disabled:opacity-40 hover:bg-white"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
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
  quiz: QuizDetails;
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
              {quiz.analytics?.totalAttempts ?? quiz.totalAttempts ?? 0}
            </p>
            <p className="text-sm text-neutral-500">Total Attempts</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-bold text-primary-500">
              {(quiz.analytics?.passRate ?? quiz.passRate ?? 0).toFixed(1)}%
            </p>
            <p className="text-sm text-neutral-500">Avg. Pass Rate</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="primary" onClick={onViewAnalytics} className="flex-1">
            View Analytics
          </Button>
        </div>

        <Tabs
            tabs={[
              { value: "overview" as const, label: "Overview" },

            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        />

        {activeTab === "overview" && <OverviewTabContent quiz={quiz} />}
        {activeTab === "schedule" && (
            <p className="text-base text-neutral-500">Click Schedule New Session to add a session.</p>
        )}
        {activeTab === "settings" && (
            <p className="text-base text-neutral-500">Quiz settings will be displayed here.</p>
        )}

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

function OverviewTabContent({ quiz }: { quiz: QuizDetails }) {
  return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-secondary-500">Description</h3>
          <p className="text-base text-neutral-500">{quiz.description || "No description available."}</p>
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
          {quiz.recentActivities && quiz.recentActivities.length > 0 ? (
              quiz.recentActivities.map((activity: QuizAttempt, index: number) => (
                  <div key={index} className="text-base text-neutral-500">
                    <span className="font-medium">{activity.professionalName}</span>{" "}
                    {activity.passed ? "passed" : "failed"} — Score: {activity.score}% •{" "}
                    {formatRelativeTime(activity.completedAt)}
                  </div>
              ))
          ) : (
              <p className="text-base text-neutral-500">No recent activity</p>
          )}
        </div>
      </div>
  );
}