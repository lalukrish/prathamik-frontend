export interface SubjectPerformance {
  subject: string;
  scored: number;
  maxMarks: number;
  percentage: number;
}

export interface DashboardStats {
  totalTests: number;
  avgScore: number;
  bestScore: number;
  overallAccuracy: number;
  totalNegativeMarks: number;
    streakDays: number;
  subjectPerformance: SubjectPerformance[];
}

export interface AttendedTest {
  sessionId: string;
  mockTestId: string;
  title: string;
  status: string;
  startedAt: string;
  submittedAt: string | null;
  timeTakenSeconds: number | null;
  score: {
    final: number;
    positive: number;
    negative: number;
    total: number;
    percentage: number;
  };
  questions: {
    total: number;
    attempted: number;
    correct: number;
    incorrect: number;
    skipped: number;
    accuracy: number;
  };
  subjectBreakdown: {
    subjectId: string;
    subjectName: string;
    total: number;
    attempted: number;
    correct: number;
    incorrect: number;
    skipped: number;
    scored: number;
    maxMarks: number;
    negativeMarks: number;
  }[];
}

export interface InProgressTest {
  sessionId: string;
  mockTestId: string;
  title: string;
  status: "IN_PROGRESS" | "PAUSED";
  startedAt: string;
  remainingSeconds: number;
  totalMarks: number;
  durationMinutes: number;
}