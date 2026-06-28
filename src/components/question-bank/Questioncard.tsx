'use client'
import { ApiQuestion } from "./types"
import { TypeBadge, DifficultyBadge, SkillTag, RadioOptionsDisplay, MultiSelectOptionsDisplay, NoOptionsNote, TimeLimitBadge } from "./Badges"
import { VoicePlayer } from "./voice-qusetion"

interface QuestionCardProps {
  question: ApiQuestion
  index: number
  onEdit: (q: ApiQuestion) => void
  onDelete: (id: string) => void
}



export function QuestionCard({ question: q, index: idx, onEdit, onDelete }: QuestionCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
      <div className="flex">
        <div className="flex-1 min-w-0 p-5">
          <div className="flex items-center flex-wrap gap-2 mb-3">
            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
              {idx + 1}
            </span>
            <TypeBadge type={q.type} />
            {(q.skillTags ?? []).map((tag, tagIdx) => (
              <SkillTag key={`${q.id}-tag-${tagIdx}`} tag={tag} />
            ))}
          </div>

          <p className="text-[15px] font-semibold text-slate-800 leading-snug mb-3">{q.question}</p>

       <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              {q.type === "RADIO" || q.type === "MULTIPLE_SELECT" ? "Options" : "Answer Format"}
            </p>
            {q.type === "RADIO" && q.options.length > 0 ? (
              <RadioOptionsDisplay options={q.options} />
            ) : q.type === "MULTIPLE_SELECT" && q.options.length > 0 ? (
              <MultiSelectOptionsDisplay options={q.options} />
            ) : (
              <NoOptionsNote />
            )}
          </div>

          {q.type === "VOICE_TYPE" && (
            <VoicePlayer text={q.question} />
          )}
        </div>

        <div className="w-px bg-slate-100 flex-shrink-0" />

        <div className="w-48 flex-shrink-0 bg-slate-50/70 p-4 flex flex-col gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Difficulty</p>
            <DifficultyBadge difficulty={q.difficulty} />
          </div>
          <div className="h-px bg-slate-200" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Marks</span>
            <span className="bg-amber-100 text-amber-800 border border-amber-200 rounded-md px-2.5 py-0.5 text-xs font-bold font-mono">
              {q.weight} pts
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Time</span>
            <TimeLimitBadge seconds={q.timeLimitSeconds ?? 60} />
          </div>
          <div className="h-px bg-slate-200" />
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onEdit(q)}
              className="flex items-center justify-center gap-1.5 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => onDelete(q.id)}
              className="flex items-center justify-center gap-1.5 w-full bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0l-1 14a2 2 0 01-2 2H9a2 2 0 01-2-2L6 6" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-2 flex items-center gap-3">
        {q.aiGenerated && (
          <span className="inline-flex items-center gap-1 text-[11px] text-violet-600 font-semibold bg-violet-50 border border-violet-100 rounded-full px-2.5 py-0.5">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Generated
          </span>
        )}
        <span className="text-[11px] text-slate-400">
          {new Date(q.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      </div>
    </div>
  )
}