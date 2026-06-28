
"use client";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import Link from "next/link";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search, X, User, Briefcase, ChevronRight,
  Loader2, Phone, ExternalLink,
  Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

// ── types ─────────────────────────────────────────────────────
interface Application {
  id: string;
  job: {
    id: string;
    title: string;
  };
}

interface Candidate {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  currentRole?: string;
  applications: Application[];
}

// ── helpers ───────────────────────────────────────────────────
function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
      {initials}
    </div>
  );
}

// ── SearchDropdown ────────────────────────────────────────────
function SearchDropdown({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<Candidate | null>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // debounced search after 3 chars
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 3) { setCandidates([]); setSelected(null); return; }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/candidate/search/candidate?query=${encodeURIComponent(query)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: Candidate[] = res.data?.data ?? res.data ?? [];
        setCandidates(data);
        // auto-select first result
        setSelected(data[0] ?? null);
      } catch {
        setCandidates([]);
        setSelected(null);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const navigate = (href: string) => { router.push(href); onClose(); };
  const showPanel = query.length >= 3;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* input */}
      <div className="flex items-center gap-2 h-10 rounded-xl border border-blue-400 bg-white px-3 dark:border-blue-500 dark:bg-gray-900 ring-2 ring-blue-100 dark:ring-blue-900">
        {searching
          ? <Loader2 size={15} className="shrink-0 animate-spin text-blue-400" />
          : <Search size={15} className="shrink-0 text-gray-400" />
        }
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email or phone…"
          className="flex-1 bg-transparent text-[13px] text-gray-800 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500"
        />
        {query ? (
          <button
            onClick={() => { setQuery(""); setCandidates([]); setSelected(null); }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={14} />
          </button>
        ) : (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={14} />
          </button>
        )}
      </div>

      {/* dropdown panel */}
      {showPanel && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-[99999] w-[580px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
          <div className="flex" style={{ minHeight: 200, maxHeight: 360 }}>

            {/* left — candidates */}
            <div className="w-[230px] shrink-0 overflow-y-auto border-r border-gray-100 dark:border-gray-800">
              {candidates.length === 0 && !searching && (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                  <User size={22} className="text-gray-200 dark:text-gray-700" />
                  <p className="text-[12px] text-gray-400">No candidates found</p>
                </div>
              )}

              {candidates.map((c) => {
                const isActive = selected?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Avatar name={c.name} />
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className={`truncate text-[13px] font-medium ${isActive ? "text-blue-700 dark:text-blue-300" : "text-gray-800 dark:text-white"}`}>
                        {c.name}
                      </p>
                       {c.currentRole && (
                          <p className="text-[11px] text-gray-400 flex items-center gap-1">
                          {c.currentRole}
                          </p>
                        )}

                         {c.email && (
                          <p className="text-[11px] text-gray-400 flex items-center gap-1">
                            <Mail size={9} /> {c.email}
                          </p>
                        )}
                     {c.phone && (
                          <p className="text-[11px] text-gray-400 flex items-center gap-1">
                            <Phone size={9} /> {c.phone}
                          </p>
                        )}
                    </div>
                    <span className="shrink-0 text-[10px] text-gray-400">
                      {c.applications.length}
                    </span>
                    <ChevronRight size={12} className={`shrink-0 ${isActive ? "text-blue-400" : "text-gray-300"}`} />
                  </button>
                );
              })}
            </div>

            {/* right — applications */}
            <div className="flex-1 overflow-y-auto">
              {!selected ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 py-10 text-center">
                  <Briefcase size={22} className="text-gray-200 dark:text-gray-700" />
                  <p className="text-[12px] text-gray-400">Select a candidate<br />to see applications</p>
                </div>
              ) : (
                <>
                  {/* candidate mini-header */}
                  <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2.5 dark:border-gray-800">
                    {/* <div className="flex items-center gap-2 min-w-0">
                      <Avatar name={selected.name} />
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-medium text-gray-800 dark:text-white">
                          {selected.name}
                        </p>
                        {selected.phone && (
                          <p className="text-[11px] text-gray-400 flex items-center gap-1">
                            <Phone size={9} /> {selected.phone}
                          </p>
                        )}
                      </div>
                    </div> */}
                    {/* <button
                      onClick={() => navigate(`/candidates/${selected.id}`)}
                      className="flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-[11px] text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 transition-colors"
                    >
                      View <ExternalLink size={9} />
                    </button> */}
                    <h3>Applications</h3>
                  </div>

                  {/* applications list */}
                  {selected.applications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                      <Briefcase size={20} className="text-gray-200 dark:text-gray-700" />
                      <p className="text-[12px] text-gray-400">No applications found</p>
                    </div>
                  ) : (
                    selected.applications.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => navigate(`/applicants/applicant-profile/${app.id}`)}
                        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
                          <Briefcase size={12} className="text-gray-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12px] font-medium text-gray-800 dark:text-white">
                            {app.job.title}
                          </p>
                          <p className="text-[11px] text-gray-400">{app.job.id.slice(0, 8)}…</p>
                        </div>
                        <ExternalLink size={11} className="shrink-0 text-gray-300" />
                      </button>
                    ))
                  )}
                </>
              )}
            </div>
          </div>

          {/* footer */}
          <div className="flex items-center border-t border-gray-100 px-3 py-1.5 dark:border-gray-800">
            <span className="text-[11px] text-gray-400">
              {candidates.length} candidate{candidates.length !== 1 ? "s" : ""}
            </span>
            <span className="ml-auto text-[11px] text-gray-400 flex items-center gap-1">
              <kbd className="rounded border border-gray-200 bg-gray-50 px-1 py-0.5 font-mono text-[10px] dark:border-gray-700 dark:bg-gray-800">esc</kbd>
              to close
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── AppHeader ─────────────────────────────────────────────────
const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) toggleSidebar();
    else toggleMobileSidebar();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [openSearch]);

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-20 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">

          <button
            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z" fill="currentColor" />
              </svg>
            ) : (
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z" fill="currentColor" />
              </svg>
            )}
          </button>

          <Link href="/" className="lg:hidden">
            <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
              Prathamik Learn
            </h1>
          </Link>

          <button
            onClick={() => setApplicationMenuOpen(!isApplicationMenuOpen)}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z" fill="currentColor" />
            </svg>
          </button>

          {/* search — desktop */}
          <div className="hidden lg:block" style={{ minWidth: 280 }}>
            {searchOpen ? (
              <SearchDropdown onClose={closeSearch} />
            ) : (
              <button
                onClick={openSearch}
                className="flex items-center gap-3 h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-4 pr-3 text-[13px] text-gray-400 transition hover:border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
              >
                <Search size={15} className="shrink-0" />
                <span className="flex-1 text-left">Search candidates…</span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[11px] font-mono text-gray-400 dark:border-gray-600 dark:bg-gray-700">⌘</kbd>
                  <kbd className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[11px] font-mono text-gray-400 dark:border-gray-600 dark:bg-gray-700">K</kbd>
                </span>
              </button>
            )}
          </div>
        </div>

        <div className={`${isApplicationMenuOpen ? "flex" : "hidden"} items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}>
          <div className="flex items-center gap-2 2xsm:gap-3">
            <ThemeToggleButton />
            <NotificationDropdown />
          </div>
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
