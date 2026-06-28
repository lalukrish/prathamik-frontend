"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { getResult } from "@/shared/test";

import type {
  ExamResult,
  ResultQuestion,
  QuestionOutcome,
} from "./types";

// ─── Score ring ───────────────────────────────────────────────────────────────
//e9ef1883-4e63-497b-a844-eaed82768df1
function ScoreRing({ scored, total }: { scored: number; total: number }) {
  const pct = total > 0 ? Math.max(0, Math.min(100, (scored / total) * 100)) : 0;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center sm:h-36 sm:w-36">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-extrabold text-slate-800 sm:text-3xl">{scored}</span>
        <span className="text-xs text-slate-400">of {total}</span>
      </div>
    </div>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  color,
  bg,
}: {
  label: string;
  value: string | number;
  color: string;
  bg: string;
}) {
  return (
    <div className={`rounded-2xl p-4 ${bg}`}>
      <p className={`text-xl font-extrabold ${color}`}>{value}</p>
      <p className="mt-0.5 text-xs text-slate-500">{label}</p>
    </div>
  );
}

// ─── Subject breakdown bars ───────────────────────────────────────────────────

function SubjectBreakdownList({ result }: { result: ExamResult }) {
  return (
    <div className="flex flex-col gap-4">
      {result.subjectBreakdown.map((s) => {
        const acc = s.total > 0 ? (s.correct / s.total) * 100 : 0;
        return (
          <div key={s.subjectId}>
            <div className="mb-1.5 flex items-baseline justify-between">
              <p className="text-sm font-semibold text-slate-700">{s.subjectName}</p>
              <p className="text-xs text-slate-400">
                {s.correct}/{s.total} correct · {s.marksScored}/{s.marksTotal} marks
              </p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-400"
                style={{ width: `${acc}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Difficulty breakdown ─────────────────────────────────────────────────────

function DifficultyBreakdownGrid({ result }: { result: ExamResult }) {
  const colors: Record<string, string> = {
    EASY: "bg-emerald-50 text-emerald-600",
    MEDIUM: "bg-amber-50 text-amber-600",
    HARD: "bg-rose-50 text-rose-600",
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {result.difficultyBreakdown.map((d) => (
        <div key={d.difficulty} className={`rounded-xl p-3.5 text-center ${colors[d.difficulty] ?? "bg-slate-50 text-slate-600"}`}>
          <p className="text-lg font-extrabold">{d.correct}/{d.total}</p>
          <p className="mt-0.5 text-[11px] font-semibold capitalize">{d.difficulty.toLowerCase()}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Question review card ─────────────────────────────────────────────────────

function outcomeStyle(outcome: QuestionOutcome) {
  switch (outcome) {
    case "CORRECT":
      return { label: "Correct", badge: "bg-emerald-50 text-emerald-600", ring: "border-emerald-100" };
    case "INCORRECT":
      return { label: "Incorrect", badge: "bg-rose-50 text-rose-600", ring: "border-rose-100" };
    default:
      return { label: "Skipped", badge: "bg-slate-100 text-slate-500", ring: "border-slate-100" };
  }
}

// function QuestionReviewCard({ question, index }: { question: ResultQuestion; index: number }) {
//   const style = outcomeStyle(question.outcome);

//   return (
//     <div className={`rounded-2xl border bg-white p-5 shadow-sm ${style.ring}`}>
//       <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
//         <p className="text-xs font-bold text-slate-400">Question {index + 1}</p>
//         <div className="flex items-center gap-2">
//           <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${style.badge}`}>
//             {style.label}
//           </span>
//           <span className="text-[11px] font-semibold text-slate-400">
//             {question.marksAwarded > 0 ? "+" : ""}{question.marksAwarded} marks
//           </span>
//         </div>
//       </div>

//       {question.imageUrl && (
//         <img
//           src={question.imageUrl}
//           alt=""
//           className="mb-3 max-h-56 rounded-xl border border-slate-100 object-contain"
//         />
//       )}

//       <p className="mb-4 text-sm leading-relaxed text-slate-800">{question.question}</p>

//       <div className="flex flex-col gap-2">
//         {question.options.map((opt, i) => {
//           const isCorrect = opt.id === question.correctOptionId;
//           const isSelected = opt.id === question.selectedOptionId;

//           let classes = "border-slate-100 text-slate-600";
//           if (isCorrect) classes = "border-emerald-300 bg-emerald-50 text-emerald-700";
//           else if (isSelected && !isCorrect) classes = "border-rose-300 bg-rose-50 text-rose-700";

//           return (
//             <div key={opt.id} className={`flex items-center gap-3 rounded-xl border p-2.5 text-xs ${classes}`}>
//               <span
//                 className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
//                   isCorrect
//                     ? "bg-emerald-400 text-white"
//                     : isSelected
//                     ? "bg-rose-400 text-white"
//                     : "bg-slate-100 text-slate-500"
//                 }`}
//               >
//                 {String.fromCharCode(65 + i)}
//               </span>
//               <span className="flex-1">{opt.text}</span>
//               {isCorrect && <span className="text-emerald-500">✓ Correct answer</span>}
//               {isSelected && !isCorrect && <span className="text-rose-500">Your answer</span>}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// ─── Main Page ────────────────────────────────────────────────────────────────

function QuestionReviewCard({ question, index }: { question: ResultQuestion; index: number }) {
  const style = outcomeStyle(question.outcome);

  return (
    <div className={`rounded-2xl border bg-white shadow-sm ${style.ring}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3">
        <p className="text-xs font-bold text-slate-400">Question {index + 1}</p>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${style.badge}`}>
            {style.label}
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            {question.marksAwarded > 0 ? "+" : ""}{question.marksAwarded} marks
          </span>
        </div>
      </div>

      {/* Body — two columns when description exists */}
      <div className={`flex flex-col ${question.description ? "lg:flex-row" : ""}`}>

        {/* Left — question + options */}
        <div className={`flex flex-col gap-3 p-5 ${question.description ? "lg:w-1/2 lg:border-r lg:border-slate-100" : "w-full"}`}>
          {question.imageUrl && (
            <img
              src={question.imageUrl}
              alt=""
              className="max-h-56 rounded-xl border border-slate-100 object-contain"
            />
          )}

          <p className="text-sm leading-relaxed text-slate-800">{question.question}</p>

          <div className="flex flex-col gap-2">
            {question.options.map((opt, i) => {
              const isCorrect = opt.id === question.correctOptionId;
              const isSelected = opt.id === question.selectedOptionId;

              let classes = "border-slate-100 text-slate-600";
              if (isCorrect) classes = "border-emerald-300 bg-emerald-50 text-emerald-700";
              else if (isSelected && !isCorrect) classes = "border-rose-300 bg-rose-50 text-rose-700";

              return (
                <div key={opt.id} className={`flex items-center gap-3 rounded-xl border p-2.5 text-xs ${classes}`}>
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      isCorrect
                        ? "bg-emerald-400 text-white"
                        : isSelected
                        ? "bg-rose-400 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{opt.text}</span>
                  {isCorrect && <span className="text-emerald-500">✓ Correct answer</span>}
                  {isSelected && !isCorrect && <span className="text-rose-500">Your answer</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — description */}
        {question.description && (
          <div className="flex flex-col gap-2 bg-sky-50/50 p-5 lg:w-1/2">
            <div className="flex items-center gap-1.5">
              <span className="h-3.5 w-1 rounded-full bg-sky-400" />
              <p className="text-[11px] font-bold uppercase tracking-wide text-sky-500">
                Explanation
              </p>
            </div>
            <div
              className="prose prose-sm max-w-none text-slate-600 
                prose-headings:font-semibold prose-headings:text-slate-700
                prose-p:leading-relaxed prose-li:my-0.5"
              dangerouslySetInnerHTML={{ __html: question.description }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
type FilterKey = "ALL" | "CORRECT" | "INCORRECT" | "SKIPPED";

export default function ExamResultPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("ALL");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getResult(sessionId);
        setResult(res.data);
      } catch {
        setError("Couldn't load your result. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-sky-400" />
          <p className="text-sm text-slate-500">Calculating your result…</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-5 text-center">
        <p className="text-sm font-semibold text-rose-500">{error ?? "Result not found."}</p>
        <Link href="/tests" className="rounded-xl bg-sky-400 px-5 py-2 text-sm font-bold text-white hover:bg-sky-500">
          Back to tests
        </Link>
      </div>
    );
  }

  const filteredQuestions = result.questions.filter((q) => {
    if (filter === "ALL") return true;
    return q.outcome === filter;
  });

  const mm = Math.floor(result.timeTakenSeconds / 60);
  const ss = result.timeTakenSeconds % 60;

  const filters: { key: FilterKey; label: string; count: number }[] = [
    { key: "ALL", label: "All", count: result.totalQuestions },
    { key: "CORRECT", label: "Correct", count: result.correctCount },
    { key: "INCORRECT", label: "Incorrect", count: result.incorrectCount },
    { key: "SKIPPED", label: "Skipped", count: result.skippedCount },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header / score summary ──────────────────────────────── */}
      <div className="bg-gradient-to-br from-violet-50 via-sky-50 to-white px-5 pb-8 pt-10 sm:pt-14">
        <div className="mx-auto max-w-5xl">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-sky-500">Test completed</p>
          <h1 className="mb-6 text-2xl font-light tracking-tight text-slate-900 sm:text-3xl">
            {result.mockTestTitle}
          </h1>

          <div className="flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-100 sm:flex-row sm:items-center sm:gap-10 sm:p-8">
            <ScoreRing scored={result.scoredMarks} total={result.totalMarks} />

            <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Correct" value={result.correctCount} color="text-emerald-600" bg="bg-emerald-50" />
              <StatCard label="Incorrect" value={result.incorrectCount} color="text-rose-600" bg="bg-rose-50" />
              <StatCard label="Skipped" value={result.skippedCount} color="text-slate-500" bg="bg-slate-100" />
              <StatCard label="Accuracy" value={`${result.accuracy.toFixed(1)}%`} color="text-sky-600" bg="bg-sky-50" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-5 text-xs text-slate-500 sm:text-sm">
            <span>⏱ Time taken: <strong className="text-slate-700">{mm}m {ss}s</strong> of {result.durationMinutes}m</span>
            {result.percentile != null && (
              <span>📊 Percentile: <strong className="text-slate-700">{result.percentile.toFixed(1)}</strong></span>
            )}
            {result.rank != null && result.totalParticipants != null && (
              <span>🏆 Rank: <strong className="text-slate-700">{result.rank}</strong> of {result.totalParticipants}</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Breakdown ────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-4 text-sm font-bold text-slate-800">Subject-wise performance</h2>
            {result.subjectBreakdown.length > 0 ? (
              <SubjectBreakdownList result={result} />
            ) : (
              <p className="text-xs text-slate-400">No subject data for this test.</p>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="mb-4 text-sm font-bold text-slate-800">Performance by difficulty</h2>
            {result.difficultyBreakdown.length > 0 ? (
              <DifficultyBreakdownGrid result={result} />
            ) : (
              <p className="text-xs text-slate-400">No difficulty data for this test.</p>
            )}
          </div>
        </div>

        {/* ── Question review ───────────────────────────────────── */}
        <div className="mt-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-800">Review your answers</h2>
            <div className="flex gap-2">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    filter === f.key
                      ? "bg-sky-400 text-white"
                      : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((q) => {
                const originalIndex = result.questions.findIndex((rq) => rq.id === q.id);
                return <QuestionReviewCard key={q.id} question={q} index={originalIndex} />;
              })
            ) : (
              <p className="rounded-2xl border-2 border-dashed border-slate-200 bg-white py-10 text-center text-sm text-slate-400">
                No questions in this category.
              </p>
            )}
          </div>
        </div>

        {/* ── Actions ────────────────────────────────────────────── */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => router.push("/tests")}
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
          >
            Back to test library
          </button>
          <Link
            href="/#toppers"
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
          >
            View leaderboard
          </Link>
          <button
            onClick={() => router.push(`/tests/start/${result.mockTestId}`)}
            className="rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:opacity-90"
          >
            Retake this test
          </button>
        </div>
      </div>
    </div>
  );
}