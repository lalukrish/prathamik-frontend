
'use client'

import { useState } from "react"
import { InterviewMeta } from "./type"
import { CancelModal } from "./CancelModal"

interface ResumeScreenProps {
  loading: boolean
  interview?: InterviewMeta
  onResume: () => void
  onCancel: (reason: string) => Promise<void>
}

export function ResumeScreen({ loading, interview, onResume, onCancel }: ResumeScreenProps) {
  const [showCancelModal, setShowCancelModal] = useState(false)

  const handleCancelConfirm = async (reason: string) => {
    await onCancel(reason)
    setShowCancelModal(false)
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center py-10 px-6 animate-in fade-in duration-300">

        <div className="w-16 h-16 rounded-2xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
          </svg>
        </div>

        <h2 className="text-lg font-bold text-slate-800 mb-2">Interview In Progress</h2>
        <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
          Your session is already active. Pick up right where you left off.
        </p>

        {/* Duration pill */}
        {interview?.durationMinutes && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 mt-4">
            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-blue-700 font-medium">
              Total duration: <span className="font-bold">{interview.durationMinutes} minutes</span>
            </p>
          </div>
        )}

        <div className="flex gap-3 w-full max-w-xs mt-8">
          {/* Cancel — always enabled */}
          <button
            onClick={() => setShowCancelModal(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-rose-200 bg-rose-50 text-rose-600 text-sm font-bold hover:bg-rose-100 hover:border-rose-300 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>

          {/* Resume */}
          <button
            onClick={onResume}
            disabled={loading}
            className="flex-[2] flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold shadow-lg shadow-blue-200 hover:from-blue-700 hover:to-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Loading…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                </svg>
                Resume Interview
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