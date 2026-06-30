
"use client";

// import { Question } from "../types";

export interface Option {
  id: string;
  text: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface Question {
  id: string;
  question: string;
  subject?: Subject;
  subjectId?: string;
  type: string;
  marks: number;
  negativeMarks: number;
  difficulty: string;
  sortOrder: number;
  options: Option[];
}
interface QuestionPaletteProps {
  questions: Question[];
  currentIndex: number;
  answeredIds: Set<string>;
  reviewIds: Set<string>;
  onNavigate: (index: number) => void;
  sections?: { name: string; questionIds: string[] }[];
}

type QuestionDotStatus = "current" | "answered" | "review" | "not_attempted";

function getStatus(
  questionId: string,
  currentId: string,
  answeredIds: Set<string>,
  reviewIds: Set<string>,
): QuestionDotStatus {
  if (questionId === currentId) return "current";
  if (reviewIds.has(questionId)) return "review";
  if (answeredIds.has(questionId)) return "answered";
  return "not_attempted";
}

const statusStyles: Record<QuestionDotStatus, string> = {
  current: "bg-blue-500 text-white ring-2 ring-blue-300 ring-offset-1",
  answered: "bg-emerald-500 text-white",
  review: "bg-slate-800 text-white",
  not_attempted: "bg-white text-slate-500 ring-1 ring-slate-200 hover:ring-slate-400",
};

export default function QuestionPalette({
  questions,
  currentIndex,
  answeredIds,
  reviewIds,
  onNavigate,
  sections,
}: QuestionPaletteProps) {
  const currentId = questions[currentIndex]?.id;

  // Group questions by section if sections provided, else treat as one group
  const groups: { name: string; items: { q: Question; idx: number }[] }[] = [];

  if (sections && sections.length > 0) {
    const idxMap = new Map(questions.map((q, i) => [q.id, i]));
    for (const section of sections) {
      groups.push({
        name: section.name,
        items: section.questionIds
          .map((id) => {
            const idx = idxMap.get(id);
            const q = questions[idx ?? -1];
            return idx !== undefined && q ? { q, idx } : null;
          })
          .filter(Boolean) as { q: Question; idx: number }[],
      });
    }
  } else {
    // Auto-group by subject field if present
    const subjectMap = new Map<string, { q: Question; idx: number }[]>();
    questions.forEach((q, idx) => {
      const subject = q.subject?.name || "General";
      if (!subjectMap.has(subject)) subjectMap.set(subject, []);
      subjectMap.get(subject)!.push({ q, idx });
    });
    subjectMap.forEach((items, name) => groups.push({ name, items }));
  }

  return (
    <div className="flex flex-col gap-5">
      {groups.map((group) => (
        <div key={group.name}>
          <div className="mb-2.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {group.name}
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {group.items.map(({ q, idx }) => {
              const status = getStatus(q.id, currentId, answeredIds, reviewIds);
              return (
                <button
                  key={q.id}
                  title={`Question ${idx + 1}`}
                  onClick={() => onNavigate(idx)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-all ${statusStyles[status]}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="mt-1 flex flex-col gap-1.5 border-t border-slate-100 pt-4">
        {[
          { label: "Current", color: "bg-blue-500" },
          { label: "Answered", color: "bg-emerald-500" },
          { label: "Marked for Review", color: "bg-slate-800" },
          { label: "Not Attempted", color: "bg-white ring-1 ring-slate-300" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2 text-xs text-slate-500">
            <span className={`h-3 w-3 rounded-sm ${color}`} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}