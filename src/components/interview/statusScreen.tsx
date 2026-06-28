// ─── StatusScreens.tsx ────────────────────────────────────────────────────────
// Pure display components — no API calls, no state beyond what's passed in.

export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm text-slate-500">Validating interview session…</p>
    </div>
  )
}

export function InvalidScreen({ type }: { type: "invalid" | "expired" }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-6">
      <div className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center mb-5">
        <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-slate-800 mb-2">
        {type === "expired" ? "Interview Expired" : "Invalid Interview Link"}
      </h2>
      <p className="text-sm text-slate-500 max-w-xs">
        {type === "expired"
          ? "This interview session has expired or was cancelled. Please contact the hiring team."
          : "This interview link is invalid or has already been used."}
      </p>
    </div>
  )
}

export function NotStartedScreen({ message }: { message?: string }) {
  const dateMatch = message?.match(/\d{4}-\d{2}-\d{2}T[\d:.Z]+/)
  const scheduledTime = dateMatch
    ? new Date(dateMatch[0]).toLocaleDateString("en-IN", {
        weekday: "long", day: "numeric", month: "long",
        year: "numeric", hour: "2-digit", minute: "2-digit",
      })
    : null

  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center mb-5">
        <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-slate-800 mb-2">Interview Not Started Yet</h2>
      {scheduledTime ? (
        <>
          <p className="text-sm text-slate-500 mb-3">Your interview is scheduled for</p>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 mb-4">
            <p className="text-sm font-bold text-amber-700">{scheduledTime}</p>
          </div>
          <p className="text-xs text-slate-400 max-w-xs">
            Please come back at the scheduled time. The link will become active then.
          </p>
        </>
      ) : (
        <p className="text-sm text-slate-500 max-w-xs">
          {message ?? "This interview hasn't started yet. Please come back at the scheduled time."}
        </p>
      )}
    </div>
  )
}

export function ReadyToStartScreen({ message }: { message?: string }) {
  //const dateMatch = message?.match(/\d{4}-\d{2}-\d{2}T[\d:.Z]+/)
  // const scheduledTime = dateMatch
  //   ? new Date(dateMatch[0]).toLocaleDateString("en-IN", {
  //       weekday: "long", day: "numeric", month: "long",
  //       year: "numeric", hour: "2-digit", minute: "2-digit",
  //     })
  //   : null

  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center mb-5">
        <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      {/* <h2 className="text-lg font-bold text-slate-800 mb-2">Interview Not Started Yet</h2>
      {scheduledTime ? (
        <>
          <p className="text-sm text-slate-500 mb-3">Your interview is scheduled for</p>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 mb-4">
            <p className="text-sm font-bold text-amber-700">{scheduledTime}</p>
          </div>
          <p className="text-xs text-slate-400 max-w-xs">
            Please come back at the scheduled time. The link will become active then.
          </p>
        </>
      ) : ( */}
        <p className="text-sm text-slate-500 max-w-xs">
          {message ?? "This interview hasn't started yet. Please come back at the scheduled time."}
        </p>
      {/* )} */}
    </div>
  )
}
export function ThankYouScreen() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-200 mb-6">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Interview Submitted!</h1>
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
        Your responses have been recorded. The hiring team will review your submission and get back to you soon.
      </p>
      <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        You may now close this window
      </div>
    </div>
  )
}

export function CancelledScreen() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center shadow-xl shadow-rose-200 mb-6">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Interview Cancelled</h1>
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
        Your interview has been cancelled. If this was a mistake, please contact the hiring team to reschedule.
      </p>
      <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        You may now close this window
      </div>
    </div>
  )
}

export function ResumeScreen({ onResume, loading }: { onResume: () => void; loading: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-6 animate-in fade-in duration-300">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center mb-5">
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-slate-800 mb-2">Interview In Progress</h2>
      <p className="text-sm text-slate-500 max-w-xs mb-6 leading-relaxed">
        Your interview session is already active. Click below to pick up right where you left off.
      </p>
      <button
        onClick={onResume}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold shadow-lg shadow-blue-200 hover:from-blue-700 hover:to-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
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
  )
}