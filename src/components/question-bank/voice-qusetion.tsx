
'use client'
import { useSpeech } from "react-text-to-speech";

import { useEffect, useRef } from "react";

function AuroraRing({ active, paused }: { active: boolean; paused: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)
  const tRef      = useRef(0)
  const intensityRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const W = 64, H = 64, CX = 32, CY = 32, R = 24

    const strands = [
      { phase: 0,   speed: 1.8, width: 2.5, alpha: 0.9,  hue: 270 },
      { phase: 1.1, speed: 2.3, width: 1.8, alpha: 0.7,  hue: 285 },
      { phase: 2.2, speed: 1.5, width: 1.4, alpha: 0.55, hue: 255 },
      { phase: 0.6, speed: 2.8, width: 1.0, alpha: 0.4,  hue: 300 },
    ]

    const target = active ? 1 : paused ? 0.45 : 0

    const draw = () => {
      intensityRef.current += (target - intensityRef.current) * 0.06
      const intensity = intensityRef.current

      ctx.clearRect(0, 0, W, H)
      if (intensity < 0.01 && !active && !paused) {
        if (!active && !paused) return
      }

      strands.forEach((s) => {
        const pts: [number, number][] = []
        for (let i = 0; i <= 120; i++) {
          const a = (i / 120) * Math.PI * 2
          const wobble =
            Math.sin(a * 3 + tRef.current * s.speed + s.phase) * 0.18 * intensity +
            Math.sin(a * 5 - tRef.current * s.speed * 0.7 + s.phase * 2) * 0.09 * intensity +
            Math.sin(a * 7 + tRef.current * s.speed * 1.3) * 0.04 * intensity
          const r = R * (1 + wobble)
          pts.push([CX + Math.cos(a) * r, CY + Math.sin(a) * r])
        }
        ctx.beginPath()
        ctx.moveTo(pts[0][0], pts[0][1])
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
        ctx.closePath()
        ctx.shadowBlur   = active ? 8 : 3
        ctx.shadowColor  = `hsla(${s.hue},100%,70%,${s.alpha * intensity})`
        ctx.strokeStyle  = `hsla(${s.hue},100%,${active ? 75 : 60}%,${s.alpha * intensity})`
        ctx.lineWidth    = s.width * intensity
        ctx.stroke()
        ctx.shadowBlur   = 0
      })

      tRef.current += 0.022
      rafRef.current = requestAnimationFrame(draw)
    }

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(draw)

    return () => cancelAnimationFrame(rafRef.current)
  }, [active, paused])

  return <canvas ref={canvasRef} width={64} height={64} style={{ width: 44, height: 44 }} />
}

export function VoicePlayer({ text }: { text: string }) {
  const { speechStatus, start, pause, stop } = useSpeech({
      text,
    pitch: 1.3,
    rate: 0.7,
    volume: 1,
    lang: "en-US",
    voiceURI: "Microsoft Zira - English (United States)",
    autoPlay: false,
    highlightText: false,
    showOnlyHighlightedText: false,
    highlightMode: "sentence",
    enableDirectives: false,
  })

  const isPlaying = speechStatus === "started"
  const isPaused  = speechStatus === "paused"
  const isStopped = speechStatus === "stopped"

  return (
    <div className="flex items-center gap-2.5 mt-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl w-fit">
      <button disabled={isPlaying} onClick={start}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 transition">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </button>
      <button disabled={isPaused} onClick={pause}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 transition">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      </button>
      <button disabled={isStopped} onClick={stop}
        className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-30 transition">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>
      </button>

      <AuroraRing active={isPlaying} paused={isPaused} />

      <span className="text-[11px] text-slate-400 font-medium min-w-[52px]">
        {isPlaying ? "Speaking…" : isPaused ? "Paused" : "Ready"}
      </span>
    </div>
  )
}