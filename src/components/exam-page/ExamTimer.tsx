"use client";

interface ExamTimerProps {
  remainingSeconds: number;
}

export default function ExamTimer({ remainingSeconds }: ExamTimerProps) {
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const isWarning = remainingSeconds <= 300; // 5 min warning
  const isCritical = remainingSeconds <= 60;

  return (
    <div className="flex items-center gap-1">
      <div
        className={`flex items-center gap-3 rounded-xl px-5 py-2.5 font-mono text-sm font-semibold tabular-nums ${
          isCritical
            ? "bg-red-50 text-red-600 ring-1 ring-red-200"
            : isWarning
              ? "bg-amber-50 text-amber-600 ring-1 ring-amber-200"
              : "bg-slate-100 text-slate-700"
        }`}
      >
        <TimeUnit value={hours} label="hrs" />
        <span className="opacity-40">:</span>
        <TimeUnit value={minutes} label="min" />
        <span className="opacity-40">:</span>
        <TimeUnit value={seconds} label="sec" />
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center leading-none">
      <span className="text-base">{String(value).padStart(2, "0")}</span>
      <span className="mt-0.5 text-[10px] font-normal opacity-50">{label}</span>
    </div>
  );
}