"use client";

import { useRouter } from "next/navigation";
import { AttendedTest } from "./types";

interface Props {
  tests: AttendedTest[];
}

function formatTime(seconds: number | null) {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function ScoreBadge({ percentage }: { percentage: number }) {
  const color =
    percentage >= 75
      ? "bg-emerald-100 text-emerald-700"
      : percentage >= 50
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-600";

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}>
      {percentage}%
    </span>
  );
}

export default function AttendedTestsTable({ tests }: Props) {
  const router = useRouter();

  if (tests.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-400">
        No tests attended yet
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <h3 className="text-sm font-semibold text-slate-700">Attended Tests</h3>
        <p className="text-xs text-slate-400">Click a row to view full result</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs text-slate-400">
              <th className="px-6 py-3 text-left font-medium">Test</th>
              <th className="px-4 py-3 text-center font-medium">Score</th>
              <th className="px-4 py-3 text-center font-medium">+Marks</th>
              <th className="px-4 py-3 text-center font-medium">−Marks</th>
              <th className="px-4 py-3 text-center font-medium">Accuracy</th>
              <th className="px-4 py-3 text-center font-medium">Attempted</th>
              <th className="px-4 py-3 text-center font-medium">Time Taken</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => (
              <tr
                key={test.sessionId}
                onClick={() => router.push(`/exam/results/${test.sessionId}`)}
                className="cursor-pointer border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-800">{test.title}</p>
                  <p className="text-xs text-slate-400">
                    {test.submittedAt
                      ? new Date(test.submittedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-semibold text-slate-800">
                      {test.score.final}/{test.score.total}
                    </span>
                    <ScoreBadge percentage={test.score.percentage} />
                  </div>
                </td>
                <td className="px-4 py-4 text-center font-medium text-emerald-600">
                  +{test.score.positive}
                </td>
                <td className="px-4 py-4 text-center font-medium text-red-500">
                  -{test.score.negative}
                </td>
                <td className="px-4 py-4 text-center text-slate-600">
                  {test.questions.accuracy}%
                </td>
                <td className="px-4 py-4 text-center text-slate-600">
                  {test.questions.attempted}/{test.questions.total}
                </td>
                <td className="px-4 py-4 text-center text-slate-500">
                  {formatTime(test.timeTakenSeconds)}
                </td>
                <td className="px-4 py-4 text-center">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      test.status === "SUBMITTED"
                        ? "bg-slate-100 text-slate-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {test.status === "SUBMITTED" ? "Submitted" : "Expired"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}