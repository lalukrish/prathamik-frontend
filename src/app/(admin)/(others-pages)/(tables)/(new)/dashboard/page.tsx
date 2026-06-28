// "use client";

// import { useEffect, useState } from "react";
// import {
//   getDashboardStats,
//   getAttendedTests,
//   getInProgressTests,
// } from "@/shared/dashboard";

// import StatsCards from "@/components/dashboard/Statscards";
// import SubjectPerformanceChart from "@/components/dashboard/Subjectperformancechart";
// import AttendedTestsTable from "@/components/dashboard/Attendedteststable";
// import InProgressTests from "@/components/dashboard/InProgressTest";

// import type { DashboardStats, AttendedTest, InProgressTest } from "@/components/dashboard/types";

// function DashboardSkeleton() {
//   return (
//     <div className="flex flex-col gap-6 animate-pulse">
//       <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
//         {[...Array(5)].map((_, i) => (
//           <div key={i} className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
//         ))}
//       </div>
//       <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_380px]">
//         <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
//         <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
//       </div>
//       <div className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
//     </div>
//   );
// }

// export default function DashboardPage() {
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [attendedTests, setAttendedTests] = useState<AttendedTest[]>([]);
//   const [inProgressTests, setInProgressTests] = useState<InProgressTest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [statsRes, testsRes, inProgressRes] = await Promise.all([
//           getDashboardStats(),
//           getAttendedTests(),
//           getInProgressTests(),
//         ]);

//         setStats(statsRes.data);
//         setAttendedTests(testsRes.data);
//         setInProgressTests(inProgressRes.data);
//       } catch {
//         setError("Failed to load dashboard. Please refresh.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, []);

//   if (loading) return <DashboardSkeleton />;

//   if (error) {
//     return (
//       <div className="flex h-64 items-center justify-center">
//         <p className="text-sm text-red-500">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-6">
//       {/* Resume pending tests banner */}
//       {inProgressTests.length > 0 && (
//         <InProgressTests tests={inProgressTests} />
//       )}

//       {/* Stats cards */}
//       {stats && <StatsCards stats={stats} />}

//       {/* Charts row */}
//       {stats && (
//         <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_380px]">
//           {/* Score trend — placeholder slot for a line chart if you add it later */}
//           <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
//             <h3 className="mb-1 text-sm font-semibold text-slate-700">Score Trend</h3>
//             <p className="mb-4 text-xs text-slate-400">Your score across recent tests</p>
//             {attendedTests.length === 0 ? (
//               <div className="flex h-48 items-center justify-center text-sm text-slate-400">
//                 Take a test to see your trend
//               </div>
//             ) : (
//               <div className="flex flex-col gap-2">
//                 {[...attendedTests].reverse().slice(0, 8).map((test, i) => (
//                   <div key={test.sessionId} className="flex items-center gap-3">
//                     <span className="w-4 text-right text-xs text-slate-400">
//                       {i + 1}
//                     </span>
//                     <span className="w-36 truncate text-xs text-slate-600">
//                       {test.title}
//                     </span>
//                     <div className="flex-1 overflow-hidden rounded-full bg-slate-100">
//                       <div
//                         className={`h-2 rounded-full transition-all ${
//                           test.score.percentage >= 75
//                             ? "bg-emerald-500"
//                             : test.score.percentage >= 50
//                               ? "bg-amber-400"
//                               : "bg-red-400"
//                         }`}
//                         style={{ width: `${test.score.percentage}%` }}
//                       />
//                     </div>
//                     <span className="w-10 text-right text-xs font-semibold text-slate-700">
//                       {test.score.percentage}%
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Subject radar chart */}
//           {/* <SubjectPerformanceChart data={stats.subjectPerformance} /> */}
//         </div>
//       )}

//       {/* Attended tests table */}
//       <AttendedTestsTable tests={attendedTests} />
//     </div>
//   );
// }

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
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_380px]">
          <AttendedTestsTable tests={attendedTests} />
          {/* <SubjectPerformanceChart data={stats.subjectPerformance} /> */}
        </div>
      )}
    </div>
  );
}