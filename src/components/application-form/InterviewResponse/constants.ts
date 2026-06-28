import type { ApexOptions } from 'apexcharts'

export function makeChartOptions(color: string): ApexOptions {
  return {
    colors: [color],
    chart: { fontFamily: 'inherit', type: 'radialBar', sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: { size: '72%' },
        track: { background: '#F1F5F9', strokeWidth: '100%', margin: 4 },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: '18px',
            fontWeight: '700',
            offsetY: -22,
            color: '#1E293B',
            formatter: (val: number) => String(Math.round(val / 10)),
          },
        },
      },
    },
    fill: { type: 'solid', colors: [color] },
    stroke: { lineCap: 'round' },
  }
}

export const SCORE_CHARTS = [
  { label: 'Overall',       color: '#465FFF', key: 'overallScore'       },
  { label: 'Interview',     color: '#F59E0B', key: 'interviewScore'     },
  { label: 'Technical',     color: '#6D28D9', key: 'technicalScore'     },
  { label: 'Communication', color: '#10B981', key: 'communicationScore' },
] as const

export const STATUS_STYLES: Record<string, { pill: string; dot: string }> = {
  COMPLETED:   { pill: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  CANCELLED:   { pill: 'bg-rose-50 text-rose-600 border-rose-200',          dot: 'bg-rose-400'    },
  IN_PROGRESS: { pill: 'bg-blue-50 text-blue-700 border-blue-200',          dot: 'bg-blue-500'    },
  PENDING:     { pill: 'bg-slate-100 text-slate-500 border-slate-200',      dot: 'bg-slate-400'   },
}

export const DIFFICULTY_STYLES: Record<string, string> = {
  EASY:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
  HARD:   'bg-rose-50 text-rose-600 border-rose-200',
}

export const SEVERITY_STYLES: Record<string, string> = {
  LOW:    'bg-slate-100 text-slate-600',
  MEDIUM: 'bg-amber-50 text-amber-700',
  HIGH:   'bg-rose-50 text-rose-600',
}

export const TYPE_LABELS: Record<string, string> = {
  TEXT:            'Text',
  RADIO:           'Single Choice',
  MULTIPLE_SELECT: 'Multi-Select',
}

export const fmtEventType = (t: string) =>
  t.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())

export function fmt(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export function fmtDuration(secs: number) {
  if (secs === 0) return '0s'
  const m = Math.floor(secs / 60)
  const s = secs % 60
  if (m === 0) return `${s}s`
  if (s === 0) return `${m}m`
  return `${m}m ${s}s`
}