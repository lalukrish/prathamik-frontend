

// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useParams, useRouter } from "next/navigation";


// import ExamTimer from "@/components/exam-page/ExamTimer";
// import QuestionView from "@/components/exam-page/QuestionVIew";
// import QuestionPalette from "@/components/exam-page/QuestionPalette";
// import ExamFooter from "@/components/exam-page/ExamFooter";

// import {
//   getSession,
//   submitAnswer,
//   submitTest,
//   pauseTest,
//   resumeTest,
// } from "@/shared/test";

// import type { ExamSession } from "./types";

// export default function ExamPage() {
//   const params = useParams();
//   const router = useRouter();
//   const sessionId = params.id as string;

//   const [session, setSession] = useState<ExamSession | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [remainingSeconds, setRemainingSeconds] = useState(0);

//   // questionId → optionId
//   const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
//   // set of questionIds marked for review
//   const [reviewSet, setReviewSet] = useState<Set<string>>(new Set());

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);

//   // ── Load session ──────────────────────────────────────────────
//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await getSession(sessionId);
//         const data: ExamSession = res.data;
//         setSession(data);
//         setRemainingSeconds(data.remainingSeconds);

//         // Pre-populate answers from server if session was resumed
//         if (data.answers) {
//           setSelectedOptions(data.answers);
//         }
//       } catch {
//         setError("Failed to load the exam. Please refresh.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [sessionId]);

//   // ── Pause / Resume ────────────────────────────────────────────
//   const handlePause = async () => {
//     if (!session || isPaused) return;
//     try {
//       await pauseTest(session.id);
//       setIsPaused(true);
//     } catch {}
//   };

//   const handleResume = async () => {
//     if (!session || !isPaused) return;
//     try {
//       await resumeTest(session.id);
//       setIsPaused(false);
//     } catch {}
//   };

//   // ── Countdown timer ───────────────────────────────────────────
//   useEffect(() => {
//     if (!session || remainingSeconds <= 0 || isPaused) return;

//     const timer = setInterval(() => {
//       setRemainingSeconds((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           handleAutoSubmit();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [session]); // only restart when session loads

//   // ── Helpers ───────────────────────────────────────────────────
//   const handleAutoSubmit = useCallback(async () => {
//     if (!session) return;
//     await submitTest(session.id);
//     router.push(`/exam/result/${session.id}`);
//   }, [session, router]);

//   const handleSelectOption = async (optionId: string) => {
//     if (!session) return;
//     const question = session.mockTest.questions[currentIndex];
//     if (!question) return;

//     setSelectedOptions((prev) => ({ ...prev, [question.id]: optionId }));

//     try {
//       await submitAnswer(session.id, question.id, optionId);
//     } catch {
//       // Optimistic update already applied; handle silently or show toast
//     }
//   };

//   const handleMarkReview = () => {
//     const question = session?.mockTest.questions[currentIndex];
//     if (!question) return;

//     setReviewSet((prev) => {
//       const next = new Set(prev);
//       if (next.has(question.id)) next.delete(question.id);
//       else next.add(question.id);
//       return next;
//     });
//   };

//   const handleSubmitTest = async () => {
//     if (!session || isSubmitting) return;
//     const confirmed = window.confirm("Are you sure you want to submit the test?");
//     if (!confirmed) return;

//     setIsSubmitting(true);
//     try {
//       await submitTest(session.id);
//       router.push(`/exam/result/${session.id}`);
//     } catch {
//       setIsSubmitting(false);
//     }
//   };

//   // ── Render states ─────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-slate-50">
//         <div className="flex flex-col items-center gap-3">
//           <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-500" />
//           <p className="text-sm text-slate-500">Loading your exam…</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !session) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-slate-50">
//         <p className="text-sm text-red-500">{error ?? "Session not found."}</p>
//       </div>
//     );
//   }

//   const questions = session.mockTest.questions;
//   const question = questions[currentIndex];
//   const sections = session.mockTest.sections;

//   if (!question) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <p className="text-slate-500">No questions found for this test.</p>
//       </div>
//     );
//   }

//   const answeredIds = new Set(Object.keys(selectedOptions));
//   const isMarkedForReview = reviewSet.has(question.id);

//   return (
//     <div className="flex h-screen flex-col overflow-hidden bg-slate-50 font-sans">
//       {/* ── Top Bar ─────────────────────────────────────────── */}
//       <header className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-3 shadow-sm">
//         <div className="flex items-center gap-3">
//           <div className="h-6 w-1 rounded-full bg-indigo-500" />
//           <h1 className="text-base font-semibold text-slate-800">
//             {session.mockTest.title}
//           </h1>
//         </div>
//         <div className="flex items-center gap-3">
//           <ExamTimer remainingSeconds={remainingSeconds} />
//           <button
//             onClick={isPaused ? handleResume : handlePause}
//             className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
//               isPaused
//                 ? "bg-indigo-500 text-white hover:bg-indigo-600"
//                 : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
//             }`}
//           >
//             {isPaused ? "▶ Resume" : "⏸ Pause"}
//           </button>
//         </div>
//       </header>

//       {/* ── Main layout ─────────────────────────────────────── */}
//       <div className="flex min-h-0 flex-1">
//         {/* Question area */}
//         <main className="relative flex min-w-0 flex-1 flex-col overflow-y-auto">
//           {isPaused && (
//             <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/90 backdrop-blur-sm">
//               <span className="text-4xl">⏸</span>
//               <p className="text-base font-semibold text-slate-700">Exam Paused</p>
//               <p className="text-sm text-slate-400">Click Resume to continue</p>
//             </div>
//           )}
//           <div className="flex-1 px-8 py-7">
//             <QuestionView
//               question={question}
//               questionNumber={currentIndex + 1}
//               totalQuestions={questions.length}
//               selectedOptionId={selectedOptions[question.id]}
//               onSelectOption={handleSelectOption}
//             />
//           </div>

//           {/* Footer pinned at bottom of main */}
//           <ExamFooter
//             currentIndex={currentIndex}
//             totalQuestions={questions.length}
//             isMarkedForReview={isMarkedForReview}
//             onPrev={() => setCurrentIndex((i) => Math.max(0, i - 1))}
//             onNext={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
//             onMarkReview={handleMarkReview}
//             onSubmit={handleSubmitTest}
//             isSubmitting={isSubmitting}
//           />
//         </main>

//         {/* Palette sidebar */}
//         <aside className="w-64 shrink-0 overflow-y-auto border-l border-slate-200 bg-white px-4 py-5">
//           <QuestionPalette
//             questions={questions}
//             currentIndex={currentIndex}
//             answeredIds={answeredIds}
//             reviewIds={reviewSet}
//             onNavigate={setCurrentIndex}
//             sections={sections}
//           />
//         </aside>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getSession,
  submitAnswer,
  submitTest,
  pauseTest,
  resumeTest,
} from "@/shared/test";

import type { ExamSession, ExamQuestion } from "./types";

// ─── Boxed digit timer (echoes the landing page's LiveTimer motif) ───────────

function BoxedTimer({ seconds }: { seconds: number }) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  const low = seconds <= 60;

  const units = [pad(h), pad(m), pad(s)];

  return (
    <div className="flex items-center gap-2.5">
      <span className="hidden text-xs font-semibold text-slate-500 sm:inline">Time left</span>
      <div className="flex items-center gap-1">
        {units.map((u, i) => (
          <span key={i} className="flex items-center gap-1">
            <span
              className={`rounded-lg px-2 py-1 font-mono text-sm font-bold tabular-nums sm:px-2.5 sm:text-base ${
                low ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-700"
              }`}
            >
              {u}
            </span>
            {i < 2 && <span className="text-sm font-bold text-slate-300">:</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Question meta row: marks, time on question, language, report ───────────

function QuestionMetaRow({
  questionNumber,
  marks,
  negativeMarks,
  timeOnQuestion,
}: {
  questionNumber: number;
  marks: number;
  negativeMarks: number;
  timeOnQuestion: number;
}) {
  const mm = String(Math.floor(timeOnQuestion / 60)).padStart(2, "0");
  const ss = String(timeOnQuestion % 60).padStart(2, "0");

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-3.5 sm:px-8">
      <h2 className="text-sm font-bold text-slate-800">Question {questionNumber}</h2>

      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Marks</span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-bold text-emerald-600">
            +{marks}
          </span>
          <span className="rounded-full bg-rose-50 px-2.5 py-1 font-bold text-rose-500">
            −{negativeMarks}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <span>Time on this question</span>
          <span className="font-mono font-semibold text-slate-600">{mm}:{ss}</span>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 text-slate-400 transition-colors hover:text-rose-500"
        >
          <span>⚑</span> Report
        </button>
      </div>
    </div>
  );
}

// ─── Question + options view ───────────────────────────────────────────────

function QuestionView({
  question,
  selectedOptionId,
  onSelectOption,
}: {
  question: ExamQuestion;
  selectedOptionId: string | undefined;
  onSelectOption: (optionId: string) => void;
}) {
  return (
    <div className="px-6 py-7 sm:px-8">
      {question.imageUrl && (
        <img
          src={question.imageUrl}
          alt=""
          className="mb-5 max-h-72 rounded-xl border border-slate-100 object-contain"
        />
      )}

      <p className="mb-7 whitespace-pre-line text-[15px] leading-relaxed text-slate-800">
        {question.question}
      </p>

      <div className="flex flex-col gap-3">
        {question.options.map((opt, i) => {
          const selected = selectedOptionId === opt.id;
          return (
            <label
              key={opt.id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-sm transition-all ${
                selected
                  ? "border-sky-400 bg-sky-50 text-sky-800"
                  : "border-slate-150 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                  selected
                    ? "border-sky-400 bg-sky-400 text-white"
                    : "border-slate-300 text-transparent"
                }`}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <input
                type="radio"
                name={`question-${question.id}`}
                className="sr-only"
                checked={selected}
                onChange={() => onSelectOption(opt.id)}
              />
              <span className="leading-relaxed">{opt.text}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// ─── Bottom action bar ───────────────────────────────────────────────────────

function ExamFooter({
  isMarkedForReview,
  isSubmitting,
  hasSelection,
  onClear,
  onMarkReviewAndNext,
  onSaveAndNext,
}: {
  isMarkedForReview: boolean;
  isSubmitting: boolean;
  hasSelection: boolean;
  onClear: () => void;
  onMarkReviewAndNext: () => void;
  onSaveAndNext: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-3.5 sm:px-8">
      <div className="flex gap-2.5">
        <button
          onClick={onMarkReviewAndNext}
          className={`rounded-xl border px-4 py-2.5 text-xs font-bold transition-colors sm:text-sm ${
            isMarkedForReview
              ? "border-violet-300 bg-violet-50 text-violet-600"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          {isMarkedForReview ? "★ Marked" : "☆ Mark for review & next"}
        </button>
        <button
          onClick={onClear}
          disabled={!hasSelection}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
        >
          Clear response
        </button>
      </div>

      <button
        onClick={onSaveAndNext}
        disabled={isSubmitting}
        className="rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-60 sm:text-sm"
      >
        Save & next →
      </button>
    </div>
  );
}

// ─── Palette legend ──────────────────────────────────────────────────────────

function PaletteLegend({
  answered,
  marked,
  markedAndAnswered,
  notVisited,
  notAnswered,
}: {
  answered: number;
  marked: number;
  markedAndAnswered: number;
  notVisited: number;
  notAnswered: number;
}) {
  const items = [
    { label: "Answered", count: answered, dot: "bg-emerald-400" },
    { label: "Marked", count: marked, dot: "bg-violet-400" },
    { label: "Not visited", count: notVisited, dot: "bg-slate-300" },
    { label: "Marked & answered", count: markedAndAnswered, dot: "bg-violet-400 ring-2 ring-emerald-300" },
    { label: "Not answered", count: notAnswered, dot: "bg-rose-400" },
  ];

  return (
    <div className="grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-1">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-2">
          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${it.dot}`}>
            {it.count}
          </span>
          <span className="text-slate-500">{it.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Question palette grid ───────────────────────────────────────────────────

function QuestionPalette({
  questions,
  currentIndex,
  answeredIds,
  reviewIds,
  onNavigate,
}: {
  questions: ExamQuestion[];
  currentIndex: number;
  answeredIds: Set<string>;
  reviewIds: Set<string>;
  onNavigate: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {questions.map((q, i) => {
        const isCurrent = i === currentIndex;
        const isAnswered = answeredIds.has(q.id);
        const isMarked = reviewIds.has(q.id);

        let classes = "border-slate-200 bg-white text-slate-600 hover:border-slate-300";
        if (isMarked && isAnswered) classes = "border-violet-400 bg-violet-400 text-white ring-2 ring-emerald-300";
        else if (isMarked) classes = "border-violet-400 bg-violet-400 text-white";
        else if (isAnswered) classes = "border-emerald-400 bg-emerald-400 text-white";
        else if (isCurrent) classes = "border-sky-400 bg-sky-400 text-white";

        return (
          <button
            key={q.id}
            onClick={() => onNavigate(i)}
            className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
              isCurrent && !isAnswered && !isMarked ? "ring-2 ring-sky-300" : ""
            } ${classes}`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [session, setSession] = useState<ExamSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [timeOnQuestion, setTimeOnQuestion] = useState(0);

  // questionId → optionId
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  // set of questionIds marked for review
  const [reviewSet, setReviewSet] = useState<Set<string>>(new Set());
  // set of questionIds the user has navigated to at least once
  const [visitedSet, setVisitedSet] = useState<Set<string>>(new Set());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // ── Load session ──────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getSession(sessionId);
        const data: ExamSession = res.data;
        setSession(data);
        setRemainingSeconds(data.remainingSeconds);

        if (data.answers) {
          setSelectedOptions(data.answers);
        }
        if (data.mockTest.questions[0]) {
          setVisitedSet(new Set([data.mockTest.questions[0].id]));
        }
      } catch {
        setError("Failed to load the exam. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [sessionId]);

  // ── Pause / Resume ────────────────────────────────────────────
  const handlePause = async () => {
    if (!session || isPaused) return;
    try {
      await pauseTest(session.id);
      setIsPaused(true);
    } catch {}
  };

  const handleResume = async () => {
    if (!session || !isPaused) return;
    try {
      await resumeTest(session.id);
      setIsPaused(false);
    } catch {}
  };

  const handleFullScreen = () => {
    if (!fullScreen) {
      containerRef.current?.requestFullscreen?.();
      setFullScreen(true);
    } else {
      document.exitFullscreen?.();
      setFullScreen(false);
    }
  };

  // ── Countdown timer ───────────────────────────────────────────
  const handleAutoSubmit = useCallback(async () => {
    if (!session) return;
    await submitTest(session.id);
    router.push(`/exam/result/${session.id}`);
  }, [session, router]);

  useEffect(() => {
    if (!session || remainingSeconds <= 0 || isPaused) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
      setTimeOnQuestion((t) => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [session, isPaused, handleAutoSubmit]);

  // Reset the per-question timer whenever the question changes
  useEffect(() => {
    setTimeOnQuestion(0);
  }, [currentIndex]);

  // ── Helpers ───────────────────────────────────────────────────
  const handleSelectOption = async (optionId: string) => {
    if (!session) return;
    const question = session.mockTest.questions[currentIndex];
    if (!question) return;

    setSelectedOptions((prev) => ({ ...prev, [question.id]: optionId }));

    try {
      await submitAnswer(session.id, question.id, optionId);
    } catch {
      // Optimistic update already applied; handle silently or show toast
    }
  };

  const handleClearResponse = () => {
    const question = session?.mockTest.questions[currentIndex];
    if (!question) return;
    setSelectedOptions((prev) => {
      const next = { ...prev };
      delete next[question.id];
      return next;
    });
  };

  const goToIndex = (index: number) => {
    if (!session) return;
    const clamped = Math.max(0, Math.min(session.mockTest.questions.length - 1, index));
    setCurrentIndex(clamped);
    const q = session.mockTest.questions[clamped];
    if (q) setVisitedSet((prev) => new Set(prev).add(q.id));
  };

  const handleMarkReviewAndNext = () => {
    const question = session?.mockTest.questions[currentIndex];
    if (!question || !session) return;

    setReviewSet((prev) => new Set(prev).add(question.id));
    goToIndex(currentIndex + 1);
  };

  const handleSaveAndNext = () => {
    if (!session) return;
    goToIndex(currentIndex + 1);
  };

  const requestSubmit = () => setShowSubmitConfirm(true);

  const confirmSubmit = async () => {
    if (!session || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await submitTest(session.id);
      router.push(`/exam/result/${session.id}`);
    } catch {
      setIsSubmitting(false);
      setShowSubmitConfirm(false);
    }
  };

  // ── Render states ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-sky-400" />
          <p className="text-sm text-slate-500">Loading your exam…</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-rose-500">{error ?? "Session not found."}</p>
      </div>
    );
  }

  const questions = session.mockTest.questions;
  const question = questions[currentIndex];

  if (!question) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-slate-500">No questions found for this test.</p>
      </div>
    );
  }

  const answeredIds = new Set(Object.keys(selectedOptions));
  const isMarkedForReview = reviewSet.has(question.id);

  // Palette stats
  const answeredCount = questions.filter((q) => answeredIds.has(q.id) && !reviewSet.has(q.id)).length;
  const markedOnlyCount = questions.filter((q) => reviewSet.has(q.id) && !answeredIds.has(q.id)).length;
  const markedAndAnsweredCount = questions.filter((q) => reviewSet.has(q.id) && answeredIds.has(q.id)).length;
  const notVisitedCount = questions.filter((q) => !visitedSet.has(q.id)).length;
  const notAnsweredCount = questions.filter(
    (q) => visitedSet.has(q.id) && !answeredIds.has(q.id) && !reviewSet.has(q.id)
  ).length;

  return (
    <div ref={containerRef} className="flex h-screen flex-col overflow-hidden bg-white font-sans">
      {/* ── Top Bar ─────────────────────────────────────────── */}
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white px-5 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-cyan-400">
            <span className="text-xs font-black text-white">T</span>
          </div>
          <h1 className="text-sm font-bold text-slate-800 sm:text-base">
            {session.mockTest.title}
          </h1>
        </div>

        <BoxedTimer seconds={remainingSeconds} />

        <div className="flex items-center gap-2">
          <button
            onClick={handleFullScreen}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 sm:text-sm"
          >
            {fullScreen ? "Exit full screen" : "Full screen"}
          </button>
          <button
            onClick={isPaused ? handleResume : handlePause}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all sm:text-sm ${
              isPaused
                ? "bg-gradient-to-r from-sky-400 to-cyan-400 text-white"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {isPaused ? "▶ Resume" : "⏸ Pause"}
          </button>
        </div>
      </header>

      {/* ── Main layout ─────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1">
        {/* Question area */}
        <main className="relative flex min-w-0 flex-1 flex-col overflow-y-auto">
          {isPaused && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/95 backdrop-blur-sm">
              <span className="text-4xl">⏸</span>
              <p className="text-base font-semibold text-slate-700">Exam paused</p>
              <p className="text-sm text-slate-400">Click resume to continue</p>
            </div>
          )}

          <QuestionMetaRow
            questionNumber={currentIndex + 1}
            marks={question.marks}
            negativeMarks={question.negativeMarks}
            timeOnQuestion={timeOnQuestion}
          />

          <div className="flex-1">
            <QuestionView
              question={question}
              selectedOptionId={selectedOptions[question.id]}
              onSelectOption={handleSelectOption}
            />
          </div>

          <ExamFooter
            isMarkedForReview={isMarkedForReview}
            isSubmitting={isSubmitting}
            hasSelection={Boolean(selectedOptions[question.id])}
            onClear={handleClearResponse}
            onMarkReviewAndNext={handleMarkReviewAndNext}
            onSaveAndNext={handleSaveAndNext}
          />
        </main>

        {/* Palette sidebar */}
        <aside className="hidden w-72 shrink-0 flex-col overflow-y-auto border-l border-slate-100 bg-slate-50 px-5 py-5 sm:flex">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-600">
              {(session.studentName ?? "S")[0]}
            </div>
            <p className="text-sm font-semibold text-slate-700">
              {session.studentName ?? "Student"}
            </p>
          </div>

          <div className="mb-4 rounded-xl bg-white p-3 ring-1 ring-slate-100">
            <PaletteLegend
              answered={answeredCount}
              marked={markedOnlyCount}
              markedAndAnswered={markedAndAnsweredCount}
              notVisited={notVisitedCount}
              notAnswered={notAnsweredCount}
            />
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            Questions
          </p>
          <QuestionPalette
            questions={questions}
            currentIndex={currentIndex}
            answeredIds={answeredIds}
            reviewIds={reviewSet}
            onNavigate={goToIndex}
          />

          <button
            onClick={requestSubmit}
            disabled={isSubmitting}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-60"
          >
            Submit test
          </button>
        </aside>
      </div>

      {/* ── Submit confirmation ───────────────────────────────── */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-5">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="mb-2 text-base font-bold text-slate-800">Submit test?</h3>
            <p className="mb-5 text-sm leading-relaxed text-slate-500">
              You've answered {answeredCount + markedAndAnsweredCount} of {questions.length} questions.
              Once submitted, you won't be able to change any answers.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Keep reviewing
              </button>
              <button
                onClick={confirmSubmit}
                disabled={isSubmitting}
                className="rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 px-4 py-2 text-sm font-bold text-white hover:opacity-90 disabled:opacity-60"
              >
                {isSubmitting ? "Submitting…" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}