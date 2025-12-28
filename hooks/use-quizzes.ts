import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
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
  QuizStats,
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuizRequest) => createQuiz(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      toast.success("Quiz created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create quiz");
    },
  });
}

export function useUpdateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateQuizRequest) => updateQuiz(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["quizzes", variables.id] });
      toast.success("Quiz updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update quiz");
    },
  });
}

export function useDeleteQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizId: number) => deleteQuiz(quizId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      toast.success("Quiz deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete quiz");
    },
  });
}

export function useArchiveQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizId: number) => archiveQuiz(quizId),
    onSuccess: (_, quizId) => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["quizzes", quizId] });
      toast.success("Quiz archived successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to archive quiz");
    },
  });
}

export function usePublishQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizId: number) => publishQuiz(quizId),
    onSuccess: (_, quizId) => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["quizzes", quizId] });
      toast.success("Quiz published successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to publish quiz");
    },
  });
}

export function useSaveQuizDraft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuizRequest | UpdateQuizRequest) => saveQuizDraft(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      toast.success("Draft saved successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to save draft");
    },
  });
}

export function useScheduleSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      quizId: number;
      startTime: string;
      endTime: string;
      duration: number;
    }) => scheduleSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes", "sessions"] });
      toast.success("Session scheduled successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to schedule session");
    },
  });
}

export function useCreateRecurringSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      quizId: number;
      frequency: "DAILY" | "WEEKLY" | "MONTHLY";
      daysOfWeek?: number[];
      time: string;
      endDate?: string;
    }) => createRecurringSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes", "sessions"] });
      toast.success("Recurring schedule created successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create recurring schedule"
      );
    },
  });
}

export function useUpdateQuizSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: Partial<QuizSettings>) => updateQuizSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes", "settings"] });
      toast.success("Settings updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update settings");
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; parentId?: number }) =>
      createCategory(data.name, data.parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes", "categories"] });
      toast.success("Category created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create category");
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { categoryId: number; name: string }) =>
      updateCategory(data.categoryId, data.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes", "categories"] });
      toast.success("Category updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update category");
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: number) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes", "categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete category");
    },
  });
}
