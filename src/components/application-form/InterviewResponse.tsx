
'use client'
import { useEffect, useRef, useState } from 'react'
import type { Interview } from '../application-form/InterviewResponse/types'
import { InterviewAccordion } from '../application-form/InterviewResponse/InterviewAccordion'
import { getCandidateInterviewHistory } from '@/shared/candidates'

export default function InterviewResponseTab({ applicationId }: { applicationId?: string }) {
  const hasFetched = useRef(false)
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(false)

  useEffect(() => {
    if (!applicationId || hasFetched.current) return
    hasFetched.current = true
    setInterviews([])
    setError(false)

    const load = async () => {
      try {
        setLoading(true)
      const res = await getCandidateInterviewHistory(
        applicationId
      );
        const raw = res.data ?? res ?? []
        setInterviews(Array.isArray(raw) ? raw : [])
      } catch (err) {
        console.error('Failed to fetch interview history:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [applicationId])

  if (!applicationId)
    return <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-sm text-slate-400">No candidate selected.</div>

  if (loading)
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Loading interview history…</p>
      </div>
    )

  if (error)
    return <div className="bg-white rounded-2xl border border-red-100 p-10 text-center text-sm text-rose-500">Failed to load. Please try again.</div>

  if (!interviews.length)
    return <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-sm text-slate-400">No interview responses available yet.</div>

  return (
    <div className="space-y-3">
      {interviews.map((interview) => (
        <InterviewAccordion key={interview.id} interview={interview} />
      ))}
    </div>
  )
}