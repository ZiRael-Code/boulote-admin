import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getQuizDashboard,
  getQuizzes,
  getQuiz,
  archiveQuiz,
  deleteQuiz,
  getQuizCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
  getQuizSettings,
  updateQuizSettings,
  getScheduledSessions,
  createQuiz,
  saveQuizDraft,
  type QuizFilters,
  type CreateQuizRequest,
} from "@/lib/api/services/quizzes";

export function useQuizDashboard(enabled = true) {
  return useQuery({
    queryKey: ["quizzes", "dashboard"],
    queryFn: getQuizDashboard,
    enabled,
  });
}

export function useQuizzes(filters: QuizFilters = {}, enabled = true) {
  return useQuery({
    queryKey: ["quizzes", "list", filters],
    queryFn: () => getQuizzes(filters),
    enabled,
    keepPreviousData: true,
  });
}

export function useQuiz(quizId: number, enabled = true) {
  return useQuery({
    queryKey: ["quizzes", "detail", quizId],
    queryFn: () => getQuiz(quizId),
    enabled: enabled && !!quizId,
  });
}

export function useArchiveQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (quizId: number) => archiveQuiz(quizId),
    onSuccess: () => {
      toast.success("Quiz archived");
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
    onError: () => toast.error("Failed to archive quiz"),
  });
}

export function useDeleteQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (quizId: number) => deleteQuiz(quizId),
    onSuccess: () => {
      toast.success("Quiz deleted");
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to delete quiz"),
  });
}

export function useQuizCategories(enabled = true) {
  return useQuery({
    queryKey: ["quizzes", "categories"],
    queryFn: getQuizCategories,
    enabled,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) => createCategory(data),
    onSuccess: () => {
      toast.success("Category created");
      queryClient.invalidateQueries({ queryKey: ["quizzes", "categories"] });
    },
    onError: () => toast.error("Failed to create category"),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryId, name }: { categoryId: number; name: string }) =>
        updateCategory(categoryId, { name }),
    onSuccess: () => {
      toast.success("Category updated");
      queryClient.invalidateQueries({ queryKey: ["quizzes", "categories"] });
    },
    onError: () => toast.error("Failed to update category"),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: number) => deleteCategory(categoryId),
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["quizzes", "categories"] });
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to delete category"),
  });
}

export function useCategoryStats(enabled = true) {
  return useQuery({
    queryKey: ["quizzes", "category-stats"],
    queryFn: getCategoryStats,
    enabled,
  });
}

export function useQuizSettings(enabled = true) {
  return useQuery({
    queryKey: ["quizzes", "settings"],
    queryFn: getQuizSettings,
    enabled,
  });
}

export function useUpdateQuizSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => updateQuizSettings(data),
    onSuccess: () => {
      toast.success("Settings saved");
      queryClient.invalidateQueries({ queryKey: ["quizzes", "settings"] });
    },
    onError: () => toast.error("Failed to save settings"),
  });
}

export function useScheduledSessions(params: { date?: string; view?: string }, enabled = true) {
  return useQuery({
    queryKey: ["quizzes", "sessions", params],
    queryFn: () => getScheduledSessions(params),
    enabled,
  });
}

export function useCreateQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateQuizRequest) => createQuiz(data),
    onSuccess: () => {
      toast.success("Quiz published");
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
    onError: () => toast.error("Failed to publish quiz"),
  });
}

export function useSaveQuizDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateQuizRequest) => saveQuizDraft(data),
    onSuccess: () => {
      toast.success("Draft saved");
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
    onError: () => toast.error("Failed to save draft"),
  });
}

import {
  getJsonQuestions,
  updateJsonQuestion,
  getProfessionsWithSkills,
} from "@/lib/api/services/quizzes";

export function useJsonQuestions(enabled = true) {
  return useQuery({
    queryKey: ["quizzes", "json-questions"],
    queryFn: getJsonQuestions,
    enabled,
  });
}

export function useUpdateJsonQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ index, data }: { index: number; data: any }) =>
        updateJsonQuestion(index, data),
    onSuccess: () => {
      toast.success("Question updated");
      queryClient.invalidateQueries({ queryKey: ["quizzes", "json-questions"] });
    },
    onError: () => toast.error("Failed to update question"),
  });
}

import { getQuizCategoryNames } from "@/lib/api/services/quizzes";

export function useQuizCategoryOptions(enabled = true) {
  return useQuery({
    queryKey: ["quizzes", "category-options"],
    queryFn: getQuizCategoryNames,
    enabled,
  });
}

import { updateQuiz } from "@/lib/api/services/quizzes";

export function useUpdateQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ quizId, data }: { quizId: number; data: any }) => updateQuiz(quizId, data),
    onSuccess: () => {
      toast.success("Quiz updated");
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
    onError: () => toast.error("Failed to update quiz"),
  });
}

export function useProfessionsWithSkills(enabled = true) {
  return useQuery({
    queryKey: ["professions", "with-skills"],
    queryFn: getProfessionsWithSkills,
    enabled,
  });
}