'use client'
import React from "react"
import type { Scoring } from "./types"


export function AiReportModal({ scoring, aiSummary, matchedSkills, missingSkills, onClose }: {
  scoring: Scoring; aiSummary: string; matchedSkills: string[]; missingSkills: string[]; onClose: () => void
}) {
  const scores = [
    { label: "Overall",       val: scoring.overallScore,      color: "#465FFF", bg: "bg-blue-50"    },
    { label: "Experience",    val: scoring.experienceScore,    color: "#F59E0B", bg: "bg-amber-50"   },
    { label: "Skill Match",   val: scoring.skillMatchScore,    color: "#6D28D9", bg: "bg-violet-50"  },
    { label: "Communication", val: scoring.communicationScore, color: "#10B981", bg: "bg-emerald-50" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-base">AI Analytics Report</span>
            <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">AI</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white text-lg font-bold transition">×</button>
        </div>
        <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-5">
          <div className="grid grid-cols-4 gap-3">
            {scores.map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl p-3 flex flex-col items-center`}>
                <span className="text-2xl font-black" style={{ color: s.color }}>{s.val}</span>
                <span className="text-[10px] text-gray-500 font-medium text-center mt-0.5">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">AI Summary</p>
            <p className="text-sm text-gray-700 leading-relaxed">{aiSummary}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm font-bold text-emerald-700">Strengths</span>
              </div>
              <ul className="flex flex-col gap-2">
                {scoring.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2 text-xs text-emerald-800"><span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />{s}</li>
                ))}
              </ul>
            </div>
            <div className="bg-rose-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
                <span className="text-sm font-bold text-rose-700">Weaknesses</span>
              </div>
              <ul className="flex flex-col gap-2">
                {scoring.weaknesses.map((w, i) => (
                  <li key={i} className="flex gap-2 text-xs text-rose-800"><span className="shrink-0 w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5" />{w}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">✅ Matched Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {matchedSkills.map((sk) => (
                  <span key={sk} className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">{sk}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">❌ Missing Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.map((sk) => (
                  <span key={sk} className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-medium">{sk}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}