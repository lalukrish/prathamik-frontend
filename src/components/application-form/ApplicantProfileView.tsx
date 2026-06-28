'use client'
import React, { useState } from "react"
import dynamic from "next/dynamic"
import type { InterviewFormData } from "@/components/application-form/ScheduleInterviewModal"
import { ScheduleInterviewModal } from "@/components/application-form/ScheduleInterviewModal"
import { NotesModal } from "./notesModal"
import { Modal } from "../ui/modal/index"
import { InterviewHistoryTab } from "./InterviewHistoryTab"
import { ApplicantProfileTab } from "./ApplicantProfileTab"
import InterviewResponseTab from "./InterviewResponse"
import { CandidateLeftPanel } from "../application-form/applican-profile/CandidateLeftPanel"
import { InterviewStatusBar } from "../application-form/applican-profile/InterviewStatusBar"
import { makeChartOptions, MAIN_SCORE_CHARTS } from "../application-form/applican-profile/constants"
import type { ApiResponse, ApplicationStatus, ModalType, InterviewData } from "../application-form/applican-profile/types"
import { User, History, MessageSquare } from "lucide-react";
export type { ApiResponse, ApplicationStatus, ModalType, InterviewData }

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface ApplicantProfileViewProps {
  data: ApiResponse
  status: ApplicationStatus
  statusOpen: boolean
  modal: ModalType
  notes: string
  questionBankOptions: { label: string; value: string }[]
  onStatusToggle: () => void
  onStatusChange: (s: ApplicationStatus) => void
  onModalOpen: (m: ModalType) => void
  onModalClose: () => void
  onNotesChange: (val: string) => void
  onInterviewConfirm: (data: InterviewFormData) => void
  onInterviewClose: () => void
  interviewData?: InterviewData[] | null
  onReschedule: () => void
  onCancelInterview: () => void
  isReschedule?: boolean
  isSchedulingInterview: boolean
  onRefetch?: () => void  
}

export function ApplicantProfileView({
  data, status, statusOpen, modal, notes, questionBankOptions,
  onStatusToggle, onStatusChange, onModalOpen, onModalClose,
  onNotesChange, onInterviewConfirm, onInterviewClose,
  interviewData, onReschedule, onCancelInterview, isReschedule, isSchedulingInterview,
  onRefetch
}: ApplicantProfileViewProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "history" | "response">("profile")

  const { candidate } = data
  const workExp   = candidate.parsedData?.workExperience ?? []
  const education = candidate.parsedData?.education      ?? []
  const projects  = candidate.parsedData?.projects       ?? []
  const interview = interviewData?.[0]

  return (
    <div className="min-h-screen bg-gray-50  border-gray-25 dark:bg-gray-900 dark:border-white-25 p-6">

      <InterviewStatusBar
        status={status}
        statusOpen={statusOpen}
        interview={interview}
        isSchedulingInterview={isSchedulingInterview}
        onStatusToggle={onStatusToggle}
        onStatusChange={onStatusChange}
        onCancelInterview={onCancelInterview}
        onReschedule={onReschedule}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4">
      <div className="h-fit">
      <CandidateLeftPanel candidate={candidate} onModalOpen={onModalOpen} />
      </div>
        <div className="flex flex-col gap-4 ">
          {/* Score charts */}
          {/* <div className="bg-white  rounded-2xl  border border-gray-100 dark:border-white-100 px-6 py-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 ">
              {MAIN_SCORE_CHARTS.map((sc) => {
                const value = data?.scores?.[sc.key] ?? 0
                const pct = (value / 10) * 100
                return (
                  <div key={sc.key} className="flex flex-col items-center">
                    <div className="w-full max-h-[150px]">
                      <ReactApexChart options={makeChartOptions(sc.color)} series={[pct]} type="radialBar" height={150} />
                    </div>
                    <p className="text-xs text-gray-500 font-medium -mt-3 text-center">{sc.label}</p>
                  </div>
                )
              })}
            </div>
          </div> */}
          <div className="bg-white rounded-2xl border border-gray-100 dark:border-white-100 p-6">
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {MAIN_SCORE_CHARTS.map((sc) => {
      const value = data?.scores?.[sc.key] ?? 0;

      return (
        <div
          key={sc.key}
          className="rounded-xl border border-gray-100 p-5 gap-y-4 text-center"
        >
          
          <p className="mt-2 text-sm text-gray-600">
            {sc.label}
          </p>
          <p className="text-lg font-bold text-gray-900">
            {value}/10
          </p>
        </div>
      );
    })}
  </div>
</div>
          {/* Tab bar */}
          <span className=" border border-gray-100 bg-white gap-4 p-4  rounded-2xl" >
       <div className="bg-white rounded-2xl border border-gray-100 px-6 py-1">
  <div className="flex gap-1 justify-around">
    {[
      { key: "profile", label: "Profile", icon: User },
      { key: "history", label: "Interview History", icon: History },
      { key: "response", label: "Interview Response", icon: MessageSquare },
    ].map((tab) => {
      const Icon = tab.icon;

      return (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key as typeof activeTab)}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === tab.key
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Icon size={16} />
          <span>{tab.label}</span>
        </button>
      );
    })}
  </div>
</div>
          <div className="mt-3">
          <div className={activeTab === "profile" ? "" : "hidden"} >
            <ApplicantProfileTab candidateId={data.candidate.id} applicationId={data.id} notes={notes} onNotesChange={onNotesChange} onModalOpen={onModalOpen} onModalClose={onModalClose} modal={modal} />
          </div>
          <div className={activeTab === "history" ? "" : "hidden"}>
            <InterviewHistoryTab applicationId={data.id} />
          </div>
          <div className={activeTab === "response" ? "" : "hidden"}>
            <InterviewResponseTab applicationId={data.id} />
          </div>
          </div>
         </span>
        </div>
      </div>

      {/* {modal === "experience" && (workExp.length > 0 || education.length > 0 || projects.length > 0) && ( */}
      {modal === "experience" && (workExp.length > 0 || education.length > 0 || projects.length > 0) && (
      <Modal
      isOpen={true}
      onClose={onModalClose}
      title="Experience, Education & Projects"
      className="max-w-3xl max-h-[85vh] overflow-y-auto"
      >          
        <div className="flex flex-col gap-6">
            {workExp.length > 0 && (
              <div>
                <p className="font-bold text-gray-700 mb-3 text-sm">Work Experience</p>
                {workExp.map((ex, i) => (
                  <div key={i} className="border-l-2 border-blue-200 pl-4 mb-4">
                    <p className="font-semibold text-gray-800">{ex.role}</p>
                    <p className="text-gray-400 text-xs">{ex.company} · {ex.location} · {ex.startDate} – {ex.endDate}</p>
                    <ul className="mt-1.5 flex flex-col gap-1">
                      {(ex.responsibilities ?? []).map((r, j) => (
                        <li key={j} className="text-xs text-gray-600 flex gap-2"><span className="text-blue-400 mt-0.5">•</span>{r}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            {education.length > 0 && (
              <div>
                <p className="font-bold text-gray-700 mb-3 text-sm">Education</p>
                {education.map((ed, i) => (
                  <div key={i} className="border-l-2 border-purple-200 pl-4 mb-3">
                    <p className="font-semibold text-gray-800">{ed.degree}</p>
                    <p className="text-gray-400 text-xs">{ed.institution} · {ed.startDate} – {ed.endDate}</p>
                  </div>
                ))}
              </div>
            )}
            {projects.length > 0 && (
              <div>
                <p className="font-bold text-gray-700 mb-3 text-sm">Projects</p>
                {projects.map((pr, i) => (
                  <div key={i} className="border-l-2 border-teal-200 pl-4 mb-3">
                    <p className="font-semibold text-gray-800">{pr.name}</p>
                    <p className="text-gray-400 text-xs mb-1">{pr.startDate} – {pr.endDate}</p>
                    <p className="text-gray-600 text-xs">{pr.description}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {(pr.technologies ?? []).map((t) => (
                        <span key={t} className="text-[10px] bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      {modal === "notes" && (
        <NotesModal candidateId={data.candidate.id} notes={notes} onNotesChange={onNotesChange} onClose={onModalClose} />
      )}

      {modal === "interview" && (
        <ScheduleInterviewModal onConfirm={onInterviewConfirm} onClose={onInterviewClose} questionBankOptions={questionBankOptions} isReschedule={isReschedule} />
      )}

      <style>{`.line-clamp-4 { display:-webkit-box; -webkit-line-clamp:4; -webkit-box-orient:vertical; overflow:hidden; }`}</style>
    </div>
  )
}