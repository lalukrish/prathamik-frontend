"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
  getQuestionsByQBankId,
  updateQuestion,
  deleteQuestion,
  addQuestion,
} from "@/shared/question-bank"
import { ModalForm } from "../../../../../components/ui/modal/modalForm"
import Alert from "@/components/ui/alert/Alert"
import {
  ApiQuestion, QuestionBank, QuestionForm,
  FormErrors, EMPTY_FORM, validateForm, buildPayload,
} from "@/components/question-bank/types"
import { QuestionCard }       from "@/components/question-bank/Questioncard"
import { QuestionFormFields } from "@/components/question-bank/Questionformfields"
import { MultiQuestionPanel } from "@/components/question-bank/Multiquestionpanel"

export default function QuestionBankPage() {
  const params     = useParams()
  const qstnBankid = params?.questions as string

  const [bank,         setBank]         = useState<QuestionBank | null>(null)
  const [questions,    setQuestions]    = useState<ApiQuestion[]>([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState<string | null>(null)

  const [addOpen,      setAddOpen]      = useState(false)
  const [addEntries,   setAddEntries]   = useState<QuestionForm[]>([{ ...EMPTY_FORM }])
  const [addErrors,    setAddErrors]    = useState<FormErrors[]>([])
  const [isAdding,     setIsAdding]     = useState(false)

  const [editQuestion, setEditQuestion] = useState<ApiQuestion | null>(null)
  const [editForm,     setEditForm]     = useState<QuestionForm | null>(null)
  const [editErrors,   setEditErrors]   = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [deleteId,     setDeleteId]     = useState<string | null>(null)
  const [isDeleting,   setIsDeleting]   = useState(false)

  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning" | "info"
    title: string
    message: string
  } | null>(null)

const [aiPolling, setAiPolling] = useState(false)



  useEffect(() => {
    if (alert) {
      const t = setTimeout(() => setAlert(null), 6000)
      return () => clearTimeout(t)
    }
  }, [alert])

  useEffect(() => {
    if (!qstnBankid) return
    setLoading(true)
    getQuestionsByQBankId({ qstnBankid })
      .then((res) => {
        setBank(res.data)
        setQuestions((res.data.questions ?? []).map((q: ApiQuestion) => ({ ...q, weight: Number(q.weight) })))
      })
      .catch((err) => setError(err?.message ?? "Failed to load questions."))
      .finally(() => setLoading(false))
  }, [qstnBankid])

  const totalMarks = questions.reduce((sum, q) => sum + Number(q.weight), 0)

  
// Add this effect after your main fetch useEffect

useEffect(() => {
  if (!bank) return
  // If AI mode and no questions yet, start polling
  if (bank.mode === "AI" && questions.length === 0) {
    setAiPolling(true)
    const interval = setInterval(async () => {
      try {
        const res = await getQuestionsByQBankId({ qstnBankid })
        const qs = (res.data.questions ?? []).map((q: ApiQuestion) => ({ ...q, weight: Number(q.weight) }))
        if (qs.length > 0) {
          setQuestions(qs)
          setAiPolling(false)
          clearInterval(interval)
        }
      } catch { /* keep polling */ }
    }, 3000) // poll every 3s
    return () => clearInterval(interval)
  } else {
    setAiPolling(false)
  }
}, [bank, questions.length, qstnBankid])

const openAdd = () => {
  setAddEntries([{ ...EMPTY_FORM }])
  setAddErrors([])
  setAddOpen(true)
}

const handleAddSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  const errorList = addEntries.map(entry =>
    entry.question.trim() ? validateForm(entry) : {}
  )

  if (errorList.some(e => Object.keys(e).length)) {
    setAddErrors(errorList)
    return
  }

  setAddErrors([])

  const filled = addEntries.filter(f => f.question.trim())
  if (!filled.length) return

  setIsAdding(true)
  try {
    await addQuestion(qstnBankid, { questions: filled.map(buildPayload) })
    const res = await getQuestionsByQBankId({ qstnBankid })
    setQuestions((res.data.questions ?? []).map((q: ApiQuestion) => ({ ...q, weight: Number(q.weight) })))
    setAlert({ variant: "success", title: "Success", message: "Question created successfully" })
    setAddOpen(false)
    setAddEntries([{ ...EMPTY_FORM }])
  } catch {
    setAlert({ variant: "error", title: "Failed", message: "Something went wrong" })
  } finally {
    setIsAdding(false)
  }
}

  // ── Edit ──────────────────────────────────────────────────────────────────
  const openEdit = (q: ApiQuestion) => {
    setEditErrors({})
    setEditQuestion(q)
    setEditForm({
      question:         q.question,
      type:             q.type,
      difficulty:       q.difficulty,
      weight:           Number(q.weight),
      timeLimitSeconds: q.timeLimitSeconds ?? 60,
      skillTags:        [...(q.skillTags ?? [])],
      options:          [...(q.options ?? [])],
      audioUrl: q.audioUrl ?? "",            // ✅
    })
  }

  const closeEdit = () => { setEditQuestion(null); setEditForm(null); setEditErrors({}) }

  const setEditField = <K extends keyof QuestionForm>(key: K, value: QuestionForm[K]) => {
    setEditForm(prev => prev ? { ...prev, [key]: value } : prev)
    setEditErrors(prev => { const e = { ...prev }; delete e[key]; return e })
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editQuestion || !editForm) return
    const errors = validateForm(editForm)
    if (Object.keys(errors).length) { setEditErrors(errors); return }
    setEditErrors({})
    setIsSubmitting(true)
    try {
      const payload = buildPayload(editForm)
      await updateQuestion(qstnBankid, editQuestion.id, payload)
      setQuestions(prev => prev.map(q =>
        q.id === editQuestion.id
          ? { ...q, ...payload, weight: Number((payload as any).weight ?? q.weight), options: "options" in payload ? (payload as any).options : q.options, audioUrl: "audioUrl" in payload ? (payload as any).audioUrl : q.audioUrl }
          : q
      ))
      setAlert({ variant: "success", title: "Success", message: "Question updated successfully" })
      closeEdit()
    } catch {
      setAlert({ variant: "error", title: "Failed", message: "Something went wrong" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await deleteQuestion(qstnBankid, deleteId)
      setQuestions(prev => prev.filter(q => q.id !== deleteId))
      setDeleteId(null)
    } catch {
      setAlert({ variant: "error", title: "Failed", message: "Something went wrong" })
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Loading questions…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center max-w-sm shadow-sm">
          <p className="font-semibold text-slate-800 mb-1">Something went wrong</p>
          <p className="text-sm text-slate-500">{error}</p>
        </div>
      </div>
    )
  }

  const filledEntries = addEntries.filter(e => e.question.trim()).length




  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">


      {/* Header */}
      <div className="max-w-4xl mx-auto mb-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              {bank?.title ?? "Question Bank"}
            </h1>
            {bank?.description && <p className="text-slate-500 text-sm mt-0.5">{bank.description}</p>}
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {questions.length} question{questions.length !== 1 ? "s" : ""}
              </span>
              <span className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-0.5">
                Total: {totalMarks} marks
              </span>
            </div>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Question
          </button>
        </div>
      </div>

      {/* Question list */}
      <div className="max-w-4xl mx-auto space-y-3">

    <>{aiPolling ? (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-purple-200">
      {/* Orbital rings */}
      <div className="relative w-24 h-24 mb-7">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 border-r-purple-500 animate-[spin_1.2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
        {/* Middle ring */}
        <div className="absolute inset-[10px] rounded-full border-2 border-transparent border-t-purple-400 border-l-purple-400 animate-[spin_1.8s_cubic-bezier(0.4,0,0.6,1)_reverse_infinite]" />
        {/* Inner ring */}
        <div className="absolute inset-[20px] rounded-full border-2 border-transparent border-b-purple-300 border-r-purple-300 animate-[spin_1s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
        {/* Core */}
        <div className="absolute inset-[32px] rounded-full bg-purple-50 flex items-center justify-center">
          <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
      </div>

      <p className="text-base font-semibold text-slate-800 mb-1.5">AI is generating your questions</p>
      <p className="text-sm text-slate-400 text-center max-w-xs leading-relaxed mb-5">
        Sit tight — your question bank is being built. This usually takes 10–30 seconds.
      </p>

      {/* Bouncing dots */}
      <div className="flex items-center gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-purple-400"
            style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  ) : (
    <>
        {questions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={idx}
            onEdit={openEdit}
            onDelete={setDeleteId}
          />
        ))}
        {questions.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-semibold text-slate-600">No questions found</p>
            <p className="text-sm text-slate-400 mt-1">Click "Add Question" to get started.</p>
          </div>
        )}
        </>
  )}
  </>
  
      </div>

      {/* Add Modal */}
      <ModalForm
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAddSubmit}
        title={`Add Question${addEntries.length > 1 ? ` (${filledEntries}/${addEntries.length} filled)` : ""}`}
        submitLabel={addEntries.length > 1 ? `Add ${filledEntries} Question${filledEntries !== 1 ? "s" : ""}` : "Add Question"}
        isSubmitting={isAdding}
        className="max-w-2xl"
      >
        <MultiQuestionPanel
          entries={addEntries}
          onUpdate={(idx, form) => setAddEntries(prev => prev.map((e, i) => i === idx ? form : e))}
          onRemove={(idx) => setAddEntries(prev => prev.filter((_, i) => i !== idx))}
          onAdd={() => setAddEntries(prev => [...prev, { ...EMPTY_FORM }])}
          errors={addErrors}
        />
      </ModalForm>

      {/* Edit Modal */}
      {editForm && editQuestion && (
        <ModalForm
          isOpen={!!editQuestion}
          onClose={closeEdit}
          onSubmit={handleEditSubmit}
          title="Edit Question"
          submitLabel="Save Changes"
          isSubmitting={isSubmitting}
          className="max-w-2xl"
        >
          <div className="col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <QuestionFormFields form={editForm} setField={setEditField} errors={editErrors} />
          </div>
        </ModalForm>
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => { if (!isDeleting) setDeleteId(null) }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0l-1 14a2 2 0 01-2 2H9a2 2 0 01-2-2L6 6" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Delete Question?</h2>
            <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} disabled={isDeleting} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-xl text-sm transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={isDeleting} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-xl text-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                {isDeleting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert */}
      {alert && (
        <div className="fixed left-1/2 top-20 z-[9999] w-full max-w-sm -translate-x-1/2">
          <Alert variant={alert.variant} title={alert.title} message={alert.message} />
        </div>
      )}
    </div>
  )
}