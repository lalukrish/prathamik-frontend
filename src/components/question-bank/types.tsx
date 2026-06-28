export type QuestionType = "TEXT" | "MULTIPLE_SELECT" | "RADIO" | "VOICE_SPEAK" | "VOICE_TYPE"
export type Difficulty   = "EASY" | "MEDIUM" | "HARD"

export interface ApiQuestion {
  id: string
  questionBankId: string
  question: string
  type: QuestionType
  difficulty: Difficulty
  weight: number
  timeLimitSeconds: number
  skillTags: string[]
  options: string[]
  audioUrl: string | null
  aiGenerated: boolean
  createdAt: string
}

export interface QuestionBank {
  id: string
  title: string
  description: string
  totalQuestions: number
  questions: ApiQuestion[]
  mode:string
}

export interface QuestionForm {
  question: string
  type: QuestionType
  difficulty: Difficulty
  weight: number
  timeLimitSeconds: number
  skillTags: string[]
  options: string[]
  audioUrl: string
}

export type FormErrors = Partial<Record<keyof QuestionForm, string>>

export const EMPTY_FORM: QuestionForm = {
  question:         "",
  type:             "TEXT",
  difficulty:       "EASY",
  weight:           5,
  timeLimitSeconds: 60,
  skillTags:        [],
  options:          [],
  audioUrl:         "",
}

export const TYPE_META: Record<QuestionType, { label: string; classes: string; dot: string }> = {
  TEXT:            { label: "Text",            classes: "bg-blue-50 text-blue-700 ring-blue-200",          dot: "bg-blue-500"    },
  MULTIPLE_SELECT: { label: "Multiple Select", classes: "bg-violet-50 text-violet-700 ring-violet-200",    dot: "bg-violet-500"  },
  RADIO:           { label: "Radio",           classes: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  VOICE_SPEAK:     { label: "Voice Speak",     classes: "bg-amber-50 text-amber-700 ring-amber-200",       dot: "bg-amber-500"   },
  VOICE_TYPE:      { label: "Voice Type",      classes: "bg-rose-50 text-rose-700 ring-rose-200",          dot: "bg-rose-500"    },
}

export const DIFFICULTY_META: Record<Difficulty, { label: string; classes: string }> = {
  EASY:   { label: "Easy",   classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  MEDIUM: { label: "Medium", classes: "bg-amber-50 text-amber-700 border-amber-200"       },
  HARD:   { label: "Hard",   classes: "bg-red-50 text-red-700 border-red-200"             },
}

export const TYPE_OPTIONS = [
  { value: "TEXT",            label: "Text"            },
  { value: "MULTIPLE_SELECT", label: "Multiple Select" },
  { value: "RADIO",           label: "Radio"           },
  { value: "VOICE_SPEAK",     label: "Voice Speak"     },
  { value: "VOICE_TYPE",      label: "Voice Type"      },
]

export const DIFFICULTY_OPTIONS = [
  { value: "EASY",   label: "Easy"   },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD",   label: "Hard"   },
]

export function validateForm(form: QuestionForm): FormErrors {
  const errors: FormErrors = {}
  if (!form.question.trim())
    errors.question = "Question text is required."
  if (form.type === "RADIO" || form.type === "MULTIPLE_SELECT") {
    if (form.options.filter(o => o.trim()).length < 2)
      errors.options = "Please add at least 2 options."
  }
  if (!form.weight || form.weight < 1 || form.weight > 100)
    errors.weight = "Marks must be between 1 and 100."
  if (!form.timeLimitSeconds || form.timeLimitSeconds < 10)
    errors.timeLimitSeconds = "Time limit must be at least 10 seconds."
  if (form.type === "VOICE_TYPE" && form.audioUrl) {
    try { new URL(form.audioUrl) }
    catch { errors.audioUrl = "Enter a valid URL." }
  }
  return errors
}

export function buildPayload(form: QuestionForm) {
  const base = {
    question:         form.question,
    type:             form.type,
    difficulty:       form.difficulty,
    weight:           Number(form.weight),
    timeLimitSeconds: Number(form.timeLimitSeconds),
    skillTags:        form.skillTags,
  }
  if (form.type === "RADIO" || form.type === "MULTIPLE_SELECT")
    return { ...base, options: form.options.filter(Boolean) }
  if (form.type === "VOICE_TYPE")
    return { ...base, audioUrl: form.audioUrl || undefined }
  return base
}