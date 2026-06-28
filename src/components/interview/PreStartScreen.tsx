
'use client'

import { useState } from "react"
import { INTERVIEW_RULES, InterviewMeta } from "./type"
import { CancelModal } from "./CancelModal"

interface PreStartScreenProps {
  loading: boolean
  interview?: InterviewMeta   // duration + scheduled time from validate
  onStart: () => void
  onCancel: (reason: string) => Promise<void>
}

export function PreStartScreen({ loading, interview, onStart, onCancel }: PreStartScreenProps) {
  const [showCancelModal, setShowCancelModal] = useState(false)

  const handleCancelConfirm = async (reason: string) => {
    await onCancel(reason)
    setShowCancelModal(false)
  }

  return (
    <>
      <div className="p-6 animate-in fade-in duration-300">

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Ready to Begin</h2>
            <p className="text-xs text-slate-400">Please read the instructions carefully before starting</p>
          </div>
        </div>

        {/* Duration pill — shown when backend provides it */}
        {interview?.durationMinutes && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 mb-5">
            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-blue-700 font-medium">
              Total duration: <span className="font-bold">{interview.durationMinutes} minutes</span>
            </p>
          </div>
        )}

        {/* Rules */}
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 mb-5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Interview Rules</p>
          <ul className="flex flex-col gap-2.5">
            {INTERVIEW_RULES.map((rule, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold mt-0.5">
                  {i + 1}
                </span>
                {rule}
              </li>
            ))}
          </ul>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
          <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-xs text-amber-700 font-medium">
            Once you click <strong>Start Interview</strong>, the timer begins and your session is locked in. Make sure you're ready.
          </p>
        </div>

        {/* Buttons — Cancel is NEVER disabled */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowCancelModal(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl border-2 border-rose-200 bg-rose-50 text-rose-600 text-sm font-bold hover:bg-rose-100 hover:border-rose-300 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
          <button
            onClick={onStart}
            disabled={loading}
            className="flex-[2] flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold shadow-lg shadow-blue-200 hover:from-blue-700 hover:to-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Starting…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                </svg>
                Start Interview
              </>
            )}
          </button>
        </div>

      </div>

      {showCancelModal && (
        <CancelModal
          onConfirm={handleCancelConfirm}
          onClose={() => setShowCancelModal(false)}
        />
      )}
    </>
  )
}