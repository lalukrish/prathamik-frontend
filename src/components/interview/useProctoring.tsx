
'use client'

import { useEffect, useRef, useCallback, useState } from "react"
import api from "@/lib/axios"

// ── Types ────────────────────────────────────────────────────────────────────

export type SecurityEventType =
  | "TAB_SWITCH"
  | "WINDOW_BLUR"
  | "WINDOW_MINIMIZE"
  | "FULLSCREEN_EXIT"
  | "COPY_PASTE"
  | "RIGHT_CLICK"
  | "MULTIPLE_MONITORS"
  | "DEVTOOLS_OPEN"
  | "NETWORK_DISCONNECT"
  | "LONG_INACTIVITY"
  | "MULTIPLE_FACES"
  | "VOICE_MISMATCH"
  | "RAPID_ANSWERING"
  | "SUSPICIOUS_TYPING"

export type ProctoringCounts = Record<SecurityEventType, number>

export type FinalSubmitPayload = {
  proctoringCounts: ProctoringCounts
}

const INITIAL_COUNTS = (): ProctoringCounts => ({
  TAB_SWITCH:        0,
  WINDOW_BLUR:       0,
  WINDOW_MINIMIZE:   0,
  FULLSCREEN_EXIT:   0,
  COPY_PASTE:        0,
  RIGHT_CLICK:       0,
  MULTIPLE_MONITORS: 0,
  DEVTOOLS_OPEN:     0,
  NETWORK_DISCONNECT:0,
  LONG_INACTIVITY:   0,
  MULTIPLE_FACES:    0,
  VOICE_MISMATCH:    0,
  RAPID_ANSWERING:   0,
  SUSPICIOUS_TYPING: 0,
})

// ── Config ───────────────────────────────────────────────────────────────────

const STORAGE_KEY_PREFIX  = "interview_proctoring_"
/** Fire LONG_INACTIVITY after this many ms of no mouse/key/touch activity */
const INACTIVITY_MS       = 60_000
/** Devtools check interval in ms */
const DEVTOOLS_POLL_MS    = 3_000
/** Threshold (px) for devtools size heuristic */
const DEVTOOLS_THRESHOLD  = 160

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Session-level proctoring hook. Mount once in page.tsx — lives across questions.
 *
 * On every security event:
 *   1. Increments the in-memory + localStorage counter
 *   2. POSTs  POST /public/interviews/:token/security-event
 *              { type, metadata: { timestamp } }  — fire-and-forget
 *
 * getTotalsAndClear() — call at final submit; returns counts and wipes storage.
 */
export function useProctoring(token: string,enabled:boolean) {
  const storageKey = `${STORAGE_KEY_PREFIX}${token}`
  const enabledRef   = useRef(enabled)                    // ← add this

const [lastEvent, setLastEvent] = useState<SecurityEventType | null>(null)


  // In-memory running totals — seeded from localStorage on mount
  const counts = useRef<ProctoringCounts>(INITIAL_COUNTS())
  // Keep ref in sync with prop
  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  useEffect(() => {
    if (!token) return
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) counts.current = JSON.parse(stored) as ProctoringCounts
    } catch {}
  }, [storageKey, token])



  // ── Core fire helper ──────────────────────────────────────────────────────

const fireEvent = useCallback(
  (type: SecurityEventType, extra?: Record<string, unknown>) => {
    counts.current[type] = (counts.current[type] ?? 0) + 1
    try {
      localStorage.setItem(storageKey, JSON.stringify(counts.current))
    } catch {}

    if (!token || !enabledRef.current) return  // ← early return before setLastEvent

    setLastEvent(type)  // ← only fires when enabled

    api.post(`/public/interviews/${token}/security-event`, {
      type,
      metadata: { timestamp: new Date().toISOString(), ...extra },
    }).catch(() => {})
  },
  [token, storageKey],
)
  // ── Browser / OS event listeners ──────────────────────────────────────────

  useEffect(() => {
    if (!token) return

    // ── Visibility / tab switch ─────────────────────────────────────────────
    const onVisibilityChange = () => {
      if (document.hidden) fireEvent("TAB_SWITCH")
    }

    // ── Window blur — covers both minimize and alt-tab ──────────────────────
    // We distinguish them: if document was already hidden it's a minimize/switch,
    // otherwise it's a plain focus loss.
    const onWindowBlur = () => {
      if (document.hidden) {
        fireEvent("WINDOW_MINIMIZE")
      } else {
        fireEvent("WINDOW_BLUR")
      }
    }

    // ── Fullscreen exit ─────────────────────────────────────────────────────
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) fireEvent("FULLSCREEN_EXIT")
    }

    // ── Copy / Cut / Paste ──────────────────────────────────────────────────
    const onCopyPaste = (e: ClipboardEvent) =>
      fireEvent("COPY_PASTE", { action: e.type })

    // ── Right-click ─────────────────────────────────────────────────────────
    const onContextMenu = () => fireEvent("RIGHT_CLICK")

    // ── Network disconnect ──────────────────────────────────────────────────
    const onOffline = () => fireEvent("NETWORK_DISCONNECT")

    // ── Multiple monitors (screen width >> window width) ────────────────────
    // Fired once on mount; not a continuous poll — reliable enough for a flag.
  const checkMultiMonitor = async () => {
  let detected = false


  
  // Method 1: Window Management API (Chrome 100+) — most reliable
  if ("getScreenDetails" in window) {
    try {
      const details = await (window as any).getScreenDetails()
        console.log("details",details)
         console.log("Total Screens:", details.screens.length);

      if (details.screens.length > 1) detected = true
      console.log("details",details)
    } catch {}
  }

  // Method 2: screenLeft/screenX outside primary screen bounds
  // If window is on a secondary monitor, screenLeft will be outside 0..screen.width
  if (!detected) {
    const sl = window.screenLeft ?? window.screenX ?? 0
    if (sl < 0 || sl >= window.screen.width) detected = true
  }

  // Method 3: screen dimensions mismatch (works even in fullscreen)
  // screen.width is the primary monitor width; availWidth includes all monitors on some OS
  if (!detected) {
    if (window.screen.availWidth > window.screen.width + 100) detected = true
  }

  if (detected) {
    fireEvent("MULTIPLE_MONITORS", {
      screenWidth:     window.screen.width,
      screenAvailWidth: window.screen.availWidth,
      screenLeft:      window.screenLeft ?? window.screenX,
    })
  }
}

    document.addEventListener("visibilitychange", onVisibilityChange)
    window.addEventListener("blur", onWindowBlur)
    document.addEventListener("fullscreenchange", onFullscreenChange)
    document.addEventListener("copy",  onCopyPaste)
    document.addEventListener("cut",   onCopyPaste)
    document.addEventListener("paste", onCopyPaste)
    document.addEventListener("contextmenu", onContextMenu)
    window.addEventListener("offline", onOffline)
    checkMultiMonitor()

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange)
      window.removeEventListener("blur", onWindowBlur)
      document.removeEventListener("fullscreenchange", onFullscreenChange)
      document.removeEventListener("copy",  onCopyPaste)
      document.removeEventListener("cut",   onCopyPaste)
      document.removeEventListener("paste", onCopyPaste)
      document.removeEventListener("contextmenu", onContextMenu)
      window.removeEventListener("offline", onOffline)
    }
  }, [token, fireEvent])

  // ── Inactivity detector ───────────────────────────────────────────────────

  useEffect(() => {
    if (!token) return

    let timer: ReturnType<typeof setTimeout>

    const resetTimer = () => {
      clearTimeout(timer)
      timer = setTimeout(() => fireEvent("LONG_INACTIVITY"), INACTIVITY_MS)
    }

    const activityEvents = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"]
    activityEvents.forEach(ev => window.addEventListener(ev, resetTimer, { passive: true }))
    resetTimer() // start the first countdown

    return () => {
      clearTimeout(timer)
      activityEvents.forEach(ev => window.removeEventListener(ev, resetTimer))
    }
  }, [token, fireEvent])

  // ── DevTools detector (size heuristic) ───────────────────────────────────

  useEffect(() => {
    if (!token) return

    let lastFired = false // debounce — fire once per open session, not every poll

    const check = () => {
      const widthDiff  = window.outerWidth  - window.innerWidth
      const heightDiff = window.outerHeight - window.innerHeight
      const isOpen     = widthDiff > DEVTOOLS_THRESHOLD || heightDiff > DEVTOOLS_THRESHOLD

      if (isOpen && !lastFired) {
        fireEvent("DEVTOOLS_OPEN", { widthDiff, heightDiff })
        lastFired = true
      } else if (!isOpen) {
        lastFired = false // reset so next open fires again
      }
    }

    const id = setInterval(check, DEVTOOLS_POLL_MS)
    return () => clearInterval(id)
  }, [token, fireEvent])

  // ── Public API ────────────────────────────────────────────────────────────

  /**
   * Manually fire any event from outside the hook.
   * Useful for AI-detected events like MULTIPLE_FACES, VOICE_MISMATCH,
   * RAPID_ANSWERING, SUSPICIOUS_TYPING that the parent component observes.
   */
  const reportEvent = useCallback(
    (type: SecurityEventType, meta?: Record<string, unknown>) => {
      fireEvent(type, meta)
    },
    [fireEvent],
  )

  /** Returns accumulated totals and wipes localStorage. Call at final submit. */
  const getTotalsAndClear = useCallback((): FinalSubmitPayload => {
    const proctoringCounts = { ...counts.current }
    counts.current = INITIAL_COUNTS()
    try { localStorage.removeItem(storageKey) } catch {}
    return { proctoringCounts }
  }, [storageKey])

return { getTotalsAndClear, reportEvent, lastEvent }
}