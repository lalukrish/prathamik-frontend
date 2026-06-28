'use client'
import type { ApiResponse, ModalType } from "./types"
import { SKILL_COLORS } from "./constants"


interface Props {
  candidate: ApiResponse["candidate"]
  onModalOpen: (m: ModalType) => void
}



export function CandidateLeftPanel({ candidate, onModalOpen }: Props) {
  const workExp   = candidate.parsedData?.workExperience ?? []
  const education = candidate.parsedData?.education      ?? []

  const profileLocation    = candidate.parsedData?.profile?.location    ?? ""
  const profileCurrentRole = candidate.parsedData?.profile?.currentRole ?? candidate.currentRole ?? ""
  const profileLinkedinUrl = candidate.parsedData?.profile?.linkedinUrl ?? candidate.linkedinUrl ?? ""

  return (
    <div className="bg-white rounded-2xl  border border-gray-100 p-5 flex flex-col gap-5">
      {/* Avatar / name / role */}
      <div>
        <div className="w-full h-36 rounded-xl bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-400 relative overflow-visible mb-14">
          <span className="text-white text-8xl font-black opacity-10 absolute right-4 bottom-1 select-none leading-none">
            {candidate.name[0]}
          </span>
          <div className="absolute left-5 bottom-0 translate-y-[40%] w-20 h-20 rounded-2xl border-4 border-white bg-[#8ecae6] flex items-center justify-center shadow-md z-10">
            <span className="text-white text-4xl font-black select-none">{candidate.name[0]}</span>
          </div>
          <span className="absolute top-3 right-3 bg-green-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>

        <p className="font-bold text-gray-900 text-2xl">{candidate.name}</p>
        <p className="text-sm text-gray-600 mt-0.5">{profileCurrentRole}</p>
        <p className="text-xs text-gray-400 mt-0.5">{profileLocation}</p>

        <div className="flex gap-2 mt-2 flex-wrap text-xs text-gray-500">
          <span className="bg-gray-100 px-2 py-0.5 rounded-full">Exp: {candidate.totalExperience} yrs</span>
          <span className="bg-gray-100 px-2 py-0.5 rounded-full">Notice: {candidate.noticePeriod}d</span>
          {candidate.isOnNoticePeriod && (
            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">On Notice</span>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          <a href={`mailto:${candidate.email}`} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition" title={candidate.email}>
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
          </a>
          <a href={`tel:${candidate.phone}`} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-green-50 text-gray-500 hover:text-green-600 transition" title={candidate.phone}>
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
            </svg>
          </a>
          {profileLinkedinUrl && (
            <a href={profileLinkedinUrl} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-50 text-gray-500 hover:text-blue-700 transition">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* CTC */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Current CTC</p>
          <p className="text-sm font-bold text-gray-700 mt-0.5">₹{(candidate.currentCTC / 100000).toFixed(1)}L</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Expected</p>
          <p className="text-sm font-bold text-gray-700 mt-0.5">₹{(candidate.expectedSalary / 100000).toFixed(1)}L</p>
        </div>
      </div>

      {/* Skills */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {candidate.skills.map((sk, i) => (
            <span key={sk} className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${SKILL_COLORS[i % SKILL_COLORS.length]}`}>
              {sk}
            </span>
          ))}
        </div>
      </div>

      {/* Experience */}
      {workExp.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Experience</p>
          <div className="flex flex-col gap-2.5">
            {workExp.slice(0, 3).map((ex, i) => (
              <div key={i} className="border-l-2 border-blue-200 pl-3">
                <p className="text-xs font-semibold text-gray-700">{ex.role}</p>
                <p className="text-[12px] font-semibold text-gray-700">{ex.company} · {ex.location}</p>
                <p className="text-[11px] text-gray-400">{ex.startDate} – {ex.endDate}</p>
              </div>
            ))}
          </div>
          <button onClick={() => onModalOpen("experience")} className="mt-3 text-xs text-blue-600 hover:underline font-medium">
            More about sections →
          </button>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Education</p>
          {education.map((ed, i) => (
            <div key={i} className="border-l-2 border-purple-200 pl-3">
              <p className="text-xs font-semibold text-gray-700">{ed.degree}</p>
              <p className="text-[11px] text-gray-400">{ed.institution} · {ed.startDate} – {ed.endDate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}