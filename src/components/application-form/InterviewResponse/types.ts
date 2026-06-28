export interface InterviewQuestion {
  id: string
  question: string
  maxScore: number
  timeLimitSeconds: number
  type: 'TEXT' | 'RADIO' | 'MULTIPLE_SELECT'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
}

export interface InterviewAnswer {
  id: string
  answerText: string
  score: number | null
  durationSeconds: number | null
  question: InterviewQuestion
}

export interface ApplicationScores {
  id: string
  resumeScore: number
  interviewScore: number
  technicalScore: number
  communicationScore: number
  problemSolvingScore: number
  cheatScore: number
  overallScore: number
  aiFeedback: string
  createdAt: string
}

export interface SecurityEvent {
  id: string
  type: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH'
  metadata: { timestamp: string; [key: string]: unknown }
  createdAt: string
}

export interface Interview {
  id: string
  durationMinutes: number
  status: 'COMPLETED' | 'CANCELLED' | 'IN_PROGRESS' | 'PENDING'
  scheduledStartAt: string
  scheduledEndAt: string
  totalQuestions: number
  totalScore: number | null
  startedAt: string | null
  completedAt: string | null
  createdAt: string
  answers: InterviewAnswer[]
  questionBank: { id: string; title: string }
  application: { scores: ApplicationScores } | null
  scores: ApplicationScores[]
  securityEvents: SecurityEvent[]
}