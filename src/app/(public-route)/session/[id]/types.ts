export type QuestionStatus = "not_attempted" | "answered" | "not_answered" | "review" | "current";

export interface Option {
  id: string;
  text: string;
}

export interface Subject {
  id: string;
  name: string;
  createdAt: string;
}

export interface Question {
  id: string;
  question: string;
  subject?: Subject;
  subjectId?: string;
  type: string;
  marks: number;
  negativeMarks: number;
  difficulty: string;
  sortOrder: number;
  options: Option[];
}

export interface MockTest {
  id: string;
  title: string;
  questions: Question[];
  sections?: Section[];
}

export interface Section {
  name: string;
  questionIds: string[];
}

export interface ExamSession {
  id: string;
  remainingSeconds: number;
  status: "active" | "paused" | "submitted";
  mockTest: MockTest;
  answers?: Record<string, string>; // questionId -> optionId
  markedForReview?: string[]; // questionIds
}