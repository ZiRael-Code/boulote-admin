export type QuizStatus = "Active" | "Inactive" | "Draft" | "Archived";

export type QuizDifficulty = "EASY" | "MEDIUM" | "HARD";

export type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "TEXT_INPUT" | "FILE_UPLOAD";

export type QuizCategory = {
  id: number;
  name: string;
  quizCount: number;
  parentId?: number;
};

export type QuizQuestion = {
  id?: number;
  questionText: string;
  questionType: QuestionType;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points?: number;
};

export type Quiz = {
  id: number;
  title: string;
  description?: string;
  category: string;
  skill: string;
  difficulty?: QuizDifficulty;
  status: QuizStatus;
  timeLimitMinutes: number;
  passingScore?: number;
  questionsCount: number;
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  createdAt: string;
  lastUpdated: string;
  lastActivity: string;
};

export type QuizStats = {
  totalQuizzes: number;
  activeQuizzes: number;
  totalAttempts: number;
  averagePassRate: number;
};

export type QuizDashboardResponse = {
  stats: QuizStats;
  quizzes: Quiz[];
};

export type QuizAnalyticsData = {
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  averageTimeTaken: number;
  activeSessions: number;
  scoreDistribution: number[];
};

export type QuizDetails = Quiz & {
  difficulty: QuizDifficulty;
  passingScore: number;
  analytics: QuizAnalyticsData;
  recentActivities: QuizAttempt[];
};

export type QuizAttempt = {
  id: number;
  professionalName: string;
  score: number;
  passed: boolean;
  duration: number;
  completedAt: string;
};

export type QuizSchedulingInfo = {
  scheduledSessions: ScheduledSession[];
  recurringSchedule?: RecurringSchedule;
};

export type ScheduledSession = {
  id: number;
  quizId: number;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  status: "UPCOMING" | "LIVE" | "COMPLETED" | "CANCELLED";
  participants: number;
  registeredParticipants: number;
};

export type RecurringSchedule = {
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  daysOfWeek?: number[];
  time: string;
  endDate?: string;
};

export type QuizAnalytics = {
  quizId: number;
  quizTitle: string;
  performanceByQuestion: QuestionPerformance[];
  recentAttempts: QuizAttempt[];
  overallStats: {
    totalAttempts: number;
    avgScore: number;
    avgPassRate: number;
    avgDuration: number;
  };
};

export type QuestionPerformance = {
  questionId: number;
  questionText: string;
  correctPercentage: number;
  avgTime: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
};

export type QuizSettings = {
  defaultDuration: number;
  autoSaveInterval: number;
  defaultPassingScore: number;
  estimatedLevel: number;
  maxQuestionsPerQuiz: number;
  enabledQuestionTypes: QuestionType[];
  requireAuthentication: boolean;
  allowAnonymousAttempts: boolean;
  trackProgress: boolean;
  enablePublicSharing: boolean;
};

export type CategoryStats = {
  programmingQuizzes: number;
  designQuizzes: number;
  marketingQuizzes: number;
  programmingTrend: "+5 this month" | "No change";
  designTrend: "+5 this month" | "No change";
  marketingTrend: "+5 this month" | "No change";
};
