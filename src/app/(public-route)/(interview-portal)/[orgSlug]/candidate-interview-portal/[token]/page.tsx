'use client'

import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"  // already there, just confirming
import api from "@/lib/axios"

import {
  PageState,
  ValidateResponse,
  InterviewMeta,
  Question,
  QuestionResponse,
  AnswerPayload,
  FinalSubmitPayload,
  SecurityEventType,
} from "@/components/interview/type"
import {
  LoadingScreen,
  InvalidScreen,
  NotStartedScreen,
  ThankYouScreen,
  CancelledScreen,
} from "@/components/interview/statusScreen"
import { ResumeScreen }   from "@/components/interview/resumeScreen"
import { PreStartScreen } from "@/components/interview/PreStartScreen"
import { QuestionView }   from "@/components/interview/QuestionView"
import { useProctoring }  from "@/components/interview/useProctoring"



const SECURITY_MESSAGES: Partial<Record<SecurityEventType, string>> = {
  TAB_SWITCH:         "⚠️ Tab switch detected",
  WINDOW_BLUR:        "⚠️ Window focus lost",
  WINDOW_MINIMIZE:    "⚠️ Window minimized",
  FULLSCREEN_EXIT:    "⚠️ Fullscreen exited — please stay in fullscreen",
  COPY_PASTE:         "⚠️ Copy/paste detected",
  RIGHT_CLICK:        "⚠️ Right-click detected",
  MULTIPLE_MONITORS:  "⚠️ Multiple monitors detected",
  DEVTOOLS_OPEN:      "⚠️ Developer tools detected",
  NETWORK_DISCONNECT: "⚠️ Network disconnected",
  LONG_INACTIVITY:    "⚠️ Inactivity detected",
  MULTIPLE_FACES:     "⚠️ Multiple faces detected",  // ← add missing type
  VOICE_MISMATCH:"⚠️ Voice Mismatched",
  RAPID_ANSWERING:"⚠️ Rapid Answering",
  SUSPICIOUS_TYPING:"⚠️ Suspecious typing detected"
}

export default function InterviewPage() {
  const params = useParams()
  const token  = params?.token as string

  const [pageState,       setPageState]       = useState<PageState>("loading")
  const [validateMessage, setValidateMessage] = useState<string | undefined>()
  const [interviewMeta,   setInterviewMeta]   = useState<InterviewMeta | undefined>()
  const [question,        setQuestion]        = useState<Question | null>(null)
  const [questionNumber,  setQuestionNumber]  = useState(1)   // 1-based, tracks current order

const [proctoringEnabled, setProctoringEnabled] = useState(false)
const [securityWarning, setSecurityWarning] = useState<string | null>(null)
const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

const { getTotalsAndClear, reportEvent, lastEvent } = useProctoring(token ?? "", proctoringEnabled)

// In page.tsx — replace the proctoringEnabled effect
useEffect(() => {
  if (!proctoringEnabled) return

  const checkMultiMonitor = async () => {
    let detected = false

    if ("getScreenDetails" in window) {
      try {
        const details = await (window as any).getScreenDetails()
        if (details.screens.length > 1) detected = true
      } catch {}
    }

    if (!detected) {
      const sl = window.screenLeft ?? window.screenX ?? 0
      if (sl < 0 || sl >= window.screen.width) detected = true
    }

    if (!detected) {
      if (window.screen.availWidth > window.screen.width + 100) detected = true
    }

    if (detected) {
      reportEvent("MULTIPLE_MONITORS", {
        screenWidth:      window.screen.width,
        screenAvailWidth: window.screen.availWidth,
        screenLeft:       window.screenLeft ?? window.screenX,
      })
    }
  }

  checkMultiMonitor()
}, [proctoringEnabled])

  // ── Step 1: Validate token ──────────────────────────────────────────────────
  useEffect(() => {
    if (!token) return
    const validate = async () => {
      try {
        const res    = await api.get(`/public/interviews/${token}/validate`)
        const result: ValidateResponse = res.data?.data
        switch (result.status) {
          case "INVALID":   setPageState("invalid");   break
          case "EXPIRED":   setPageState("expired");   break
          case "CANCELLED": setPageState("cancelled"); break
          case "COMPLETED": setPageState("done");      break

          case "SCHEDULED":
          case "PENDING":
            // Too early — NotStartedScreen reads scheduledStartAt from message or meta
            setValidateMessage(result.message)
            setPageState("not_started")
            break

          case "STARTED":
            // Time is on, hasn't clicked Start yet → show rules + duration
            setInterviewMeta(result.interview)
            setPageState("pre_start")
            break

          case "IN_PROGRESS":
            // Already clicked Start → show Resume + duration
            // setProctoringEnabled(true)
            setInterviewMeta(result.interview)
            setPageState("resume")
            break

          default:
            setPageState("invalid")
        }
      } catch {
            setProctoringEnabled(false)
        setPageState("invalid")
      }
    }
    validate()
  }, [token])

useEffect(() => {
  if (!lastEvent) return
  const msg = SECURITY_MESSAGES[lastEvent]
  if (!msg) return
  setSecurityWarning(msg)
 if (warningTimer.current) clearTimeout(warningTimer.current)
warningTimer.current = setTimeout(() => setSecurityWarning(null), 4000)
}, [lastEvent])

// ── Fullscreen helpers ───────────────────────────────────────────────────────
const enterFullscreen = () => {
  document.documentElement.requestFullscreen?.().catch(() => {})
}

  // ── Shared: GET /question?order=N ───────────────────────────────────────────
  const fetchQuestion = async (order: number): Promise<"next" | "completed"> => {
    const res  = await api.get(`/public/interviews/${token}/question`, { params: { order } })
    const data: QuestionResponse = res.data?.data
    if (data.completed) return "completed"
    setQuestion(data.question)
    setQuestionNumber(order)
    return "next"
  }

  // ── Step 2a: Fresh start — POST /start → fetch Q1 ──────────────────────────
  const handleStart = async () => {
    setPageState("starting")
      enterFullscreen()   // ← add this

    try {
      await api.get(`/public/interviews/${token}/start`)
      const result = await fetchQuestion(1)
    setProctoringEnabled(true)  // ✅ /start succeeded = interview is now IN_PROGRESS

      if (result === "completed") {
        await doFinalSubmit()
      } else {
        setPageState("ready")
      }
    } catch {
      setPageState("pre_start")
    }
  }

  // ── Step 2b: Resume — skip /start, fetch from order 1 (backend returns first unanswered) ──
  const handleResume = async () => {
    setPageState("resuming")
      enterFullscreen()   // ← add this

    try {
      const result = await fetchQuestion(1)
      if (result === "completed") {
        await doFinalSubmit()
      } else {
        setPageState("ready")
      }
    } catch {
      setPageState("resume")
    }
  }

  // ── Cancel ──────────────────────────────────────────────────────────────────
  const handleCancel = async (reason: string) => {
    await api.post(`/public/interviews/${token}/cancel`, { reason })
     if (document.fullscreenElement) {
    document.exitFullscreen?.().catch(() => {})
  }
    setPageState("cancelled")
  }

  // ── Step 3: Submit one answer then fetch next question ──────────────────────
  const handleSubmitAnswer = async (payload: Omit<AnswerPayload, "questionId">) => {
    if (!question) return
    setPageState("answering")
    console.log("payload",payload)
    try {
      await api.post(`/public/interviews/${token}/answer`, {
        questionId: question.id,

        answer:     payload.answer,
  durationSeconds: payload.durationSeconds,  // ← match the type field name
      } satisfies AnswerPayload)

      setPageState("fetching")
      const nextOrder = questionNumber + 1
      const result    = await fetchQuestion(nextOrder)

      if (result === "completed") {
        await doFinalSubmit()
      } else {
        setPageState("ready")
      }
    } catch {
      setPageState("ready")   // stay on same question so they can retry
    }
  }

  // ── Step 4: Final submit — proctoring totals only ───────────────────────────
const doFinalSubmit = async () => {
  setProctoringEnabled(false)
  const totals = getTotalsAndClear()
  try {
    await api.post(`/public/interviews/${token}/complete`, {
      tabSwitchCount: 0,
      minimizeCount: 0,
      focusLostCount: 0,
      ...totals,           // ← overrides with real values if present
    } satisfies FinalSubmitPayload)
  } catch {}
  if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {})
  setPageState("done")
}

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/20 flex items-center justify-center p-4">
       {securityWarning && (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-red-600 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl animate-bounce-once">
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        {securityWarning}
      </div>
    )}
      <div className="w-full max-w-xl">

        {/* Logo strip */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-md shadow-blue-200">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-600 tracking-tight">Interview Portal</span>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">

          {pageState === "loading"     && <LoadingScreen />}
          {pageState === "invalid"     && <InvalidScreen type="invalid" />}
          {pageState === "expired"     && <InvalidScreen type="expired" />}
          {pageState === "not_started" && <NotStartedScreen message={validateMessage} />}
          {pageState === "done"        && <ThankYouScreen />}
          {pageState === "cancelled"   && <CancelledScreen />}

          {/* STARTED — rules + duration + Start + Cancel */}
          {(pageState === "pre_start" || pageState === "starting") && (
            <PreStartScreen
              loading={pageState === "starting"}
              interview={interviewMeta}
              onStart={handleStart}
              onCancel={handleCancel}
            />
          )}

          {/* IN_PROGRESS — duration + Resume + Cancel */}
          {(pageState === "resume" || pageState === "resuming") && (
            <ResumeScreen
              loading={pageState === "resuming"}
              interview={interviewMeta}
              onResume={handleResume}
              onCancel={handleCancel}
            />
          )}

          {/* Between questions */}
          {pageState === "fetching" && (
            <div className="flex flex-col items-center justify-center py-20 px-8">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-slate-500">Loading next question…</p>
            </div>
          )}

          {/* Active question */}
          {(pageState === "ready" || pageState === "answering") && question && (
            <QuestionView
              key={question.id}           // remount on new question = fresh state + timer reset
              token={token}
              question={question}
              questionNumber={questionNumber}
              submitting={pageState === "answering"}
                totalQuestions={interviewMeta?.totalQuestions ?? 0}  // ← add this

              onSubmitAnswer={handleSubmitAnswer}
            />
          )}

        </div>
      </div>
    </div>
  )
}