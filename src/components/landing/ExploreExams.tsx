"use client";

import { useRef } from "react";
import Link from "next/link";

const EXAMS = [
  { code: "SBI PO", initials: "SBI", bg: "bg-blue-50", text: "text-blue-700" },
  { code: "IBPS PO", initials: "IBPS", bg: "bg-indigo-50", text: "text-indigo-700" },
  { code: "SBI Clerk", initials: "SBI", bg: "bg-violet-50", text: "text-violet-700" },
  { code: "IBPS Clerk", initials: "IBPS", bg: "bg-purple-50", text: "text-purple-700" },
  { code: "IBPS RRB PO", initials: "IBPS", bg: "bg-amber-50", text: "text-amber-700" },
  { code: "IBPS RRB Clerk", initials: "IBPS", bg: "bg-orange-50", text: "text-orange-700" },
  { code: "SSC CGL", initials: "SSC", bg: "bg-emerald-50", text: "text-emerald-700" },
  { code: "SSC CHSL", initials: "SSC", bg: "bg-green-50", text: "text-green-700" },
  { code: "Railways RRB NTPC", initials: "RRB", bg: "bg-rose-50", text: "text-rose-700" },
  { code: "RBI Grade B", initials: "RBI", bg: "bg-slate-100", text: "text-slate-700" },
  { code: "NABARD Grade A & B", initials: "NAB", bg: "bg-teal-50", text: "text-teal-700" },
  { code: "UPSC CSE", initials: "UPSC", bg: "bg-blue-50", text: "text-blue-700" },
  { code: "UPPSC PCS", initials: "PCS", bg: "bg-indigo-50", text: "text-indigo-700" },
  { code: "Defence Exams", initials: "DF", bg: "bg-red-50", text: "text-red-700" },
];

export default function ExploreExams() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <section className="bg-white px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 sm:text-2xl">
            Explore Upcoming &amp; Popular Exams
          </h2>
          <div className="hidden gap-2 sm:flex">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Scroll left"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600"
            >
              ←
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Scroll right"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600"
            >
              →
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-14 bg-gradient-to-l from-white to-transparent" />
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
            style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
          >
            {EXAMS.map((exam) => (
              <Link
                key={exam.code}
                href="/login"
                className="flex w-20 shrink-0 flex-col items-center gap-2 sm:w-24"
                style={{ scrollSnapAlign: "start" }}
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl text-xs font-black sm:h-20 sm:w-20 sm:text-sm ${exam.bg} ${exam.text}`}
                >
                  {exam.initials}
                </div>
                <p className="text-center text-[11px] font-medium leading-tight text-slate-600 sm:text-xs">
                  {exam.code}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}