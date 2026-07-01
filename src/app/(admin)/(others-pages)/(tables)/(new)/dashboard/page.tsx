

"use client";

import { useEffect, useState } from "react";
import {
  getDashboardStats,
  getAttendedTests,
  getInProgressTests,
} from "@/shared/dashboard";

import WelcomeCard from "@/components/dashboard/WelcomeCard";
import StudyStreak from "@/components/dashboard/StudyStreak";
import SubjectPerformanceChart from "@/components/dashboard/Subjectperformancechart";
import AttendedTestsTable from "@/components/dashboard/Attendedteststable";
import InProgressTests from "@/components/dashboard/InProgressTest";

import type { DashboardStats, AttendedTest, InProgressTest } from "@/components/dashboard/types";

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px]">
        <div className="h-64 rounded-3xl bg-slate-100" />
        <div className="flex flex-col gap-3">
          <div className="h-28 rounded-2xl bg-slate-100" />
          <div className="h-24 rounded-2xl bg-slate-100" />
          <div className="h-24 rounded-2xl bg-slate-100" />
        </div>
      </div>
      <div className="h-72 rounded-2xl bg-slate-100" />
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [attendedTests, setAttendedTests] = useState<AttendedTest[]>([]);
  const [inProgressTests, setInProgressTests] = useState<InProgressTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, testsRes, inProgressRes] = await Promise.all([
          getDashboardStats(),
          getAttendedTests(),
          getInProgressTests(),
        ]);
        setStats(statsRes.data);
        setAttendedTests(testsRes.data);
        setInProgressTests(inProgressRes.data);
      } catch {
        setError("Failed to load dashboard. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-rose-500">{error}</p>
      </div>
    );
  }

  // total time spent across all attended tests
  const totalTimeSeconds = attendedTests.reduce(
    (acc, t) => acc + (t.timeTakenSeconds ?? 0),
    0,
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Main grid — welcome + right sidebar */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px]">
        {/* Left — welcome card with stats inside */}
        {stats && <WelcomeCard stats={stats} />}

        {/* Right sidebar */}
        <div className="flex flex-col gap-4">
          {/* Paused tests */}
          {inProgressTests.length > 0 && (
            <InProgressTests tests={inProgressTests} />
          )}

          {/* Streak + total time */}
          <StudyStreak
            streakDays={stats?.streakDays ?? 0}
            totalTimeSeconds={totalTimeSeconds}
          />
        </div>
      </div>

      {/* Bottom — subject chart + attended table */}
      {stats && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr]">
          <AttendedTestsTable tests={attendedTests} />
          {/* <SubjectPerformanceChart data={stats.subjectPerformance} /> */}
        </div>
      )}
    </div>
  );
}