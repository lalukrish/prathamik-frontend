
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getAvailableTests, startTest } from "@/shared/test";

// ─── Types ────────────────────────────────────────────────────────────────────

type Question = {
  id: string;
  question: string;
  marks: number;
  negativeMarks: number;
  difficulty: "EASY" | "MEDIUM" | "HARD" | string;
  subject?: { id: string; name: string };
};

type MockTest = {
  id: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  totalMarks: number;
  thumbnailUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  questions: Question[];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STRIPE_COLORS = [
  "#0EA5E9", // sky
  "#F97316", // orange
  "#10B981", // emerald
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#14B8A6", // teal
];

function stripeFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return STRIPE_COLORS[hash % STRIPE_COLORS.length];
}

function initialsFor(title: string) {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function uniqueSubjects(questions: Question[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const q of questions) {
    const name = q.subject?.name;
    if (name && !seen.has(name)) { seen.add(name); out.push(name); }
  }
  return out;
}

function difficultyBreakdown(questions: Question[]) {
  const easy = questions.filter(q => q.difficulty === "EASY").length;
  const medium = questions.filter(q => q.difficulty === "MEDIUM").length;
  const hard = questions.filter(q => q.difficulty === "HARD").length;
  return { easy, medium, hard };
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="flex w-[82vw] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 sm:w-[340px]">
      <div className="h-1.5 w-full animate-pulse bg-slate-200" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
        <div className="mt-3 space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-3 w-full animate-pulse rounded bg-slate-50" />)}
        </div>
        <div className="mt-auto h-10 w-full animate-pulse rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}

// ─── Test Card — admit card style ─────────────────────────────────────────────

function TestCard({
  test,
  starting,
  onStart,
  onView,
}: {
  test: MockTest;
  starting: boolean;
  onStart: (id: string) => void;
  onView: (test: MockTest) => void;
}) {
  const qCount = test.questions.length;
  const stripe = stripeFor(test.id);
  const subjects = uniqueSubjects(test.questions);
  const { easy, medium, hard } = difficultyBreakdown(test.questions);
  const negCount = test.questions.filter(q => q.negativeMarks > 0).length;

  return (
    <div
      className="group flex w-[82vw] shrink-0 cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[340px]"
      style={{ scrollSnapAlign: "start" }}
      onClick={() => onView(test)}
    >
      {/* Colored top stripe */}
      <div className="h-1.5 w-full" style={{ background: stripe }} />

      {/* Card header */}
      <div className="flex items-start gap-3 px-5 pt-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden">
  <img
    src={test.thumbnailUrl}
    alt={test.title}
    className="h-full w-full object-cover"
  />
</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold leading-snug text-slate-800 line-clamp-2">
              {test.title}
            </h3>
            {test.isPublished ? (
              <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                LIVE
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-400">
                DRAFT
              </span>
            )}
          </div>
          {test.description && (
            <p className="mt-0.5 text-xs text-slate-400 line-clamp-1">{test.description}</p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 my-3 border-t border-dashed border-slate-100" />

      {/* Data rows — admit card style */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 px-5">
        <DataRow icon="⏱" label="Duration" value={`${test.durationMinutes} min`} />
        <DataRow icon="📝" label="Questions" value={qCount > 0 ? String(qCount) : "—"} />
        <DataRow icon="🏆" label="Total marks" value={String(test.totalMarks)} />
        <DataRow icon="⚠️" label="Negative marking" value={negCount > 0 ? "Yes" : "None"} accent={negCount > 0 ? "text-orange-500" : "text-emerald-500"} />
      </div>

      {/* Subjects */}
      {subjects.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 px-5">
          {subjects.slice(0, 3).map(s => (
            <span key={s} className="rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-600">
              {s}
            </span>
          ))}
          {subjects.length > 3 && (
            <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
              +{subjects.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Difficulty bar */}
      {qCount > 0 && (
        <div className="mx-5 mt-3">
          <div className="flex h-1.5 overflow-hidden rounded-full bg-slate-100">
            {easy > 0 && <div className="bg-emerald-400" style={{ width: `${(easy/qCount)*100}%` }} />}
            {medium > 0 && <div className="bg-amber-400" style={{ width: `${(medium/qCount)*100}%` }} />}
            {hard > 0 && <div className="bg-red-400" style={{ width: `${(hard/qCount)*100}%` }} />}
          </div>
          <div className="mt-1 flex gap-3 text-[10px] text-slate-400">
            {easy > 0 && <span className="text-emerald-500">{easy} easy</span>}
            {medium > 0 && <span className="text-amber-500">{medium} medium</span>}
            {hard > 0 && <span className="text-red-500">{hard} hard</span>}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="mx-5 my-4 border-t border-dashed border-slate-100" />

      {/* Actions */}
      <div className="flex gap-2 px-5 pb-5">
        <button
          onClick={(e) => { e.stopPropagation(); onView(test); }}
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100"
        >
          View details
        </button>
        {qCount > 0 ? (
          <button
            disabled={starting}
            onClick={(e) => { e.stopPropagation(); onStart(test.id); }}
            className="flex-1 rounded-xl py-2.5 text-xs font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #F97316, #ea6c0a)" }}
          >
            {starting ? "Starting…" : "Start test →"}
          </button>
        ) : (
          <button disabled className="flex-1 cursor-not-allowed rounded-xl border border-dashed border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-300">
            No questions
          </button>
        )}
      </div>
    </div>
  );
}

function DataRow({ icon, label, value, accent }: { icon: string; label: string; value: string; accent?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs">{icon}</span>
      <div>
        <p className="text-[10px] text-slate-400">{label}</p>
        <p className={`text-xs font-semibold ${accent ?? "text-slate-700"}`}>{value}</p>
      </div>
    </div>
  );
}

// ─── Scroll row ───────────────────────────────────────────────────────────────

function TestScrollRow({ tests, startingId, onStart, onView }: {
  tests: MockTest[];
  startingId: string | null;
  onStart: (id: string) => void;
  onView: (test: MockTest) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) =>
    scrollRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });

  return (
    <div className="relative">
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-slate-50 to-transparent" />
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {tests.map(test => (
          <TestCard
            key={test.id}
            test={test}
            starting={startingId === test.id}
            onStart={onStart}
            onView={onView}
          />
        ))}
        {/* See all card */}
        <div className="flex w-[180px] shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-500 text-xl">→</div>
          <p className="text-xs font-semibold text-slate-600">More coming soon</p>
        </div>
      </div>
      <div className="mt-2 hidden justify-end gap-2 sm:flex">
        <button onClick={() => scrollBy(-1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-sm text-slate-500 hover:bg-slate-50">←</button>
        <button onClick={() => scrollBy(1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-sm text-slate-500 hover:bg-slate-50">→</button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function TestsPage() {
  const router = useRouter();
  const [tests, setTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startingId, setStartingId] = useState<string | null>(null);

  useEffect(() => { fetchTests(); }, []);

  const fetchTests = async () => {
    setLoading(true); setError(null);
    try {
      const res = await getAvailableTests();
      setTests(res.data ?? []);
    } catch { setError("Couldn't load tests. Try again."); }
    finally { setLoading(false); }
  };

  const handleStart = async (mockTestId: string) => {
    setStartingId(mockTestId);
    try {
      const res = await startTest(mockTestId);
      router.push(`/session/${res.data.id}`);
    } catch { setStartingId(null); }
  };

  const handleView = (test: MockTest) => {
    router.push(`/tests/${test.id}`);
  };

  const ready = tests.filter(t => t.questions.length > 0);
  const totalQ = tests.reduce((s, t) => s + t.questions.length, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      {/* Header */}
      <div className="border-b border-slate-100 bg-white px-5 pb-8 pt-10 sm:pt-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-orange-500">
                Test Library
              </p>
              <h1 className="text-3xl font-light tracking-tight text-slate-900 sm:text-4xl">
                Available <span className="font-semibold">mock tests</span>
              </h1>
              <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-slate-400">
                Timed sessions, instant scoring, detailed review — pick a test and start now.
              </p>
            </div>

            {!loading && tests.length > 0 && (
              <div className="flex gap-6">
                <Stat value={tests.length} label="Tests" color="text-orange-500" />
                <Stat value={ready.length} label="Ready" color="text-emerald-500" />
                <Stat value={totalQ} label="Questions" color="text-sky-500" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-5 py-8 pb-16">
        {loading ? (
          <div className="flex gap-5 overflow-x-hidden">
            {[1,2,3].map(i => <CardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-6 py-10 text-center">
            <p className="text-sm font-semibold text-red-600">{error}</p>
            <button onClick={fetchTests} className="rounded-xl px-5 py-2 text-xs font-bold text-white" style={{ background: "#F97316" }}>
              Retry
            </button>
          </div>
        ) : tests.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-14 text-center">
            <span className="text-3xl">📭</span>
            <p className="text-sm font-semibold text-slate-700">No tests available yet</p>
            <p className="text-xs text-slate-400">Check back soon.</p>
          </div>
        ) : (
          <TestScrollRow
            tests={tests}
            startingId={startingId}
            onStart={handleStart}
            onView={handleView}
          />
        )}
      </div>
    </div>
  );
}

function Stat({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="text-center">
      <p className={`text-2xl font-semibold ${color}`}>{value}</p>
      <p className="text-xs font-light text-slate-400">{label}</p>
    </div>
  );
}