import { QuestionType, Difficulty, TYPE_META, DIFFICULTY_META } from "./types"

export function TypeBadge({ type }: { type: QuestionType }) {
  const m = TYPE_META[type] ?? { label: type, classes: "bg-slate-50 text-slate-700 ring-slate-200", dot: "bg-slate-500" }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ring-1 ${m.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  )
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty | string }) {
  const m = DIFFICULTY_META[difficulty as Difficulty] ?? { label: difficulty ?? "Unknown", classes: "bg-slate-50 text-slate-700 border-slate-200" }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${m.classes}`}>
      {m.label}
    </span>
  )
}

export function SkillTag({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium">
      {tag}
    </span>
  )
}

export function RadioOptionsDisplay({ options }: { options: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-2 mt-1">
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg border bg-slate-50 border-slate-200">
          <div className="w-4 h-4 rounded-full border-2 border-slate-300 bg-white flex-shrink-0" />
          <span className="text-sm font-medium text-slate-500 leading-tight">{opt}</span>
        </div>
      ))}
    </div>
  )
}

export function MultiSelectOptionsDisplay({ options }: { options: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {options.map((opt, i) => (
        <span key={i} className="inline-flex items-center gap-1 bg-violet-50 text-violet-800 border border-violet-200 rounded-md px-2.5 py-1 text-xs font-semibold">
          <span className="w-3 h-3 rounded border-2 border-violet-400 inline-block flex-shrink-0" />
          {opt}
        </span>
      ))}
    </div>
  )
}

export function NoOptionsNote() {
  return <p className="text-sm text-slate-400 italic mt-1">Open-ended — candidate provides spoken / typed answer.</p>
}

export function TimeLimitBadge({ seconds }: { seconds: number }) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  const label = m > 0 ? (s > 0 ? `${m}m ${s}s` : `${m}m`) : `${s}s`
  return (
    <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-md px-2.5 py-0.5 text-xs font-semibold">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
      </svg>
      {label}
    </span>
  )
}