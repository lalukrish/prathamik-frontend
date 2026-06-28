'use client'
import { useState } from "react"
import type { ApplicationStatus, InterviewData } from "./types"
import { STATUS_COLORS, STATUS_OPTIONS, INTERVIEW_STATUS_CONFIG } from "./constants"

function CopyInterviewLink({ accessToken ,onLinkCopied }: { accessToken: string;onLinkCopied?: () => void }) {
  const [copied, setCopied] = useState(false)

 const handleCopy = () => {
  const user = JSON.parse(localStorage.getItem("user") ?? "{}");
  const orgName = (user.organisation ?? "")
    .toLowerCase()
    .replace(/\s+/g, "-");

  const link = `${window.location.origin}/${orgName}/candidate-interview-portal/${accessToken}`;
  navigator.clipboard.writeText(link).then(() => {
    setCopied(true);
      onLinkCopied?.();  // ✅ now properly received via props
    setTimeout(() => setCopied(false), 2000);
  });
};

  return (
    <button onClick={handleCopy} title="Copy interview link" className="ml-1 flex items-center gap-1 px-2 py-0.5 rounded-md border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition text-xs font-medium">
      {copied ? (
        <><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Copied!</>
      ) : (
        <><svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy Link</>
      )}
    </button>
  )
}

interface Props {
  status: ApplicationStatus
  statusOpen: boolean
  interview?: InterviewData
  isSchedulingInterview: boolean
  onStatusToggle: () => void
  onStatusChange: (s: ApplicationStatus) => void
  onCancelInterview: () => void
  onReschedule: () => void
    onLinkCopied?: () => void  // ✅ add this

}

export function InterviewStatusBar({
  status, statusOpen, interview, isSchedulingInterview,
  onStatusToggle, onStatusChange, onCancelInterview, onReschedule,
    onLinkCopied,  // ✅ add this

}: Props) {
  return (
    <div className="flex justify-end items-center gap-3 mb-4 relative">
      {status === "INTERVIEW" && (() => {
        if (isSchedulingInterview) {
          return (
            <div className="flex items-center gap-2 bg-white border border-blue-100 rounded-lg px-3 py-2 shadow-sm">
              <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-blue-600 font-medium">Generating interview link…</span>
            </div>
          )
        }

        if (!interview?.status) return null
        const cfg = INTERVIEW_STATUS_CONFIG[interview.status]

        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
              <span className="text-xs text-gray-400 font-medium">Interview:</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.color}`}>{cfg.label}</span>
              {interview.scheduledStartAt && (
                <span className="text-xs text-gray-400 ml-1">
                  · {new Date(interview.scheduledStartAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
              {interview.status === "SCHEDULED" && interview.accessToken && (
                <CopyInterviewLink accessToken={interview.accessToken}     onLinkCopied={onLinkCopied}  // ✅
/>
              )}
            </div>

            {interview.status === "SCHEDULED" && (
              <button onClick={onCancelInterview} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-orange-300 bg-orange-50 text-orange-700 text-xs font-semibold hover:bg-orange-100 transition shadow-sm">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                Cancel Interview
              </button>
            )}

            {(interview.status === "CANCELLED" || interview.status === "EXPIRED") && (
              <button onClick={onReschedule} className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-orange-300 bg-orange-50 text-orange-700 text-xs font-semibold hover:bg-orange-100 transition shadow-sm">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Reschedule
              </button>
            )}
          </div>
        )
      })()}

      {/* Status dropdown */}
      <div className="relative">
        <button onClick={onStatusToggle} className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold shadow-sm ${STATUS_COLORS[status]}`}>
          {status.charAt(0) + status.slice(1).toLowerCase()}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {statusOpen && (
          <div className="absolute top-11 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-xl w-52 overflow-hidden">
            {STATUS_OPTIONS.map((s) => (
              <button key={s} onClick={() => onStatusChange(s)} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${status === s ? "font-bold text-blue-600" : "text-gray-700"}`}>
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}