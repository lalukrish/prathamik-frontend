"use client";

import { useState } from "react";

const UPDATES = [
  { date: "Today", title: "SSC CGL 2026 notification tests added", tag: "New" },
  { date: "2 days ago", title: "Negative marking calculator improved", tag: "Update" },
  { date: "5 days ago", title: "Kerala PSC Degree Level mock refreshed", tag: "Update" },
  { date: "1 week ago", title: "Dark mode for the test-taking screen", tag: "New" },
];

export default function UpdatesPanel() {
  const [open, setOpen] = useState(false);

  return (
    // Hidden on mobile on purpose — a floating panel adds clutter on small screens
    <div className="fixed right-4 top-24 z-40 hidden sm:block">
      <div
        className={`overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg transition-all duration-300 ${
          open ? "w-72" : "w-auto"
        }`}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-2 whitespace-nowrap px-4 py-3 text-left text-xs font-bold text-slate-700"
        >
          <span className="flex h-2 w-2 shrink-0 animate-pulse rounded-full bg-blue-600" />
          {open ? "What's new" : "Updates"}
          <span className="ml-auto text-slate-400">{open ? "▾" : "▸"}</span>
        </button>

        {open && (
          <div className="max-h-[360px] overflow-y-auto border-t border-slate-100 px-4 py-3">
            {UPDATES.map((u, i) => (
              <div key={i} className={`py-2.5 ${i !== UPDATES.length - 1 ? "border-b border-slate-50" : ""}`}>
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      u.tag === "New" ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {u.tag}
                  </span>
                  <span className="text-[10px] text-slate-400">{u.date}</span>
                </div>
                <p className="text-xs leading-snug text-slate-600">{u.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}