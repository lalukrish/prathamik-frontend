"use client";
import React, { useRef, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  showCloseButton = true,
  isFullscreen = false,
  footer,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const contentClasses = isFullscreen
    ? "w-full h-full"
    : "relative w-full rounded-3xl bg-white dark:bg-gray-900 shadow-xl";


  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-y-auto"
      style={{ zIndex: 99999 }}
    >
      {!isFullscreen && (
        <div
          className="fixed inset-0 h-full w-full bg-black/40"
          onClick={onClose}
        />
      )}

      <div
        ref={modalRef}
        className={`${contentClasses} ${className ?? ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-white/[0.05]">
            {title && (
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                {title}
              </h2>
            )}            
            {showCloseButton && (
              <button
                onClick={onClose}
                style={{ zIndex: 100000 }}
                className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

   <div className="px-6 py-5 [&_label]:dark:text-white [&_input]:dark:text-white [&_textarea]:dark:text-white [&_select]:dark:text-white [&_p]:dark:text-gray-300 [&_li]:dark:text-white/75 [&_ul]:dark:text-white [&_ol]:dark:text-white [&_span]:dark:text-white">
  {children}
   </div>
      {footer && (
    <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-white/[0.05]">
    {React.Children.toArray(footer as React.ReactNode)}
    </div>
     )}
      </div>
    </div>
  );
};