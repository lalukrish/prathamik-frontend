"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { SubjectPerformance } from "./types";

interface Props {
  data: SubjectPerformance[];
}

export default function SubjectPerformanceChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-400">
        No subject data yet
      </div>
    );
  }

  const chartData = data.map((s) => ({
    subject: s.subject,
    percentage: s.percentage,
    fullMark: 100,
  }));

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="mb-1 text-sm font-semibold text-slate-700">
        Subject Performance
      </h3>
      <p className="mb-4 text-xs text-slate-400">Score % per subject across all tests</p>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 11, fill: "#64748b" }}
          />
          <Radar
            name="Score %"
            dataKey="percentage"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.2}
          />
        <Tooltip
  formatter={(value) => [`${Number(value ?? 0).toFixed(0)}%`, "Score"]}
  contentStyle={{
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "12px",
  }}
/>
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}