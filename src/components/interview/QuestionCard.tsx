import { Question, DIFFICULTY_CONFIG } from "./type"

// ─── Answer input primitives ──────────────────────────────────────────────────

function TextAnswer({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer here…"
        rows={5}
        className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-700 placeholder-slate-300 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all leading-relaxed"
      />
      <span className="absolute bottom-3 right-4 text-[11px] text-slate-300 font-medium">
        {value.length} chars
      </span>
    </div>
  )
}


function RadioAnswer({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((opt) => {
        const selected = value === opt
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex items-center gap-3.5 w-full text-left px-4 py-3.5 rounded-2xl border text-sm font-medium transition-all duration-150 ${
              selected
                ? "border-blue-400 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <span
              className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                selected ? "border-blue-500 bg-blue-500" : "border-slate-300"
              }`}
            >
              {selected && <span className="w-2 h-2 rounded-full bg-white" />}
            </span>
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function MultiSelectAnswer({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string[]
  onChange: (v: string[]) => void
}) {
  const toggle = (opt: string) =>
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt])

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
        Select all that apply
      </p>
      {options.map((opt) => {
        const selected = value.includes(opt)
        return (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={`flex items-center gap-3.5 w-full text-left px-4 py-3.5 rounded-2xl border text-sm font-medium transition-all duration-150 ${
              selected
                ? "border-violet-400 bg-violet-50 text-violet-700 shadow-sm shadow-violet-100"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <span
              className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                selected ? "border-violet-500 bg-violet-500" : "border-slate-300"
              }`}
            >
              {selected && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            {opt}
          </button>
        )
      })}
    </div>
  )
}

// ─── QuestionCard ─────────────────────────────────────────────────────────────

interface QuestionCardProps {
  question: Question
  answer: string | string[]
  onAnswer: (v: string | string[]) => void
}

export function QuestionCard({ question, answer, onAnswer }: QuestionCardProps) {
  const diff = DIFFICULTY_CONFIG[question.difficulty]

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Meta row */}
      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${diff.color}`}>
            {diff.label}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            {question.weight} pts
          </span>
          {question.skillTags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <h2 className="text-base font-semibold text-slate-800 leading-relaxed">{question.question}</h2>
      </div>

      {/* Answer input */}
      {question.type === "TEXT" && (
        <TextAnswer value={answer as string} onChange={(v) => onAnswer(v)} />
      )}
      {question.type === "RADIO" && (
        <RadioAnswer options={question.options} value={answer as string} onChange={(v) => onAnswer(v)} />
      )}
      {question.type === "MULTIPLE_SELECT" && (
        <MultiSelectAnswer
          options={question.options}
          value={answer as string[]}
          onChange={(v) => onAnswer(v)}
        />
      )}
    </div>
  )
}