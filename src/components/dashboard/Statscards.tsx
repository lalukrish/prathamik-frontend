"use client";

import { DashboardStats } from "./types";

interface Props {
  stats: DashboardStats;
}

export default function StatsCards({ stats }: Props) {
  const cards = [
    {
      label: "Tests attended",
      value: stats.totalTests,
      suffix: "",
      color: "text-orange-500",
      bg: "bg-orange-50",
      icon: "📋",
    },
    {
      label: "Average score",
      value: stats.avgScore,
      suffix: "%",
      color: "text-sky-500",
      bg: "bg-sky-50",
      icon: "📊",
    },
    {
      label: "Best score",
      value: stats.bestScore,
      suffix: "%",
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      icon: "🏆",
    },
    {
      label: "Overall accuracy",
      value: stats.overallAccuracy,
      suffix: "%",
      color: "text-violet-500",
      bg: "bg-violet-50",
      icon: "🎯",
    },
    {
      label: "Negative marks lost",
      value: stats.totalNegativeMarks,
      suffix: "",
      color: "text-rose-500",
      bg: "bg-rose-50",
      icon: "⚠️",
    },
  ];

  return (
    <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-2xl p-5.5 ${card.bg}`}
        >
          <p className={`text-xl font-extrabold ${card.color}`}>
            {card.value}{card.suffix}
          </p>
          <p className="mt-0.5 text-[13px] text-slate-500 leading-tight">{card.label}</p>
        </div>
      ))}
    </div>
  );
}