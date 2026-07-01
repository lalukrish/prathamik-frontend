"use client";

import { useState, useEffect } from "react";

const OPTIONS = [
  "73rd Amendment, 1992",
  "42nd Amendment, 1976",
  "44th Amendment, 1978",
  "86th Amendment, 2002",
];
const CORRECT_INDEX = 0;

function LiveTimer() {
  const [time, setTime] = useState({ h: 1, m: 47, s: 33 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) return prev;
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  const units = [{ v: pad(time.h), l: "HRS" }, { v: pad(time.m), l: "MIN" }, { v: pad(time.s), l: "SEC" }];
  return (
    <div className="flex items-center gap-2">
      {units.map((u, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className="flex flex-col items-center">
            <span className="rounded-xl bg-white px-3 py-2 font-mono text-xl font-black tabular-nums text-slate-800 shadow-sm ring-1 ring-slate-200 sm:text-2xl">
              {u.v}
            </span>
            <span className="mt-0.5 text-[9px] font-bold tracking-widest text-slate-400">{u.l}</span>
          </span>
          {i < 2 && <span className="mb-4 text-lg font-black text-blue-500">:</span>}
        </span>
      ))}
    </div>
  );
}

export default function ExamQuestionCard() {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (i: number) => {
    if (selected !== null) return; // lock once answered, like a real exam
    setSelected(i);
  };
  const reset = () => setSelected(null);

  const getOptionStyle = (i: number) => {
    if (selected === null) return "border-slate-100 text-slate-600 hover:border-slate-200";
    if (i === CORRECT_INDEX) return "border-emerald-400 bg-emerald-50 text-emerald-700";
    if (i === selected) return "border-red-400 bg-red-50 text-red-700";
    return "border-slate-100 text-slate-400";
  };

  const getBadgeStyle = (i: number) => {
    if (selected === null) return "bg-slate-100 text-slate-500";
    if (i === CORRECT_INDEX) return "bg-emerald-400 text-white";
    if (i === selected) return "bg-red-400 text-white";
    return "bg-slate-100 text-slate-400";
  };

  return (
    <div className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl shadow-blue-100 ring-1 ring-slate-100">
      <div className="mb-4 flex items-center justify-between rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
        <div>
          <p className="text-xs font-semibold text-white/70">UPSC Prelims Mock</p>
          <p className="text-sm font-bold text-white">Question 42 of 100</p>
        </div>
        <LiveTimer />
      </div>

      <div className="mb-4 rounded-xl bg-slate-50 p-3.5">
        <p className="text-xs font-medium leading-relaxed text-slate-700">
          <span className="mr-1 font-bold text-blue-600">Q42.</span>
          Which constitutional amendment introduced the concept of cooperative federalism in India?
        </p>
      </div>

      <div className="mb-3 flex flex-col gap-2">
        {OPTIONS.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSelect(i)}
            className={`flex items-center gap-3 rounded-xl border p-2.5 text-left text-xs font-medium transition-all ${getOptionStyle(i)}`}
          >
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${getBadgeStyle(i)}`}>
              {selected !== null && i === CORRECT_INDEX ? "✓" : selected === i ? "✕" : ["A", "B", "C", "D"][i]}
            </span>
            {opt}
          </button>
        ))}
      </div>

      {selected !== null && (
        <p className={`mb-3 text-xs font-semibold ${selected === CORRECT_INDEX ? "text-emerald-600" : "text-red-500"}`}>
          {selected === CORRECT_INDEX ? "Correct! Well done." : "Not quite — correct answer is highlighted in green."}
        </p>
      )}

      <div className="flex items-center justify-between">
        <button onClick={reset} className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white">
          ↻ Try Again
        </button>
        <div className="flex gap-2">
          <button className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600">← Prev</button>
          <button className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white">Next →</button>
        </div>
      </div>

      <div className="mt-3 flex gap-0.5 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i < 12 ? "bg-emerald-400" : i === 12 ? "bg-blue-500" : i < 15 ? "bg-amber-400" : "bg-slate-100"}`} />
        ))}
      </div>
      {/* hidden on mobile — keeps the card lighter on small screens */}
      <div className="mt-1 hidden justify-between text-[10px] text-slate-400 sm:flex">
        <span>✓ 12 answered</span><span>★ 3 review</span><span>○ 5 skipped</span>
      </div>
    </div>
  );
}