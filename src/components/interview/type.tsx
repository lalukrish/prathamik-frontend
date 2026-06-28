
import type { ReactNode } from "react"

export interface Question {
  weight: ReactNode
  id: string                   // interviewQuestion row id — use as questionId in payloads
  interviewId: string
  questionId: string
  question: string
  type: "TEXT" | "RADIO" | "MULTIPLE_SELECT"|"VOICE_TYPE"
  difficulty: "EASY" | "MEDIUM" | "HARD"
  skillTags: string[]
  options: string[]
  correctAnswer: string | null
  audioUrl: string | null
  aiGenerated: boolean
  order: number
  maxScore: number
  timeLimitSeconds: number
  createdAt: string
}

/** GET /public/interviews/:token/question?order=N */
export interface QuestionResponse {
  completed: boolean     // true → no more questions, proceed to final submit
  question: Question
}

export interface InterviewMeta {
  status: string
  scheduledStartAt: string    // ISO date string
  durationMinutes: number     // total interview duration — shown on pre-start + resume screens
    totalQuestions:number

}

export interface ValidateResponse {
  // STARTED     → time is on, candidate hasn't clicked Start yet → PreStartScreen
  // IN_PROGRESS → candidate already clicked Start               → ResumeScreen
  status: "SCHEDULED" | "PENDING" | "STARTED" | "IN_PROGRESS" | "INVALID" | "EXPIRED" | "CANCELLED" | "COMPLETED"
  message?: string
  interview?: InterviewMeta   // present only for STARTED and IN_PROGRESS
}

/**
 * POST /public/interviews/:token/answer
 * One call per question.
 */
export interface AnswerPayload {
  questionId: string   // Question.id
  answer: string       // MULTIPLE_SELECT joined with ", "
  durationSeconds: number    // seconds elapsed since question was shown
}

/**
 * POST /public/interviews/:token/security
 * Fired on every individual proctoring event.
 */
export type SecurityEventType = "TAB_SWITCH" | "MINIMIZE" | "FOCUS_LOST" |"WINDOW_BLUR"|"WINDOW_MINIMIZE"| "FULLSCREEN_EXIT"|"COPY_PASTE"|"RIGHT_CLICK"|"MULTIPLE_MONITORS"|"DEVTOOLS_OPEN"| "NETWORK_DISCONNECT"|"LONG_INACTIVITY"|  "MULTIPLE_FACES"|"VOICE_MISMATCH"|"RAPID_ANSWERING"|"SUSPICIOUS_TYPING"


export interface SecurityEventPayload {
  event: SecurityEventType
  timestamp: string   // ISO string — new Date().toISOString()
}

/**
 * POST /public/interviews/:token/submit
 * Final call — session-level proctoring totals.
 */
export interface FinalSubmitPayload {
  tabSwitchCount: number
  minimizeCount: number
  focusLostCount: number
}

// ─── Page state ───────────────────────────────────────────────────────────────
// loading      → validate in-flight
// invalid      → token unrecognised
// expired      → EXPIRED / admin-cancelled
// not_started  → SCHEDULED / PENDING — too early
// pre_start    → STARTED — show rules + duration + Start button
// starting     → POST /start in-flight
// resume       → IN_PROGRESS — show Resume + duration + Cancel
// resuming     → GET /question in-flight after Resume
// ready        → question loaded, candidate answering
// answering    → POST /answer in-flight
// fetching     → GET /question in-flight between questions
// done         → completed: true or final submit done
// cancelled    → candidate self-cancelled
export type PageState =
  | "loading"
  | "invalid"
  | "expired"
  | "not_started"
  | "pre_start"
  | "starting"
  | "resume"
  | "resuming"
  | "ready"
  | "answering"
  | "fetching"
  | "done"
  | "cancelled"

// ─── UI constants ─────────────────────────────────────────────────────────────

export const DIFFICULTY_CONFIG = {
  EASY:   { label: "Easy",   color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  MEDIUM: { label: "Medium", color: "text-amber-600 bg-amber-50 border-amber-200"       },
  HARD:   { label: "Hard",   color: "text-rose-600 bg-rose-50 border-rose-200"          },
} as const

export const INTERVIEW_RULES = [
  "Answer every question to the best of your ability.",
  "Each question may have a time limit — stay focused.",
  "Do not refresh the page during the interview.",
  "Your answers are saved as you navigate between questions.",
  "Once submitted, you cannot change your responses.",
  "Ensure a stable internet connection before starting.",
]