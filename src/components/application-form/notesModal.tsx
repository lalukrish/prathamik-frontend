'use client'
import React, { useState } from "react"
import { Modal } from "../../components/ui/modal"
import { updateCandidateNotes } from "@/shared/candidates"

interface NotesModalProps {
  candidateId: string
  notes: string
  onNotesChange: (val: string) => void
  onClose: () => void
}

export function NotesModal({ candidateId, notes, onNotesChange, onClose }: NotesModalProps) {
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState<string | null>(null)

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await updateCandidateNotes(candidateId, notes);
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  return (
<Modal isOpen={true} onClose={onClose} title="Notes" className="max-w-[600px]">
      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Add notes about this candidate…"
        className="w-[600px] min-h-[200px] resize-none text-sm text-gray-600 placeholder-gray-300 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
      />
      {error && (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      )}
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
      >
        {saving ? "Saving…" : "Save & Close"}
      </button>
    </Modal>
  )
}