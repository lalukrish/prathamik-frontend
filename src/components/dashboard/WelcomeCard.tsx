"use client";

import { useRouter } from "next/navigation";
import StatsCards from "./Statscards";
import { DashboardStats } from "./types";

interface UpcomingTest {
  id: string;
  title: string;
  exam: string;
  date: string;
  time: string;
  logoUrl?: string;
}

interface Props {
  stats: DashboardStats;
  userName?: string;
  upcomingTests?: UpcomingTest[];
}

const EXAM_TAGS = ["UPSC", "SSC", "IBPS", "RRB", "NEET", "PSC", "JEE"];

const FALLBACK_TESTS: UpcomingTest[] = [
  {
    id: "1",
    title: "UPSC Prelims Mock 12",
    exam: "UPSC",
    date: "Jul 04",
    time: "10:00 AM",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/9/9e/Emblem_of_India.svg",
  },
  { id: "2", title: "SSC CGL Tier 1 Set 8", exam: "SSC", date: "Jul 05", time: "2:00 PM" },
  { id: "3", title: "IBPS PO Full Mock 3", exam: "IBPS", date: "Jul 07", time: "9:00 AM" },
  { id: "4", title: "RRB NTPC Stage 1", exam: "RRB", date: "Jul 09", time: "11:00 AM" },
];

export default function WelcomeCard({ stats, userName, upcomingTests }: Props) {
  const router = useRouter();
  const tests = upcomingTests?.length ? upcomingTests : FALLBACK_TESTS;

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      {/* Top row — greeting + CTA */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-violet-500">
            Welcome back{userName ? `, ${userName}` : ""}
          </p>
          <h2 className="mt-1 text-2xl font-light tracking-tight text-slate-900">
            Your exam prep dashboard
          </h2>
          <p className="mt-1 text-md text-gray-500">
            Track progress, resume paused tests, explore new mock sets.
          </p>
        </div>
        <button
          onClick={() => router.push("/tests")}
          className="shrink-0 rounded-xl bg-violet-500 px-4 py-2 text-xs font-bold text-white hover:bg-violet-600"
        >
          Browse tests →
        </button>
      </div>

      {/* New feature pills */}
      <div className="mt-6 flex flex-wrap gap-2">
        {[
          { text: "New: Study Groups", hot: true },
          { text: "Paid tests unlocked", hot: true },
          { text: "UPSC 2026 series", hot: false },
          { text: "RRB NTPC added", hot: false },
          { text: "PSC Kerala set", hot: false },
        ].map((f) => (
          <span
            key={f.text}
            className={`rounded-full px-3 py-1 text-[13px] font-semibold ${
              f.hot
                ? " text-black ring-1 ring-teal-200"
                : " text-slate-500 ring-1 ring-slate-200"
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
            key={tag}
            className="rounded-lg bg-teal-50 px-3 py-1 text-xs font-bold text-teal-600"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Stats grid — inside welcome card */}
      <StatsCards stats={stats} />

      {/* Upcoming tests section */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Upcoming tests</h3>
          <button
            onClick={() => router.push("/tests/upcoming")}
            className="text-xs font-semibold text-violet-500 hover:text-violet-600"
          >
            View all →
          </button>
        </div>

        <div className="mt-3 flex gap-6 overflow-x-auto pb-1">
          {tests.map((t) => (
            <button
              key={t.id}
              onClick={() => router.push(`/tests/${t.id}/start`)}
              className="flex shrink-0 flex-col items-center gap-2 text-center"
            >
              {t.logoUrl ? (
                <img
                  src={t.logoUrl}
                  alt={t.exam}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-violet-100"
                />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-600">
                  {t.exam.slice(0, 2)}
                </span>
              )}
              <span className="w-16 text-[11px] font-semibold text-slate-700 line-clamp-1">
                {t.exam}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}