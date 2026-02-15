import axiosInstance from "../axios-config";
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

export async function getQuizDashboard(): Promise<QuizDashboardResponse> {
  const response = await axiosInstance.get<QuizDashboardResponse>(
    "/admin/quizzes/dashboard"
  );
  return response.data;
}

export async function getQuizzes(params?: {
  search?: string;
  status?: string;
  category?: string;
  page?: number;
  size?: number;
}): Promise<{ content: Quiz[]; totalElements: number }> {
  // For now, use dashboard endpoint and filter client-side
  // TODO: Update when list endpoint is available
  const dashboard = await getQuizDashboard();
  let filteredQuizzes = dashboard.quizzes;

  if (params?.search) {
    filteredQuizzes = filteredQuizzes.filter(
      (q) =>
        q.title.toLowerCase().includes(params.search!.toLowerCase()) ||
        q.description?.toLowerCase().includes(params.search!.toLowerCase())
    );
  }

  if (params?.status && params.status !== "All Status") {
    filteredQuizzes = filteredQuizzes.filter((q) => q.status === params.status);
  }

  if (params?.category && params.category !== "All categories") {
    filteredQuizzes = filteredQuizzes.filter((q) => q.category === params.category);
  }

  return {
    content: filteredQuizzes,
    totalElements: filteredQuizzes.length,
  };
}

export async function getQuizById(quizId: number): Promise<QuizDetails> {
  const response = await axiosInstance.get<QuizDetails>(
    `/admin/quizzes/getQuizDetail/${quizId}`
  );
  return response.data;
}

export async function getQuizAnalytics(quizId: number): Promise<QuizAnalytics> {
  const response = await axiosInstance.get<QuizAnalytics>(`/admin/quiz/${quizId}/analytics`);
  return response.data;
}

export async function getQuizCategories(): Promise<QuizCategory[]> {
  const response = await axiosInstance.get<QuizCategory[]>("/admin/quiz/categories");
  return response.data;
}

export async function getCategoryStats(): Promise<CategoryStats> {
  const response = await axiosInstance.get<CategoryStats>("/admin/quiz/categories/stats");
  return response.data;
}

export async function getScheduledSessions(params?: {
  date?: string;
  view?: "calendar" | "list" | "upcoming";
}): Promise<ScheduledSession[]> {
  const response = await axiosInstance.get<ScheduledSession[]>("/admin/quiz/sessions", {
    params,
  });
  return response.data;
}

export async function getQuizSettings(): Promise<QuizSettings> {
  const response = await axiosInstance.get<QuizSettings>("/admin/quiz/settings");
  return response.data;
}

export type CreateQuizRequest = {
  title: string;
  description?: string;
  category: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  adminNotes?: string;
  estimatedLevel?: number;
  tags?: string[];
  questions: Array<{
    questionText: string;
    questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "TEXT_INPUT" | "FILE_UPLOAD";
    options?: string[];
    correctAnswer: string | number;
    explanation?: string;
    points?: number;
  }>;
  timeLimit?: {
    enabled: boolean;
    duration: number;
  };
  attempts?: number;
  passingScore: number;
  questionOrder: "SEQUENTIAL" | "RANDOM";
  showResult: "AFTER_COMPLETION" | "IMMEDIATELY" | "NEVER";
  accessControl: {
    requireLogin: boolean;
    verifiedProfessionals: boolean;
    premiumFeature: boolean;
  };
};

export type UpdateQuizRequest = Partial<CreateQuizRequest> & {
  id: number;
};

export async function createQuiz(data: CreateQuizRequest): Promise<Quiz> {
  const response = await axiosInstance.post<Quiz>("/admin/quiz/create", data);
  return response.data;
}

export async function updateQuiz(data: UpdateQuizRequest): Promise<Quiz> {
  const response = await axiosInstance.put<Quiz>(`/admin/quiz/${data.id}`, data);
  return response.data;
}

export async function deleteQuiz(quizId: number): Promise<void> {
  await axiosInstance.delete(`/admin/quiz/${quizId}`);
}

export async function archiveQuiz(quizId: number): Promise<void> {
  await axiosInstance.post(`/admin/quiz/${quizId}/archive`);
}

export async function publishQuiz(quizId: number): Promise<void> {
  await axiosInstance.post(`/admin/quiz/${quizId}/publish`);
}

export async function saveQuizDraft(data: CreateQuizRequest | UpdateQuizRequest): Promise<Quiz> {
  const response = await axiosInstance.post<Quiz>("/admin/quiz/draft", data);
  return response.data;
}

export async function scheduleSession(data: {
  quizId: number;
  startTime: string;
  endTime: string;
  duration: number;
}): Promise<ScheduledSession> {
  const response = await axiosInstance.post<ScheduledSession>("/admin/quiz/sessions", data);
  return response.data;
}

export async function createRecurringSchedule(data: {
  quizId: number;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  daysOfWeek?: number[];
  time: string;
  endDate?: string;
}): Promise<void> {
  await axiosInstance.post("/admin/quiz/sessions/recurring", data);
}

export async function updateQuizSettings(settings: Partial<QuizSettings>): Promise<QuizSettings> {
  const response = await axiosInstance.put<QuizSettings>("/admin/quiz/settings", settings);
  return response.data;
}

export async function createCategory(name: string, parentId?: number): Promise<QuizCategory> {
  const response = await axiosInstance.post<QuizCategory>("/admin/quiz/categories", {
    name,
    parentId,
  });
  return response.data;
}

export async function updateCategory(
  categoryId: number,
  name: string
): Promise<QuizCategory> {
  const response = await axiosInstance.put<QuizCategory>(`/admin/quiz/categories/${categoryId}`, {
    name,
  });
  return response.data;
}

export async function deleteCategory(categoryId: number): Promise<void> {
  await axiosInstance.delete(`/admin/quiz/categories/${categoryId}`);
}
