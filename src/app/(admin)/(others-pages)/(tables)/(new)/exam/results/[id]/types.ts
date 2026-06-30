
export type QuestionOutcome = "CORRECT" | "INCORRECT" | "SKIPPED";

export type ExamOption = {
  id: string;
  text: string;
};
 

export type ResultQuestion = {
  id: string;
  question: string;
  imageUrl: string | null;
  subjectId: string;
  subjectName: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | string;
  marks: number;
  negativeMarks: number;
  options: ExamOption[];
  correctOptionId: string;
  selectedOptionId: string | null;
  description:string,
  outcome: QuestionOutcome;
  marksAwarded: number;
};

export type SubjectBreakdown = {
  subjectId: string;
  subjectName: string;
  total: number;
  correct: number;
  incorrect: number;
  skipped: number;
  marksScored: number;
  marksTotal: number;
};

export type DifficultyBreakdown = {
  difficulty: "EASY" | "MEDIUM" | "HARD" | string;
  total: number;
  correct: number;
};

export type ExamResult = {
  sessionId: string;
  mockTestId: string;
  mockTestTitle: string;
  submittedAt: string;
  durationMinutes: number;
  timeTakenSeconds: number;

  totalMarks: number;
  correctScore: number;
  negativeScore: number;
  netScore: number;
  accuracy: number; // 0-100, based on attempted questions only
  rank: number | null;
  totalParticipants: number | null;
  scoredMarks ?:number,
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  totalQuestions: number;
  percentile?:string,
  subjectBreakdown: SubjectBreakdown[];
  difficultyBreakdown: DifficultyBreakdown[];
  questions: ResultQuestion[];
};