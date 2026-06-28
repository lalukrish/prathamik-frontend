"use client";

interface Props {
  streakDays: number;
  totalTimeSeconds: number;
}

function formatTotalTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function StudyStreak({ streakDays, totalTimeSeconds }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {/* Streak */}
      <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-orange-400">
              Study streak
            </p>
            <p className="mt-1 text-3xl font-extrabold text-orange-500">
              {streakDays} <span className="text-base font-semibold">days</span>
            </p>
            <p className="mt-0.5 text-[11px] text-amber-600">
              {streakDays >= 7 ? "🔥 Keep it up!" : "Build your streak daily"}
            </p>
          </div>
          <span className="text-4xl opacity-60">🔥</span>
        </div>
      </div>

      {/* Total time spent */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
          Total time in exams
        </p>
        <p className="mt-1 text-2xl font-extrabold text-slate-800">
          {formatTotalTime(totalTimeSeconds)}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-400">
          across all attended tests
        </p>
      </div>
    </div>
  );
}