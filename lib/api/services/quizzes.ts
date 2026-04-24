import axiosInstance from "../axios-config";
import type { QuizDetails, QuizAttempt } from "@/lib/types/quiz";

export type QuizFilters = {
  search?: string;
  status?: string;
  category?: string;
  page?: number;
  size?: number;
};

export type CreateQuizRequest = {
  title: string;
  difficulty?: string;
  adminNotes?: string;
  estimatedLevel?: number;
  category?: string;
  tags?: string[];
  questions?: {
    questionText: string;
    questionType: string;
    options: string[];
    correctAnswer: number | string;
    explanation?: string;
  }[];
  timeLimit?: { enabled: boolean; duration: number };
  passingScore?: number;
  questionOrder?: string;
  showResult?: string;
  attempts?: number;
  accessControl?: {
    requireLogin: boolean;
    verifiedProfessionals: boolean;
    premiumFeature: boolean;
  };
};

export async function getQuizDashboard() {
  const response = await axiosInstance.get("/admin/quizzes/dashboard");
  return response.data;
}

export async function getQuizzes(filters: QuizFilters = {}) {
  const p = new URLSearchParams();
  if (filters.search) p.append("search", filters.search);
  if (filters.status) p.append("status", filters.status);
  if (filters.category) p.append("category", filters.category);
  p.append("page", String(filters.page ?? 0));
  p.append("size", String(filters.size ?? 10));
  const response = await axiosInstance.get(`/admin/quizzes?${p.toString()}`);
  return response.data;
}

export async function getQuiz(quizId: number) {
  const response = await axiosInstance.get(`/admin/quizzes/${quizId}`);
  return response.data;
}

export async function archiveQuiz(quizId: number) {
  await axiosInstance.post(`/admin/quizzes/${quizId}/archive`);
}

export async function deleteQuiz(quizId: number) {
  await axiosInstance.delete(`/admin/quizzes/${quizId}`);
}

export async function getQuizCategories() {
  const response = await axiosInstance.get("/admin/quizzes/categories");
  return response.data;
}



export async function createCategory(data: { name: string; description?: string }) {
  const response = await axiosInstance.post("/admin/quizzes/categories", data);
  return response.data;
}

export async function updateCategory(categoryId: number, data: { name: string; description?: string }) {
  await axiosInstance.put(`/admin/quizzes/categories/${categoryId}`, data);
}

export async function deleteCategory(categoryId: number) {
  await axiosInstance.delete(`/admin/quizzes/categories/${categoryId}`);
}

export async function getCategoryStats() {
  const response = await axiosInstance.get("/admin/quizzes/categories");
  const categories = response.data as any[];
  const programming = categories.filter((c) => c.name?.toLowerCase().includes("programming")).reduce((s, c) => s + (c.quizCount || 0), 0);
  const design = categories.filter((c) => c.name?.toLowerCase().includes("design")).reduce((s, c) => s + (c.quizCount || 0), 0);
  const marketing = categories.filter((c) => c.name?.toLowerCase().includes("marketing")).reduce((s, c) => s + (c.quizCount || 0), 0);
  return {
    programmingQuizzes: programming,
    designQuizzes: design,
    marketingQuizzes: marketing,
    programmingTrend: "No change",
    designTrend: "No change",
    marketingTrend: "No change",
  };
}

export async function getQuizSettings() {
  const response = await axiosInstance.get("/admin/quizzes/settings");
  return response.data;
}

export async function updateQuizSettings(data: any) {
  await axiosInstance.put("/admin/quizzes/settings", data);
}

export async function getScheduledSessions(params: { date?: string; view?: string }) {
  const p = new URLSearchParams();
  if (params.date) p.append("date", params.date);
  if (params.view) p.append("view", params.view);
  const response = await axiosInstance.get(`/admin/quizzes/sessions?${p.toString()}`);
  return response.data;
}

export async function createQuiz(data: CreateQuizRequest) {
  const response = await axiosInstance.post("/admin/quizzes", data);
  return response.data;
}

export async function saveQuizDraft(data: CreateQuizRequest) {
  const response = await axiosInstance.post("/admin/quizzes/draft", data);
  return response.data;
}

export async function getJsonQuestions(): Promise<Record<string, any[]>> {
  const response = await axiosInstance.get("/admin/quizzes/json-questions");
  return response.data;
}

export async function updateQuiz(quizId: number, data: any) {
  await axiosInstance.put(`/admin/quizzes/${quizId}`, data);
}

export async function updateJsonQuestion(index: number, data: any) {
  await axiosInstance.put(`/admin/quizzes/json-questions/${index}`, data);
}

export async function getProfessionsWithSkills() {
  const response = await axiosInstance.get("/profession/getProfessionsWithSkills");
  return response.data;
}

export async function getQuizCategoryNames() {
  const response = await axiosInstance.get("/admin/quizzes/categories");
  const categories: any[] = response.data;
  const seen = new Set<string>();
  return categories
      .filter((c) => {
        const skillName = c.name?.split(" - ")[0]?.trim();
        if (!skillName || seen.has(skillName)) return false;
        seen.add(skillName);
        return true;
      })
      .map((c) => ({ value: c.name?.split(" - ")[0]?.trim(), label: c.name?.split(" - ")[0]?.trim() }));
}