'use client'
import type { SecurityEvent } from './types'
import { SEVERITY_STYLES, fmtEventType } from './constants'

export function SecuritySection({ events }: { events: SecurityEvent[] }) {
  if (!events.length) return null

  const grouped = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.type] = (acc[e.type] ?? 0) + 1
    return acc
  }, {})

  const highCount = events.filter(e => e.severity === 'HIGH').length

  return (
    <div className="px-6 py-5 border-t border-gray-100 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Security Events</p>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {events.length} total
          </span>
          {highCount > 0 && (
            <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
              {highCount} high severity
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {Object.entries(grouped).map(([type, count]) => {
          const sev = events.find(e => e.type === type)?.severity ?? 'LOW'
          return (
            <span key={type} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${SEVERITY_STYLES[sev]}`}>
              {fmtEventType(type)} × {count}
            </span>
          )
        })}
      </div>

      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {events.map((e) => (
          <div key={e.id} className="flex items-center gap-3 text-xs">
            <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${SEVERITY_STYLES[e.severity]}`}>
              {e.severity}
            </span>
            <span className="flex-1 text-slate-600 font-medium">{fmtEventType(e.type)}</span>
            <span className="text-slate-400 tabular-nums flex-shrink-0">
              {new Date(e.createdAt).toLocaleTimeString(undefined, { timeStyle: 'short' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}