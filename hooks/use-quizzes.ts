import { useQuery } from "@tanstack/react-query";
import { useMutationWithToast } from "./use-mutation-with-toast";
import {
  getQuizDashboard,
  getQuizzes,
  getQuizById,
  getQuizAnalytics,
  getQuizCategories,
  getCategoryStats,
  getScheduledSessions,
  getQuizSettings,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  archiveQuiz,
  publishQuiz,
  saveQuizDraft,
  scheduleSession,
  createRecurringSchedule,
  updateQuizSettings,
  createCategory,
  updateCategory,
  deleteCategory,
  type CreateQuizRequest,
  type UpdateQuizRequest,
} from "@/lib/api/services/quizzes";
import type {
  Quiz,
  QuizDetails,
  QuizDashboardResponse,
  QuizCategory,
  QuizAnalytics,
  QuizSettings,
  CategoryStats,
  ScheduledSession,
} from "@/lib/types/quiz";

export function useQuizDashboard(enabled = true) {
  return useQuery<QuizDashboardResponse>({
    queryKey: ["quizzes", "dashboard"],
    queryFn: getQuizDashboard,
    enabled,
  });
}

export function useQuizStats(enabled = true) {
  const { data: dashboard } = useQuizDashboard(enabled);
  return {
    data: dashboard?.stats,
    isLoading: !dashboard,
  };
}

export function useQuizzes(
  params?: {
    search?: string;
    status?: string;
    category?: string;
    page?: number;
    size?: number;
  },
  enabled = true
) {
  return useQuery<{ content: Quiz[]; totalElements: number }>({
    queryKey: ["quizzes", "list", params],
    queryFn: () => getQuizzes(params),
    enabled,
  });
}

export function useQuiz(quizId: number, enabled = true) {
  return useQuery<QuizDetails>({
    queryKey: ["quizzes", quizId],
    queryFn: () => getQuizById(quizId),
    enabled: enabled && !!quizId,
  });
}

export function useQuizAnalytics(quizId: number, enabled = true) {
  return useQuery<QuizAnalytics>({
    queryKey: ["quizzes", quizId, "analytics"],
    queryFn: () => getQuizAnalytics(quizId),
    enabled: enabled && !!quizId,
  });
}

export function useQuizCategories(enabled = true) {
  return useQuery<QuizCategory[]>({
    queryKey: ["quizzes", "categories"],
    queryFn: getQuizCategories,
    enabled,
  });
}

export function useCategoryStats(enabled = true) {
  return useQuery<CategoryStats>({
    queryKey: ["quizzes", "categories", "stats"],
    queryFn: getCategoryStats,
    enabled,
  });
}

export function useScheduledSessions(
  params?: {
    date?: string;
    view?: "calendar" | "list" | "upcoming";
  },
  enabled = true
) {
  return useQuery<ScheduledSession[]>({
    queryKey: ["quizzes", "sessions", params],
    queryFn: () => getScheduledSessions(params),
    enabled,
  });
}

export function useQuizSettings(enabled = true) {
  return useQuery<QuizSettings>({
    queryKey: ["quizzes", "settings"],
    queryFn: getQuizSettings,
    enabled,
  });
}

export function useCreateQuiz() {
  return useMutationWithToast({
    mutationFn: (data: CreateQuizRequest) => createQuiz(data),
    successMessage: "Quiz created successfully",
    errorMessage: "Failed to create quiz",
    invalidateKeys: [["quizzes"]],
  });
}

export function useUpdateQuiz() {
  return useMutationWithToast({
    mutationFn: (data: UpdateQuizRequest) => updateQuiz(data),
    successMessage: "Quiz updated successfully",
    errorMessage: "Failed to update quiz",
    invalidateKeys: (_, variables) => [
      ["quizzes"],
      ["quizzes", String(variables.id)],
    ],
  });
}

export function useDeleteQuiz() {
  return useMutationWithToast({
    mutationFn: (quizId: number) => deleteQuiz(quizId),
    successMessage: "Quiz deleted successfully",
    errorMessage: "Failed to delete quiz",
    invalidateKeys: [["quizzes"]],
  });
}

export function useArchiveQuiz() {
  return useMutationWithToast({
    mutationFn: (quizId: number) => archiveQuiz(quizId),
    successMessage: "Quiz archived successfully",
    errorMessage: "Failed to archive quiz",
    invalidateKeys: (_, quizId) => [
      ["quizzes"],
      ["quizzes", String(quizId)],
    ],
  });
}

export function usePublishQuiz() {
  return useMutationWithToast({
    mutationFn: (quizId: number) => publishQuiz(quizId),
    successMessage: "Quiz published successfully",
    errorMessage: "Failed to publish quiz",
    invalidateKeys: (_, quizId) => [
      ["quizzes"],
      ["quizzes", String(quizId)],
    ],
  });
}

export function useSaveQuizDraft() {
  return useMutationWithToast({
    mutationFn: (data: CreateQuizRequest | UpdateQuizRequest) => saveQuizDraft(data),
    successMessage: "Draft saved successfully",
    errorMessage: "Failed to save draft",
    invalidateKeys: [["quizzes"]],
  });
}

export function useScheduleSession() {
  return useMutationWithToast({
    mutationFn: (data: {
      quizId: number;
      startTime: string;
      endTime: string;
      duration: number;
    }) => scheduleSession(data),
    successMessage: "Session scheduled successfully",
    errorMessage: "Failed to schedule session",
    invalidateKeys: [["quizzes", "sessions"]],
  });
}

export function useCreateRecurringSchedule() {
  return useMutationWithToast({
    mutationFn: (data: {
      quizId: number;
      frequency: "DAILY" | "WEEKLY" | "MONTHLY";
      daysOfWeek?: number[];
      time: string;
      endDate?: string;
    }) => createRecurringSchedule(data),
    successMessage: "Recurring schedule created successfully",
    errorMessage: "Failed to create recurring schedule",
    invalidateKeys: [["quizzes", "sessions"]],
  });
}

export function useUpdateQuizSettings() {
  return useMutationWithToast({
    mutationFn: (settings: Partial<QuizSettings>) => updateQuizSettings(settings),
    successMessage: "Settings updated successfully",
    errorMessage: "Failed to update settings",
    invalidateKeys: [["quizzes", "settings"]],
  });
}

export function useCreateCategory() {
  return useMutationWithToast({
    mutationFn: (data: { name: string; parentId?: number }) =>
      createCategory(data.name, data.parentId),
    successMessage: "Category created successfully",
    errorMessage: "Failed to create category",
    invalidateKeys: [["quizzes", "categories"]],
  });
}

export function useUpdateCategory() {
  return useMutationWithToast({
    mutationFn: (data: { categoryId: number; name: string }) =>
      updateCategory(data.categoryId, data.name),
    successMessage: "Category updated successfully",
    errorMessage: "Failed to update category",
    invalidateKeys: [["quizzes", "categories"]],
  });
}

export function useDeleteCategory() {
  return useMutationWithToast({
    mutationFn: (categoryId: number) => deleteCategory(categoryId),
    successMessage: "Category deleted successfully",
    errorMessage: "Failed to delete category",
    invalidateKeys: [["quizzes", "categories"]],
  });
}
