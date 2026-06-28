'use client'

import { useState } from "react"

interface CancelModalProps {
  /** Called with the typed reason when user confirms. Parent owns the API call. */
  onConfirm: (reason: string) => Promise<void>
  onClose: () => void
}

export function CancelModal({ onConfirm, onClose }: CancelModalProps) {
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!reason.trim()) return
    setLoading(true)
    try {
      await onConfirm(reason.trim())
      // parent will unmount the modal on success
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-sm font-bold text-slate-800">Cancel Interview</h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-sm text-slate-500 mb-4">
            Are you sure you want to cancel this interview? Please provide a reason below.
          </p>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Reason <span className="text-rose-400">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. I have a scheduling conflict…"
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-300 focus:border-rose-300 focus:outline-none focus:ring-4 focus:ring-rose-50 transition-all"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all"
          >
            Go Back
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason.trim() || loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Cancelling…
              </>
            ) : (
              "Confirm Cancel"
            )}
          </button>
        </div>

      </div>
    </div>
  )
}