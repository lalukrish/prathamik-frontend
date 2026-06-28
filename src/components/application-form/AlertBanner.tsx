// components/application-form/AlertBanner.tsx
'use client'
import { useEffect } from "react";

type AlertType = "error" | "success";

interface Props {
  message: string | null;
  type?: AlertType;
  onDismiss: () => void;
  autoDismissMs?: number;
}

export function AlertBanner({ message, type = "error", onDismiss, autoDismissMs = 5000 }: Props) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(t);
  }, [message, autoDismissMs, onDismiss]);

  if (!message) return null;

  const styles = {
    error:   "bg-red-50 border-red-200 text-red-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
  };

  const icons = {
    error:   "✕",
    success: "✓",
  };

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium max-w-md w-full ${styles[type]}`}>
      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${type === "error" ? "bg-red-200 text-red-700" : "bg-emerald-200 text-emerald-700"}`}>
        {icons[type]}
      </span>
      <span className="flex-1">{message}</span>
      <button onClick={onDismiss} className="shrink-0 opacity-60 hover:opacity-100 text-lg leading-none">×</button>
    </div>
  );
}