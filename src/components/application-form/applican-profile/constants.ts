import type { ApexOptions } from "apexcharts"
import type { ApplicationStatus, InterviewData } from "./types"

export function makeChartOptions(color: string): ApexOptions {
  return {
    colors: [color],
    chart: { fontFamily: "Outfit, sans-serif", type: "radialBar", sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: { size: "75%" },
        track: { background: "#E4E7EC", strokeWidth: "100%", margin: 5 },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "22px",
            fontWeight: "700",
            offsetY: -28,
            color: "#1D2939",
            formatter: (val: number) => String(Math.round(val / 10)),
          },
        },
      },
    },
    fill: { type: "solid", colors: [color] },
    stroke: { lineCap: "round" },
  }
}

export const MAIN_SCORE_CHARTS = [
  { label: "Resume Score",      color: "#F59E0B", key: "resumeScore"       },
  { label: "Experience Score",  color: "#10B981", key: "experienceScore"   },
  { label: "Skill Match Score", color: "#EF4444", key: "skillMatchScore"   },
  // { label: "Communication",     color: "#465FFF", key: "communicationScore"},
] as const

export const SCORE_CHARTS = [
  { label: "Overall Score",     color: "#465FFF", key: "overallScore"      },
  { label: "Experience Score",  color: "#F59E0B", key: "experienceScore"   },
  { label: "Skill Match Score", color: "#6D28D9", key: "skillMatchScore"   },
  { label: "Communication",     color: "#10B981", key: "communicationScore"},
] as const

export const SKILL_COLORS = [
  "bg-blue-50 text-blue-800 border border-blue-200",
  "bg-blue-50 text-blue-800 border border-blue-200",
  "bg-blue-50 text-blue-800 border border-blue-200",
  "bg-blue-50 text-blue-800 border border-blue-200",
  "bg-blue-50 text-blue-800 border border-blue-200",
  "bg-blue-50 text-blue-800 border border-blue-200",
  "bg-blue-50 text-blue-800 border border-blue-200",
]

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  APPLIED:     "bg-blue-100 text-blue-700 border-blue-300",
  SHORTLISTED: "bg-green-100 text-green-700 border-green-300",
  REJECTED:    "bg-red-100 text-red-700 border-red-300",
  INTERVIEW:   "bg-yellow-100 text-yellow-700 border-yellow-300",
  SELECTED:    "bg-indigo-100 text-indigo-700 border-indigo-300",
}

export const STATUS_OPTIONS: ApplicationStatus[] = [
  "APPLIED", "SHORTLISTED", "REJECTED", "INTERVIEW", "SELECTED",
]

export const INTERVIEW_STATUS_CONFIG: Record<
  NonNullable<InterviewData["status"]>,
  { label: string; color: string }
> = {
  PENDING:     { label: "Pending",     color: "bg-amber-100 text-amber-700 border-amber-300"       },
  IN_PROGRESS: { label: "In Progress", color: "bg-blue-100 text-blue-700 border-blue-300"          },
  COMPLETED:   { label: "Completed",   color: "bg-green-100 text-emerald-700 border-emerald-300"   },
  CANCELLED:   { label: "Cancelled",   color: "bg-red-100 text-red-700 border-red-300"             },
  SCHEDULED:   { label: "Scheduled",   color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  EXPIRED:     { label: "Expired",     color: "bg-violet-100 text-violet-700 border-violet-300"    },
}