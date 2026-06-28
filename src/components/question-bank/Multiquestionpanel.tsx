'use client'

import { useState } from "react"
import { QuestionForm, FormErrors } from "./types"
import { TypeBadge } from "./Badges"
import { QuestionFormFields } from "./Questionformfields"

interface MultiQuestionPanelProps {
  entries: QuestionForm[]
  onUpdate: (idx: number, form: QuestionForm) => void
  onRemove: (idx: number) => void
  onAdd: () => void
  errors?: FormErrors[]
}

export function MultiQuestionPanel({ entries, onUpdate, onRemove, onAdd, errors = [] }: MultiQuestionPanelProps) {
  const [expandedIdx, setExpandedIdx] = useState<number>(0)

  return (
    <div className="col-span-2 space-y-3">
      {entries.map((entry, idx) => {
        const isExpanded = expandedIdx === idx
        const hasContent = entry.question.trim().length > 0
        const hasError   = errors[idx] && Object.keys(errors[idx]).length > 0

        return (
          <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
            <div
              className={`flex items-center justify-between px-4 py-3 cursor-pointer select-none transition-colors ${
                isExpanded ? "bg-blue-50 border-b border-blue-100" : hasError ? "bg-red-50 hover:bg-red-100" : "bg-slate-50 hover:bg-slate-100"
              }`}
              onClick={() => setExpandedIdx(isExpanded ? -1 : idx)}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  isExpanded ? "bg-blue-600 text-white" : hasError ? "bg-red-500 text-white" : "bg-slate-200 text-slate-600"
                }`}>
                  {idx + 1}
                </span>
                {hasContent ? (
                  <div className="flex items-center gap-2 min-w-0">
                    <TypeBadge type={entry.type} />
                    <span className="text-sm text-slate-700 font-medium truncate max-w-xs">{entry.question}</span>
                  </div>
                ) : (
                  <span className="text-sm text-slate-400 italic">Question {idx + 1} — not filled yet</span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {hasError && !isExpanded && <span className="text-xs text-red-500 font-semibold">Has errors</span>}
                {hasContent && (
                  <>
                    <span className="bg-amber-100 text-amber-800 border border-amber-200 rounded-md px-2 py-0.5 text-xs font-bold font-mono">
                      {entry.weight} pts
                    </span>
                    <span className="bg-sky-50 text-sky-700 border border-sky-200 rounded-md px-2 py-0.5 text-xs font-semibold">
                      ⏱ {entry.timeLimitSeconds}s
                    </span>
                  </>
                )}
                {entries.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onRemove(idx) }}
                    className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {isExpanded && (
              <div className="p-4 bg-white">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <QuestionFormFields
                    form={entry}
                    setField={(key, value) => onUpdate(idx, { ...entry, [key]: value })}
                    errors={errors[idx] ?? {}}
                  />
                </div>
              </div>
            )}
          </div>
        )
      })}

      <button
        type="button"
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-500 hover:text-blue-600 rounded-xl py-3 text-sm font-semibold transition-all"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add Another Question
      </button>

      {entries.length > 1 && (
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
          <span className="text-xs text-slate-500 font-medium">
            {entries.length} questions · {entries.filter(e => e.question.trim()).length} filled
          </span>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2.5 py-0.5 font-mono">
            Total: {entries.reduce((s, e) => s + Number(e.weight), 0)} pts
          </span>
        </div>
      )}
    </div>
  )
}