'use client'

import { useState, useCallback, useEffect, useRef } from "react"
import { Question, AnswerPayload, DIFFICULTY_CONFIG } from "./type"
import { useQuestionTimer } from "./Usequestiontimer"
import { VoicePlayer } from "../question-bank/voice-qusetion"

// ─── Timer display ────────────────────────────────────────────────────────────


function TimerDisplay({
  remaining,
  total,
}: {
  remaining: number
  total: number
}) {
  const expired = remaining <= 0
  const warning = remaining <= 10 && remaining > 0
  const pct     = Math.max(0, (remaining / total) * 100)

  const trackColor = expired ? "bg-rose-200"   : warning ? "bg-amber-100" : "bg-slate-100"
  const fillColor  = expired ? "bg-rose-400"   : warning ? "bg-amber-400" : "bg-emerald-400"
  const textColor  = expired ? "text-rose-500" : warning ? "text-amber-600" : "text-slate-500"

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0")
  const ss = String(remaining % 60).padStart(2, "0")

  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-24 h-1.5 rounded-full overflow-hidden ${trackColor}`}>
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${fillColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-bold tabular-nums ${textColor}`}>
        {mm}:{ss}
      </span>
    </div>
  )
}

// ─── Answer inputs ────────────────────────────────────────────────────────────

function TextAnswer({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer here…"
        rows={6}
        className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-700 placeholder-slate-300 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all leading-relaxed"
      />
      <span className="absolute bottom-3 right-4 text-[11px] text-slate-300 font-medium">
        {value.length} chars
      </span>
    </div>
  )
}

function RadioAnswer({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((opt) => {
        const selected = value === opt
        return (
          <button key={opt} onClick={() => onChange(opt)}
            className={`flex items-center gap-3.5 w-full text-left px-4 py-3.5 rounded-2xl border text-sm font-medium transition-all duration-150 ${
              selected
                ? "border-blue-400 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <span className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selected ? "border-blue-500 bg-blue-500" : "border-slate-300"}`}>
              {selected && <span className="w-2 h-2 rounded-full bg-white" />}
            </span>
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function MultiSelectAnswer({ options, value, onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) =>
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt])
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Select all that apply</p>
      {options.map((opt) => {
        const selected = value.includes(opt)
        return (
          <button key={opt} onClick={() => toggle(opt)}
            className={`flex items-center gap-3.5 w-full text-left px-4 py-3.5 rounded-2xl border text-sm font-medium transition-all duration-150 ${
              selected
                ? "border-violet-400 bg-violet-50 text-violet-700 shadow-sm shadow-violet-100"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <span className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selected ? "border-violet-500 bg-violet-500" : "border-slate-300"}`}>
              {selected && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            {opt}
          </button>
        )
      })}
    </div>
  )
}

// ─── QuestionView ─────────────────────────────────────────────────────────────

interface QuestionViewProps {
  token: string
  question: Question
  questionNumber: number   // 1-based display
  totalQuestions: number   // total known so far (may grow)
  submitting: boolean
  /** Called with per-answer payload — parent handles POST /answer */
  onSubmitAnswer: (payload: Omit<AnswerPayload, "questionId">) => void
}

export function QuestionView({
  token,
  question,
  questionNumber,
  totalQuestions,
  submitting,
  onSubmitAnswer,
}: QuestionViewProps) {
  const [answer, setAnswer] = useState<string | string[]>(
    question.type === "MULTIPLE_SELECT" ? [] : ""
  )
  const [timerExpired, setTimerExpired] = useState(false)

  const answerRef    = useRef<string | string[]>(answer)
  const submittedRef = useRef(false)   // prevent double-submit

  useEffect(() => { answerRef.current = answer }, [answer])

  // ── Timer — callback uses refs, no circular dep ──────────────────────────
  const onTimerExpire = useCallback(() => {
    setTimerExpired(true)
  }, [])

  const { remaining, getTimeTaken, clearStorage } = useQuestionTimer(
    question.id,
    token,
    question.timeLimitSeconds,
    onTimerExpire,
  )

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(() => {
    if (submittedRef.current) return
    submittedRef.current = true
    const timeTaken = getTimeTaken()
    const raw       = answerRef.current
    const answerStr = Array.isArray(raw)
      ? (raw.length > 0 ? raw.join(", ") : "not answered")
      : (raw.trim() || "not answered")
    clearStorage()
    onSubmitAnswer({ answer: answerStr, durationSeconds: timeTaken})
  }, [getTimeTaken, clearStorage, onSubmitAnswer])

  // ── Auto-submit when timer expires ───────────────────────────────────────
  useEffect(() => {
    if (timerExpired) handleSubmit()
  }, [timerExpired])   // eslint-disable-line react-hooks/exhaustive-deps

  const diff    = DIFFICULTY_CONFIG[question.difficulty]
  const isEmpty = Array.isArray(answer) ? answer.length === 0 : !answer.trim()

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">

      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between gap-3 mb-3">

          {/* Left: order + badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Q{questionNumber}
              {totalQuestions > 0 && (
                <span className="font-normal"> / {totalQuestions}</span>
              )}
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${diff.color}`}>
              {diff.label}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              {question.maxScore} pts
            </span>
            {question.skillTags.map((tag) => (
              <span key={tag} className="text-[11px] font-medium text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* Right: timer */}
          <div className="flex-shrink-0">
            <TimerDisplay remaining={remaining} total={question.timeLimitSeconds} />
          </div>
        </div>

      {question.type !== "VOICE_TYPE" && (
          <h2 className="text-base font-semibold text-slate-800 leading-relaxed">
            {question.question}
          </h2>
        )}
      </div>

      {/* Answer body */}
    <div className="px-6 py-5"
        onCopy={(e)        => e.preventDefault()}
        onCut={(e)         => e.preventDefault()}
        onPaste={(e)       => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      >
        {question.type === "VOICE_TYPE" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
              <VoicePlayer text={question.question}  />
              <p className="text-xs text-slate-400 font-medium">
                Listen to the question, then type your answer below
              </p>
            </div>
            <TextAnswer value={answer as string} onChange={setAnswer} />
          </div>
        )}
        {question.type === "TEXT" && (
          <TextAnswer value={answer as string} onChange={setAnswer} />
        )}
        {question.type === "RADIO" && (
          <RadioAnswer options={question.options} value={answer as string} onChange={setAnswer} />
        )}
        {question.type === "MULTIPLE_SELECT" && (
          <MultiSelectAnswer options={question.options} value={answer as string[]} onChange={(v) => setAnswer(v)} />
        )}
      </div>

      <div className="px-6 pb-6 pt-1 flex items-center justify-between gap-3">
        {isEmpty ? (
          <p className="text-xs text-slate-400">Answer to continue</p>
        ) : (
          <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Ready to submit
          </p>
        )}
        
        <button
          onClick={handleSubmit}
  disabled={submitting || timerExpired}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold shadow-md shadow-blue-200 hover:from-blue-700 hover:to-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {submitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              Submit Answer
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </>
          )}
        </button>
      </div>

    </div>
  )
}