
// 'use client'

// import { useEffect, useRef, useState } from "react"

// const STORAGE_KEY_PREFIX = "interview_timer_"

// /**
//  * Countdown timer that survives page refreshes.
//  *
//  * Strategy: stores the UTC timestamp when the question was first shown
//  * in localStorage. On every render (including after a refresh) we compute
//  * remaining = timeLimitSeconds - (now - startedAt). This means the timer
//  * always reflects real elapsed wall-clock time, not just React state ticks.
//  *
//  * @param questionId        Used as part of the storage key
//  * @param token             Interview token — namespace for storage key
//  * @param timeLimitSeconds  How long the candidate has for this question
//  * @param onExpire          Called once when remaining hits 0
//  *
//  * @returns { remaining, timeTaken }
//  *   remaining  — seconds left (0 when expired)
//  *   timeTaken  — seconds elapsed since question was shown (for answer payload)
//  */
// export function useQuestionTimer(
//   questionId: string,
//   token: string,
//   timeLimitSeconds: number,
//   onExpire: () => void,
// ) {
//   const storageKey = `${STORAGE_KEY_PREFIX}${token}_${questionId}`

//   // Initialise startedAt: reuse useQuestionTimer value on refresh, otherwise set now
//   const getOrCreateStartedAt = (): number => {
//     try {
//       const stored = localStorage.getItem(storageKey)
//       if (stored) return parseInt(stored, 10)
//     } catch {}
//     const now = Date.now()
//     try { localStorage.setItem(storageKey, String(now)) } catch {}
//     return now
//   }

//   const startedAtRef = useRef<number>(getOrCreateStartedAt())
//   const expiredRef   = useRef(false)

//   const calcRemaining = () =>
//     Math.max(0, timeLimitSeconds - Math.floor((Date.now() - startedAtRef.current) / 1000))

//   const [remaining, setRemaining] = useState<number>(calcRemaining)

//   // Reset when question changes
//   useEffect(() => {
//     expiredRef.current = false
//     // Clear old key and create a fresh one for the new question
//     try { localStorage.removeItem(storageKey) } catch {}
//     const now = Date.now()
//     startedAtRef.current = now
//     try { localStorage.setItem(storageKey, String(now)) } catch {}
//     setRemaining(timeLimitSeconds)
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [questionId])

//   useEffect(() => {
//     if (remaining <= 0) {
//       if (!expiredRef.current) {
//         expiredRef.current = true
//         onExpire()
//       }
//       return
//     }
//     const t = setTimeout(() => setRemaining(calcRemaining()), 1000)
//     return () => clearTimeout(t)
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [remaining])

//   const timeTaken = Math.floor((Date.now() - startedAtRef.current) / 1000)

//   /** Call just before submitting to get final elapsed seconds */
//   const getTimeTaken = () =>
//     Math.floor((Date.now() - startedAtRef.current) / 1000)

//   /** Clear storage for this question (call after answer submitted) */
//   const clearStorage = () => {
//     try { localStorage.removeItem(storageKey) } catch {}
//   }

//   return { remaining, getTimeTaken, clearStorage }
// }


'use client'

import { useState, useEffect, useRef, useCallback } from "react"

const STORAGE_PREFIX = "interview_timer_"

/**
 * Persists the wall-clock start time of a question so that a page refresh
 * resumes the timer exactly where it left off.
 *
 * Strategy:
 *   - On first mount for a given questionId, write `startedAt = Date.now()` to
 *     localStorage (only if no entry exists yet).
 *   - On every mount (including post-refresh), read `startedAt` and compute:
 *       elapsed   = floor((now - startedAt) / 1000)
 *       remaining = max(0, timeLimitSeconds - elapsed)
 *   - A setInterval ticks every second and recalculates from `startedAt` each
 *     time (avoids drift from tab sleep / throttled timers).
 *   - `clearStorage()` removes the key so the next question starts fresh.
 *   - `getTimeTaken()` returns seconds elapsed since startedAt (capped at limit).
 *
 * @param questionId       - unique ID; used as localStorage key discriminator
 * @param token            - interview token; combined with questionId for key
 * @param timeLimitSeconds - max seconds allowed for this question
 * @param onExpire         - called once when remaining hits 0
 */
export function useQuestionTimer(
  questionId: string,
  token: string,
  timeLimitSeconds: number,
  onExpire: () => void,
) {
  const storageKey   = `${STORAGE_PREFIX}${token}_${questionId}`
  const onExpireRef  = useRef(onExpire)
  onExpireRef.current = onExpire          // stable ref — never stale in the interval

  // ── Seed startedAt ─────────────────────────────────────────────────────────
  // Read or create the wall-clock start time exactly once.
  const getOrCreateStartedAt = useCallback((): number => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = parseInt(stored, 10)
        if (!isNaN(parsed)) return parsed
      }
    } catch {}

    // First time for this question — record now
    const now = Date.now()
    try { localStorage.setItem(storageKey, String(now)) } catch {}
    return now
  }, [storageKey])

  // ── Helpers ────────────────────────────────────────────────────────────────
  const calcRemaining = (startedAt: number): number =>
    Math.max(0, timeLimitSeconds - Math.floor((Date.now() - startedAt) / 1000))

  // ── State ──────────────────────────────────────────────────────────────────
  // Initialise synchronously so the first render already shows the correct time.
  const startedAtRef = useRef<number>(0)

  const [remaining, setRemaining] = useState<number>(() => {
    const startedAt        = getOrCreateStartedAt()
    startedAtRef.current   = startedAt
    return calcRemaining(startedAt)
  })

  const expiredFired = useRef(false)

  // ── Tick ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Re-read (or create) startedAt; may differ from the useState initialiser if
    // StrictMode double-invokes or the component remounts.
    const startedAt      = getOrCreateStartedAt()
    startedAtRef.current = startedAt

    // Sync remaining immediately on mount (covers the refresh case)
    const initial = calcRemaining(startedAt)
    setRemaining(initial)
    if (initial <= 0 && !expiredFired.current) {
      expiredFired.current = true
      onExpireRef.current()
    }

    const id = setInterval(() => {
      const left = calcRemaining(startedAt)
      setRemaining(left)

      if (left <= 0 && !expiredFired.current) {
        expiredFired.current = true
        onExpireRef.current()
        clearInterval(id)
      }
    }, 1_000)

    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])   // only re-run when question changes (storageKey encodes both token + questionId)

  // ── Public API ─────────────────────────────────────────────────────────────

  /** Seconds actually spent on this question (capped at the limit). */
  const getTimeTaken = useCallback((): number => {
    const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000)
    return Math.min(elapsed, timeLimitSeconds)
  }, [timeLimitSeconds])

  /** Remove the persisted start time. Call just before submitting the answer. */
  const clearStorage = useCallback(() => {
    try { localStorage.removeItem(storageKey) } catch {}
  }, [storageKey])

  return { remaining, getTimeTaken, clearStorage }
}