export type QuizAttempt = {
  id: number;
  professionalName: string;
  score: number;
  passed: boolean;
  duration: number;
  completedAt: string;
  timeAgo?: string;
  action?: string;
  timestamp?: string;
};

export type QuizDetails = {
  id: number;
  title: string;
  description?: string;
  category?: string;
  skill?: string;
  questionsCount?: number;
  timeLimitMinutes?: number;
  difficulty?: string;
  passingScore?: number;
  status?: string;
  createdAt: string;
  lastUpdated?: string;
  lastActivity?: string;
  averageScore?: number;
  totalAttempts?: number;
  passRate?: number;
  analytics?: {
    totalAttempts: number;
    averageScore: number;
    passRate: number;
    averageTimeTaken: number;
    activeSessions: number;
    scoreDistribution: { range: string; count: number; percentage: number }[];
  };
  recentActivities?: QuizAttempt[];
  performanceByQuestion?: {
    questionId: number;
    questionText: string;
    correctPercentage: number;
    avgTimeSeconds: number;
    difficulty: string;
  }[];
};