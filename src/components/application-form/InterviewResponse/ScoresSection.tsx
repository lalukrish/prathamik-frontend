'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { ApplicationScores } from './types'
import { makeChartOptions, SCORE_CHARTS } from './constants'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

export function ScoresSection({ scores }: { scores: ApplicationScores }) {
  const [feedbackOpen, setFeedbackOpen] = useState(true)

  return (
    <div className="px-6 py-5 border-t border-gray-100 space-y-4">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">AI Scores</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SCORE_CHARTS.map((sc) => {
          const value = (scores as unknown as Record<string, number>)[sc.key] ?? 0
          const pct   = Math.min((value / 10) * 100, 100)
          return (
            <div key={sc.key} className="flex flex-col items-center">
              <div className="w-full max-h-[140px]">
                <ReactApexChart options={makeChartOptions(sc.color)} series={[pct]} type="radialBar" height={140} />
              </div>
              <p className="text-[11px] text-slate-500 font-semibold -mt-2 text-center">{sc.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{value} / 10</p>
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Resume',          value: scores.resumeScore,         max: 10,   color: 'bg-blue-50 text-blue-700 border-blue-200'     },
          { label: 'Problem Solving', value: scores.problemSolvingScore, max: 10,   color: 'bg-violet-50 text-violet-700 border-violet-200' },
          { label: 'Cheat Score',     value: scores.cheatScore,          max: null, color: scores.cheatScore > 50 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-100 text-slate-600 border-slate-200' },
        ].map(({ label, value, max, color }) => (
          <span key={label} className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${color}`}>
            {label}: {value}{max ? ` / ${max}` : ''}
          </span>
        ))}
      </div>

      {scores.aiFeedback && (
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <button
            onClick={() => setFeedbackOpen(o => !o)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-violet-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              AI Feedback
            </span>
            <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${feedbackOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {feedbackOpen && (
            <div className="px-4 py-3 text-sm text-slate-600 leading-relaxed bg-white">
              {scores.aiFeedback}
            </div>
          )}
        </div>
      )}
    </div>
  )
}