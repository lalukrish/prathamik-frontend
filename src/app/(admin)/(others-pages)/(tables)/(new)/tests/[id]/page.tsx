"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { startTest } from "@/shared/test";

// ─── Types ────────────────────────────────────────────────────────────────────

type Question = {
  id: string;
  question: string;
  marks: number;
  negativeMarks: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  subject?: { id: string; name: string };
  options?: { id: string; text: string; isCorrect: boolean }[];
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

// ─── Dummy data (replace with real API call when ready) ───────────────────────

function buildDummyTest(id: string): MockTest {
  return {
    id,
    title: "UPSC Prelims General Studies Paper I",
    description:
      "A comprehensive mock test covering History, Geography, Polity, Economy, Science & Technology, and Current Affairs — matching the pattern and difficulty of the actual UPSC CSE Preliminary exam.",
    durationMinutes: 120,
    totalMarks: 200,
    thumbnailUrl: null,
    isPublished: true,
    createdAt: new Date().toISOString(),
    questions: [
      ...Array.from({ length: 40 }, (_, i) => ({
        id: `q-easy-${i}`,
        question: `Sample easy question ${i + 1}`,
        marks: 2,
        negativeMarks: 0.66,
        difficulty: "EASY" as const,
        subject: { id: "s1", name: i % 2 === 0 ? "Polity" : "History" },
      })),
      ...Array.from({ length: 45 }, (_, i) => ({
        id: `q-medium-${i}`,
        question: `Sample medium question ${i + 1}`,
        marks: 2,
        negativeMarks: 0.66,
        difficulty: "MEDIUM" as const,
        subject: { id: "s2", name: i % 3 === 0 ? "Geography" : i % 3 === 1 ? "Economy" : "Science" },
      })),
      ...Array.from({ length: 15 }, (_, i) => ({
        id: `q-hard-${i}`,
        question: `Sample hard question ${i + 1}`,
        marks: 2,
        negativeMarks: 0.66,
        difficulty: "HARD" as const,
        subject: { id: "s3", name: "Current Affairs" },
      })),
    ],
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STRIPE_COLORS = ["#0EA5E9","#F97316","#10B981","#8B5CF6","#EC4899","#14B8A6"];
function stripeFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return STRIPE_COLORS[h % STRIPE_COLORS.length];
}

function initialsFor(title: string) {
  const w = title.trim().split(/\s+/).filter(Boolean);
  if (w.length === 0) return "?";
  if (w.length === 1) return w[0].slice(0, 2).toUpperCase();
  return (w[0][0] + w[1][0]).toUpperCase();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DifficultyBadge({ d }: { d: string }) {
  const map: Record<string, string> = {
    EASY: "bg-emerald-100 text-emerald-700",
    MEDIUM: "bg-amber-100 text-amber-700",
    HARD: "bg-red-100 text-red-600",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${map[d] ?? "bg-slate-100 text-slate-500"}`}>
      {d}
    </span>
  );
}

function SidebarRow({ icon, label, value, valueClass = "" }: {
  icon: string; label: string; value: string; valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <span className={`text-xs font-semibold ${valueClass || "text-slate-800"}`}>{value}</span>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function TestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;

  const [test, setTest] = useState<MockTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "questions">("overview");

  useEffect(() => {
    // TODO: replace with real API call when available
    // const res = await getTestById(testId);
    // setTest(res.data);
    setTimeout(() => {
      setTest(buildDummyTest(testId));
      setLoading(false);
    }, 600);
  }, [testId]);

  const handleStart = async () => {
    if (!test) return;
    setStarting(true);
    try {
      const res = await startTest(test.id);
      router.push(`/session/${res.data.id}`);
    } catch {
      setStarting(false);
    }
  };

  if (loading) return <DetailSkeleton />;
  if (!test) return (
    <div className="flex h-64 items-center justify-center text-sm text-slate-400">
      Test not found
    </div>
  );

  const qCount = test.questions.length;
  const stripe = stripeFor(test.id);
  const easy = test.questions.filter(q => q.difficulty === "EASY").length;
  const medium = test.questions.filter(q => q.difficulty === "MEDIUM").length;
  const hard = test.questions.filter(q => q.difficulty === "HARD").length;
  const negativeCount = test.questions.filter(q => q.negativeMarks > 0).length;

  // Subject breakdown
  const subjectMap = new Map<string, number>();
  for (const q of test.questions) {
    const s = q.subject?.name ?? "General";
    subjectMap.set(s, (subjectMap.get(s) ?? 0) + 1);
  }
  const subjects = Array.from(subjectMap.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Top bar */}
      <div className="border-b border-slate-100 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50"
          >
            ←
          </button>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span
              className="cursor-pointer hover:text-slate-600"
              onClick={() => router.push("/tests")}
            >
              Tests
            </span>
            <span>/</span>
            <span className="font-medium text-slate-700 line-clamp-1">{test.title}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">

          {/* ── Left ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Hero card */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
              <div className="h-2 w-full" style={{ background: stripe }} />
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-black text-white"
                    style={{ background: stripe }}
                  >
                    {initialsFor(test.title)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {test.isPublished ? (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                          LIVE
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-400">
                          DRAFT
                        </span>
                      )}
                    </div>
                    <h1 className="mt-1 text-xl font-light leading-snug text-slate-900 sm:text-2xl">
                      {test.title}
                    </h1>
                    {test.description && (
                      <p className="mt-2 text-sm font-light leading-relaxed text-slate-500">
                        {test.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick stats strip */}
                <div className="mt-6 grid grid-cols-2 divide-x divide-slate-100 rounded-xl bg-slate-50 py-3 sm:grid-cols-4">
                  {[
                    { icon: "⏱", label: "Duration", value: `${test.durationMinutes} min`, color: "text-sky-600" },
                    { icon: "📝", label: "Questions", value: String(qCount), color: "text-orange-500" },
                    { icon: "🏆", label: "Total marks", value: String(test.totalMarks), color: "text-violet-600" },
                    { icon: "⚠️", label: "Negative", value: negativeCount > 0 ? `${negativeCount} Qs` : "None", color: negativeCount > 0 ? "text-orange-500" : "text-emerald-500" },
                  ].map(s => (
                    <div key={s.label} className="flex flex-col items-center gap-0.5 px-3 py-1">
                      <span className="text-base">{s.icon}</span>
                      <span className={`text-base font-semibold ${s.color}`}>{s.value}</span>
                      <span className="text-[10px] text-slate-400">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200">
              {(["overview", "questions"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`mr-6 border-b-2 pb-3 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab === "overview" ? "Overview" : `Questions (${qCount})`}
                </button>
              ))}
            </div>

            {/* Overview tab */}
            {activeTab === "overview" && (
              <div className="flex flex-col gap-5">
                {/* Difficulty breakdown */}
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <h3 className="mb-4 text-sm font-semibold text-slate-700">Difficulty breakdown</h3>
                  <div className="flex h-3 overflow-hidden rounded-full bg-slate-100">
                    {easy > 0 && <div className="bg-emerald-400 transition-all" style={{ width: `${(easy/qCount)*100}%` }} />}
                    {medium > 0 && <div className="bg-amber-400 transition-all" style={{ width: `${(medium/qCount)*100}%` }} />}
                    {hard > 0 && <div className="bg-red-400 transition-all" style={{ width: `${(hard/qCount)*100}%` }} />}
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                      { label: "Easy", count: easy, color: "bg-emerald-400", text: "text-emerald-600", bg: "bg-emerald-50" },
                      { label: "Medium", count: medium, color: "bg-amber-400", text: "text-amber-600", bg: "bg-amber-50" },
                      { label: "Hard", count: hard, color: "bg-red-400", text: "text-red-600", bg: "bg-red-50" },
                    ].map(d => (
                      <div key={d.label} className={`rounded-xl ${d.bg} p-3 text-center`}>
                        <p className={`text-lg font-bold ${d.text}`}>{d.count}</p>
                        <p className="text-xs text-slate-500">{d.label}</p>
                        <p className="text-[10px] text-slate-400">{qCount > 0 ? Math.round((d.count/qCount)*100) : 0}%</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subject breakdown */}
                {subjects.length > 0 && (
                  <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                    <h3 className="mb-4 text-sm font-semibold text-slate-700">Subject distribution</h3>
                    <div className="flex flex-col gap-3">
                      {subjects.map(([name, count]) => (
                        <div key={name}>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-700">{name}</span>
                            <span className="text-xs text-slate-400">{count} questions · {Math.round((count/qCount)*100)}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${(count/qCount)*100}%`, background: stripe }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Marking scheme */}
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                  <h3 className="mb-4 text-sm font-semibold text-slate-700">Marking scheme</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-emerald-50 p-3">
                      <p className="text-lg font-bold text-emerald-600">+{test.questions[0]?.marks ?? 1}</p>
                      <p className="text-xs text-slate-500">Correct answer</p>
                    </div>
                    <div className="rounded-xl bg-red-50 p-3">
                      <p className="text-lg font-bold text-red-500">
                        {test.questions[0]?.negativeMarks > 0 ? `-${test.questions[0].negativeMarks}` : "0"}
                      </p>
                      <p className="text-xs text-slate-500">Wrong answer</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-lg font-bold text-slate-600">0</p>
                      <p className="text-xs text-slate-500">Skipped question</p>
                    </div>
                    <div className="rounded-xl bg-sky-50 p-3">
                      <p className="text-lg font-bold text-sky-600">{test.totalMarks}</p>
                      <p className="text-xs text-slate-500">Maximum marks</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Questions tab */}
            {activeTab === "questions" && (
              <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 overflow-hidden">
                <div className="border-b border-slate-100 px-5 py-3.5">
                  <p className="text-xs font-semibold text-slate-500">{qCount} questions in this test</p>
                </div>
                <div className="divide-y divide-slate-50">
                  {test.questions.map((q, i) => (
                    <div key={q.id} className="flex items-start gap-3 px-5 py-3.5">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs leading-relaxed text-slate-700 line-clamp-2">{q.question}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          {q.subject && (
                            <span className="rounded-md bg-sky-50 px-1.5 py-0.5 text-[10px] font-medium text-sky-600">
                              {q.subject.name}
                            </span>
                          )}
                          <DifficultyBadge d={q.difficulty} />
                          <span className="text-[10px] text-slate-400">+{q.marks} {q.negativeMarks > 0 && `/ -${q.negativeMarks}`}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right sidebar ─────────────────────────────────────── */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">

            {/* CTA card */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
              {test.thumbnailUrl ? (
                <img src={test.thumbnailUrl} alt={test.title} className="h-40 w-full object-cover" />
              ) : (
                <div className="flex h-40 items-center justify-center text-5xl font-black text-white/30"
                  style={{ background: `linear-gradient(135deg, ${stripe}99, ${stripe})` }}>
                  {initialsFor(test.title)}
                </div>
              )}
              <div className="p-5">
                <button
                  onClick={handleStart}
                  disabled={starting || qCount === 0}
                  className="w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: qCount > 0 ? "linear-gradient(135deg, #F97316, #ea6c0a)" : undefined }}
                >
                  {starting ? "Starting…" : qCount === 0 ? "No questions yet" : "Start Test Now →"}
                </button>
                <p className="mt-2 text-center text-[11px] text-slate-400">
                  Timer starts immediately after you click
                </p>
              </div>
            </div>

            {/* Test info card */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Test info
              </h3>
              <SidebarRow icon="⏱" label="Duration" value={`${test.durationMinutes} minutes`} />
              <SidebarRow icon="📝" label="Questions" value={String(qCount)} valueClass="text-orange-500 font-bold" />
              <SidebarRow icon="🏆" label="Total marks" value={String(test.totalMarks)} valueClass="text-violet-600 font-bold" />
              <SidebarRow icon="✅" label="Correct answer" value={`+${test.questions[0]?.marks ?? 1}`} valueClass="text-emerald-600 font-bold" />
              <SidebarRow
                icon="❌"
                label="Wrong answer"
                value={negativeCount > 0 ? `-${test.questions[0]?.negativeMarks}` : "No penalty"}
                valueClass={negativeCount > 0 ? "text-red-500 font-bold" : "text-emerald-600 font-bold"}
              />
              <SidebarRow icon="📅" label="Last updated" value={new Date(test.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} />
            </div>

            {/* Subject list */}
            {subjects.length > 0 && (
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Subjects covered
                </h3>
                <div className="flex flex-col gap-1.5">
                  {subjects.map(([name, count]) => (
                    <div key={name} className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">{name}</span>
                      <span className="text-[11px] font-semibold text-sky-600">{count} Qs</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-5 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <div className="h-56 rounded-2xl bg-slate-200" />
          <div className="h-48 rounded-2xl bg-slate-100" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-64 rounded-2xl bg-slate-200" />
          <div className="h-40 rounded-2xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}