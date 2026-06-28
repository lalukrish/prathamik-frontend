'use client'
import { useState } from 'react'
import type { Interview } from './types'
import { ScoresSection } from './ScoresSection'
import { SecuritySection } from './SecuritySection'
import { STATUS_STYLES, DIFFICULTY_STYLES, TYPE_LABELS, fmt, fmtDuration } from './constants'

export function InterviewAccordion({ interview }: { interview: Interview }) {
  const [open, setOpen]           = useState(false)
  const [activeTab, setActiveTab] = useState<'scores' | 'answers' | 'security'>('scores')

  const scores       = interview.scores?.[0] ?? interview.application?.scores ?? null
  const statusStyle  = STATUS_STYLES[interview.status] ?? STATUS_STYLES.PENDING
  const highSecEvents = (interview.securityEvents ?? []).filter(e => e.severity === 'HIGH').length

  const totalEarned    = interview.answers.reduce((sum, a) => sum + (a.score ?? 0), 0)
  const totalPossible  = interview.answers.reduce((sum, a) => sum + (a.question?.maxScore ?? 0), 0)
  const totalDuration  = interview.answers.reduce((sum, a) => sum + (a.durationSeconds ?? 0), 0)
  const totalTimeLimit = interview.answers.reduce((sum, a) => sum + (a.question?.timeLimitSeconds ?? 0), 0)

  const tabs = ([
    { id: 'scores',   label: 'Scores',          count: null,                              hide: !scores                          },
    { id: 'answers',  label: 'Answers',          count: interview.answers.length,          hide: false                            },
    { id: 'security', label: 'Security Events',  count: interview.securityEvents?.length ?? 0, hide: !interview.securityEvents?.length },
  ] as { id: 'scores' | 'answers' | 'security'; label: string; count: number | null; hide?: boolean }[])
    .filter(t => !t.hide)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">

      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${statusStyle.dot}`} />
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{interview.questionBank?.title ?? 'Interview'}</p>
            <p className="text-xs text-slate-400 mt-0.5">{fmt(interview.scheduledStartAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`hidden sm:inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusStyle.pill}`}>
            {interview.status.replace(/_/g, ' ')}
          </span>
          {interview.status === 'COMPLETED' && totalPossible > 0 && (
            <span className="hidden sm:inline-flex text-[11px] font-semibold text-violet-700 bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-full">
              {totalEarned} / {totalPossible} pts
            </span>
          )}
          {highSecEvents > 0 && (
            <span className="hidden sm:inline-flex text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
              ⚠ {highSecEvents} alert{highSecEvents > 1 ? 's' : ''}
            </span>
          )}
          <span className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </button>

      {/* Body */}
      {open && (
        <div className="border-t border-gray-100">

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100">
            {[
              { label: 'Questions', value: `${interview.answers.length} / ${interview.totalQuestions} answered` },
              { label: 'Time Taken', value: interview.answers.length > 0 ? `${fmtDuration(totalDuration)} / ${fmtDuration(totalTimeLimit)}` : `— / ${interview.durationMinutes}m` },
              { label: 'Score',      value: interview.answers.length > 0 ? `${totalEarned} / ${totalPossible} pts` : '—' },
              { label: 'Completed',  value: fmt(interview.completedAt) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 px-5 py-3">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-sm font-bold text-slate-700 mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-6 pt-4 gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors ${
                  activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.label}
                {tab.count != null && tab.count > 0 && (
                  <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab: Answers */}
          {activeTab === 'answers' && (
            interview.answers.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {interview.answers.map((answer, idx) => (
                  <div key={answer.id} className="px-6 py-5">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold flex items-center justify-center mt-0.5 border border-blue-100">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <p className="text-sm font-medium text-slate-700 leading-snug">{answer.question?.question}</p>
                          <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap">
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${DIFFICULTY_STYLES[answer.question?.difficulty] ?? ''}`}>
                              {answer.question?.difficulty}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              {TYPE_LABELS[answer.question?.type] ?? answer.question?.type}
                            </span>
                            <span className="text-[11px] font-semibold text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full">
                              {answer.question?.maxScore} pts
                            </span>
                          </div>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-600 leading-relaxed">
                          {answer.answerText || <span className="italic text-slate-400">No answer submitted</span>}
                        </div>
                        <div className="flex items-center gap-4 pt-0.5">
                          <span className="text-xs text-slate-400">
                            Score:{' '}
                            <span className={`font-semibold ${answer.score != null ? 'text-slate-700' : 'text-slate-400'}`}>
                              {answer.score != null ? `${answer.score} / ${answer.question?.maxScore}` : '0'}
                            </span>
                          </span>
                          {answer.durationSeconds != null && (
                            <span className="text-xs text-slate-400">
                              Time: <span className="font-semibold text-slate-700">{answer.durationSeconds}s</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-10 text-sm text-center text-slate-400">No responses submitted for this interview.</div>
            )
          )}

          {activeTab === 'scores' && scores && <ScoresSection scores={scores} />}
          {activeTab === 'security' && <SecuritySection events={interview.securityEvents ?? []} />}
        </div>
      )}
    </div>
  )
}