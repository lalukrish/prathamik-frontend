"use client";

import { useRouter } from "next/navigation";
import { InProgressTest } from "./types";

interface Props {
  tests: InProgressTest[];
}

function formatRemaining(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function InProgressTests({ tests }: Props) {
  const router = useRouter();

  if (tests.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-3.5 w-1 rounded-full bg-orange-400" />
        <h3 className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
          Resume paused tests
        </h3>
      </div>

      <div className="flex flex-col divide-y divide-slate-50">
        {tests.map((test) => (
          <div key={test.sessionId} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-base">
              📄
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-800">{test.title}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {test.status === "PAUSED" ? "Paused" : "In progress"} ·{" "}
                {formatRemaining(test.remainingSeconds)} left
              </p>
            </div>
            <button
              onClick={() => router.push(`/exam/session/${test.sessionId}`)}
              className="shrink-0 rounded-lg bg-orange-500 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-orange-600"
            >
              Resume
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}