"use client";

interface ExamFooterProps {
  currentIndex: number;
  totalQuestions: number;
  isMarkedForReview: boolean;
  onPrev: () => void;
  onNext: () => void;
  onMarkReview: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function ExamFooter({
  currentIndex,
  totalQuestions,
  isMarkedForReview,
  onPrev,
  onNext,
  onMarkReview,
  onSubmit,
  isSubmitting,
}: ExamFooterProps) {
  return (
    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
      {/* Left: Review toggle */}
      <button
        onClick={onMarkReview}
        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
          isMarkedForReview
            ? "bg-slate-800 text-white hover:bg-slate-700"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        <span className="text-base">{isMarkedForReview ? "★" : "☆"}</span>
        {isMarkedForReview ? "Marked" : "Mark for Review"}
      </button>

      {/* Center: navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          disabled={currentIndex === totalQuestions - 1}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
        >
          Next →
        </button>
      </div>

      {/* Right: Submit */}
      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:pointer-events-none disabled:opacity-60"
      >
        {isSubmitting ? "Submitting…" : "Submit Test"}
      </button>
    </div>
  );
}