'use client'
import React, { useEffect, useRef, useState } from "react";
import type { Scoring } from "../application-form/applican-profile/types";
import { AiReportModal } from "../application-form/applican-profile/AiReportModal";
import type { ModalType } from "./ApplicantProfileView";
import { getCandidateParsedData, updateCandidateNotes } from "@/shared/candidates";
import Image from "next/image";

interface ParsedProfileData {
  scoring: Scoring;
  aiSummary: string;
  matchedSkills: string[];
  missingSkills: string[];
}

interface ApplicantProfileTabProps {
  applicationId: string;
  notes: string;
  onNotesChange: (val: string) => void;
  onModalOpen: (m: ModalType) => void;
  onModalClose: () => void;
  modal: ModalType;
  candidateId: string;   

}

export function ApplicantProfileTab({
  applicationId,
  candidateId,
  notes,
  onNotesChange,
  onModalOpen,
  onModalClose,
  modal,
}: ApplicantProfileTabProps) {


  const hasFetched = useRef(false);

  const [profileData, setProfileData] = useState<ParsedProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!applicationId || hasFetched.current) return;
    hasFetched.current = true;
    async function fetchParsedData() {
      try {
        setLoading(true);
        const data = await getCandidateParsedData(applicationId);
        setProfileData({
          scoring: data.data.parsedData.scoring,
          aiSummary: data.data.aiSummary,
          matchedSkills: data.data.matchedSkills,
          missingSkills: data.data.missingSkills,
        });
      } catch (err) {
        console.error(err);
        setError("Could not load profile analytics.");
      } finally {
        setLoading(false);
      }
    }

    if (applicationId) {
      fetchParsedData();
    }
  }, [applicationId]);


  const handleSaveNote = async () => {
    setSaving(true)
    setSaveError(null)
    setSaved(false)
    try {
      await updateCandidateNotes(candidateId, notes)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setSaveError("Failed to save notes")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-2xl  border border-gray-100 p-5 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-3" />
          <div className="h-3 bg-gray-100 rounded w-full mb-2" />
          <div className="h-3 bg-gray-100 rounded w-5/6 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-4/6" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-100 rounded-2xl h-40 animate-pulse" />
          <div className="bg-gray-100 rounded-2xl h-40 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="bg-white rounded-2xl  border border-gray-100 p-6 flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-medium text-gray-500">{error ?? "No profile data available"}</p>
      </div>
    );
  }

  const { scoring, aiSummary, matchedSkills, missingSkills } = profileData;
  return (
    <div className="flex flex-col gap-4">
    <div className="relative bg-white rounded-2xl border border-gray-100 p-5 overflow-hidden">
  <div className="absolute top-3 left-[-26px] -rotate-52 bg-blue-600 text-white text-[10px] font-semibold px-8 py-1">
    AI
  </div>
<div className="px-6">
  <div className="flex items-center gap-2 mb-3">
    <span className="font-semibold text-gray-700">Profile Summary</span>
  </div>

  <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
    {aiSummary}
  </p>

  <button
    onClick={() => onModalOpen("summary")}
    className="mt-2 text-xs text-blue-600 hover:underline font-medium"
  >
    Read more →
  </button>
  </div>
  </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-linear-to-br from-[#3F81EA] to-[#015FF8] rounded-2xl  p-5 text-white relative overflow-hidden flex flex-col">
      <div className="pt-10 pl-4">
      <p className="font-bold text-lg mb-0.5">Ai Analytics</p>  
      </div>
      <div>

   <div className="absolute bottom-10 left-10 z-10">
   <p className="text-blue-200 text-lg mb-3 max-w-60 xl:w-16 2xl:w-48">
    Generate Candidate Profile with AI
   </p>

   <button
    onClick={() => onModalOpen("ai")}
    className="flex items-center gap-2 bg-white/10 hover:bg-white/30 text-white text-md font-normal px-4 py-2 rounded-lg"
  >
    Generate ✦
   </button>
   </div>
  </div>
 <div className="">
  <Image
    src="/images/shape/image-new.png"
    alt="test"
    width={280}
    height={220}
    className="absolute bottom-0 right-0 object-contain translate-x-10 translate-y-4"
  />
  </div>
</div>

        <div className="bg-white rounded-2xl  border border-gray-100 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-gray-800">Notes</span>
            <button
              onClick={() => onModalOpen("notes")}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Expand →
            </button>
          </div>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Add notes about this candidate…"
            className="flex-1 min-h-[200px] resize-none text-sm text-gray-600 placeholder-gray-300 border border-gray-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
          />
          {saveError && <p className="mt-1 text-xs text-red-500">{saveError}</p>}
          <button
            onClick={handleSaveNote}
            disabled={saving}
            className="mt-3 self-end bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
          >
            {saving ? "Saving…" : saved ? "Saved ✓" : "Save Note"}
          </button>
        </div>
      </div>

      {/* AI Modal — lives here since scoring only exists after fetch */}
      {modal === "ai" && (
        <AiReportModal
          scoring={scoring}
          aiSummary={aiSummary}
          matchedSkills={matchedSkills}
          missingSkills={missingSkills}
          onClose={onModalClose}
        />
      )}

      {modal === "summary" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

          <div className="bg-white rounded-2xl  w-full max-w-lg max-h-[85vh] flex flex-col relative">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-800">Full Profile Summary</h2>
              <button
                onClick={onModalClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 text-xl font-bold transition"
              >×</button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-5 text-sm text-gray-600 leading-relaxed">
              <p>{aiSummary}</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .line-clamp-4 { display:-webkit-box; -webkit-line-clamp:4; -webkit-box-orient:vertical; overflow:hidden; }
      `}</style>
    </div>
  );
}