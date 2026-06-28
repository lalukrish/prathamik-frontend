"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

export type SnackbarType = "success" | "error" | "warning" | "info";

export interface SnackbarProps {
  message: string;
  type?: SnackbarType;
  duration?: number; // ms, 0 = sticky
  onClose?: () => void;
  show: boolean;
}

const config: Record<
  SnackbarType,
  { icon: React.ReactNode; classes: string }
> = {
  success: {
    icon: <CheckCircle size={18} className="shrink-0" />,
    classes:
      "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800",
  },
  error: {
    icon: <XCircle size={18} className="shrink-0" />,
    classes:
      "bg-red-50 text-red-800 border border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800",
  },
  warning: {
    icon: <AlertTriangle size={18} className="shrink-0" />,
    classes:
      "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800",
  },
  info: {
    icon: <Info size={18} className="shrink-0" />,
    classes:
      "bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800",
  },
};

export default function Snackbar({
  message,
  type = "info",
  duration = 3500,
  onClose,
  show,
}: SnackbarProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (show) {
      setMounted(true);
      // tiny delay so the enter transition fires
      const enterTimer = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(enterTimer);
    } else {
      setVisible(false);
      const unmountTimer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(unmountTimer);
    }
  }, [show]);

  useEffect(() => {
    if (!show || duration === 0) return;
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setMounted(false);
        onClose?.();
      }, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!mounted) return null;

  const { icon, classes } = config[type];

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={[
        "fixed bottom-5 right-5 z-999 flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg",
        "text-sm font-medium max-w-sm w-full sm:w-auto",
        "transition-all duration-300 ease-out",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3 pointer-events-none",
        classes,
      ].join(" ")}
    >
      {icon}
      <span className="flex-1 leading-snug">{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => {
            setMounted(false);
            onClose?.();
          }, 300);
        }}
        className="ml-1 rounded-md p-0.5 opacity-60 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-current"
        aria-label="Dismiss"
      >
        <X size={15} />
      </button>
    </div>
  );
}