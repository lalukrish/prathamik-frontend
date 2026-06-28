"use client";

import { useRouter } from "next/navigation";
import StatsCards from "./Statscards";
import { DashboardStats } from "./Types";

interface Props {
  stats: DashboardStats;
  userName?: string;
}

const EXAM_TAGS = [
  { label: "UPSC", bg: "bg-orange-50", color: "text-orange-600" },
  { label: "SSC", bg: "bg-sky-50", color: "text-sky-600" },
  { label: "IBPS", bg: "bg-emerald-50", color: "text-emerald-600" },
  { label: "RRB", bg: "bg-violet-50", color: "text-violet-600" },
  { label: "NEET", bg: "bg-rose-50", color: "text-rose-600" },
  { label: "PSC", bg: "bg-amber-50", color: "text-amber-600" },
  { label: "JEE", bg: "bg-teal-50", color: "text-teal-600" },
];

export default function WelcomeCard({ stats, userName }: Props) {
  const router = useRouter();

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      {/* Top row — greeting + CTA */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-orange-500">
            Welcome back{userName ? `, ${userName}` : ""}
          </p>
          <h2 className="mt-1 text-xl font-light tracking-tight text-slate-900">
            Your exam prep dashboard
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Track progress, resume paused tests, explore new mock sets.
          </p>
        </div>
        <button
          onClick={() => router.push("/tests")}
          className="shrink-0 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white hover:bg-orange-600"
        >
          Browse tests →
        </button>
      </div>

      {/* New feature pills */}
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { text: "New: Study Groups", hot: true },
          { text: "Paid tests unlocked", hot: true },
          { text: "UPSC 2026 series", hot: false },
          { text: "RRB NTPC added", hot: false },
          { text: "PSC Kerala set", hot: false },
        ].map((f) => (
          <span
            key={f.text}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
              f.hot
                ? "bg-orange-50 text-orange-600 ring-1 ring-orange-200"
                : "bg-slate-50 text-slate-500 ring-1 ring-slate-200"
            }`}
          >
            {f.hot && <span className="mr-1">✦</span>}
            {f.text}
          </span>
        ))}
      </div>

      {/* Exam category tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {EXAM_TAGS.map((tag) => (
          <span
            key={tag.label}
            className={`rounded-lg px-3 py-1 text-xs font-bold ${tag.bg} ${tag.color}`}
          >
            {tag.label}
          </span>
        ))}
      </div>

      {/* Stats grid — inside welcome card */}
      <StatsCards stats={stats} />
    </div>
  );
}