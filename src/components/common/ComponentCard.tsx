"use client";

import React, { useRef } from "react";
interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
  search?: string;                          // ← optional
  placeholder?: string;
  onSearchChange?: (value: string) => void; // ← optional
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  search,
  placeholder = "Search...",
  onSearchChange,
}) => {

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-gray-100 px-4 py-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        {/* Left */}
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>

          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>

        {/* Right */}
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          {/* Add Job Button */}


          {/* Search */}
          <form className="w-full sm:w-auto">
            <div className="relative w-full sm:w-[22rem]">
              {/* Search Icon */}
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <svg
                  className="fill-gray-500 dark:fill-gray-400"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                  />
                </svg>
              </span>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder={placeholder}
                className="h-11 w-full rounded-xl border border-gray-200 bg-transparent py-2.5 pl-12 pr-20 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />

              {/* Shortcut */}
              <div className="absolute cursor-pointer right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-[0.7rem] text-gray-500 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-400">
                <span>⌘</span>
                <span>K</span>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;