"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Max width of the modal panel. Defaults to a compact auth-form width. */
  maxWidthClassName?: string;
};

/**
 * Reusable, accessible modal shell.
 *
 * - Renders into a portal at document.body so it always sits above page content.
 * - Closes on backdrop click and Escape key.
 * - Locks body scroll while open.
 * - Has no opinion about what's inside it — pass any content as children.
 */
export default function Modal({
  isOpen,
  onClose,
  children,
  maxWidthClassName = "max-w-md",
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while the modal is open
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onMouseDown={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]"
    >
      <div
        ref={panelRef}
        className={`relative w-full ${maxWidthClassName} my-8 rounded-3xl bg-white p-6 shadow-2xl shadow-sky-100 ring-1 ring-slate-100 animate-[modalIn_0.2s_ease-out] sm:p-8`}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
        >
          <span className="text-lg leading-none">✕</span>
        </button>
        {children}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );
}