"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  Search,
  X,
  User,
  Briefcase,
  ChevronRight,
  Loader2,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

// ── types ─────────────────────────────────────────────────────
interface Candidate {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

interface Application {
  id: string;
  jobTitle: string;
  status: string;
  appliedAt?: string;
}

// ── status badge ──────────────────────────────────────────────
const statusColors: Record<string, string> = {
  PENDING:    "bg-amber-50 text-amber-700",
  SHORTLISTED:"bg-blue-50 text-blue-700",
  HIRED:      "bg-green-50 text-green-700",
  REJECTED:   "bg-red-50 text-red-700",
};

function StatusBadge({ status }: { status: string }) {
  const cls = statusColors[status?.toUpperCase()] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}>
      {status ? status.charAt(0) + status.slice(1).toLowerCase() : "—"}
    </span>
  );
}

// ── avatar initials ───────────────────────────────────────────
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[12px] font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
      {initials}
    </div>
  );
}

// ── CommandPalette ────────────────────────────────────────────
export function CommandPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // debounced search — fires after 3 chars
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length < 3) {
      setCandidates([]);
      setSelected(null);
      setApplications([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/candidate/search/candidate=${encodeURIComponent(query)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCandidates(res.data?.data ?? res.data ?? []);
        setSelected(null);
        setApplications([]);
      } catch {
        setCandidates([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // fetch applications when a candidate is selected
  const selectCandidate = useCallback(async (candidate: Candidate) => {
    setSelected(candidate);
    setApplications([]);
    setLoadingApps(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/candidates/${candidate.id}/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data?.data ?? res.data ?? []);
    } catch {
      setApplications([]);
    } finally {
      setLoadingApps(false);
    }
  }, []);

  const goToCandidate = (id: string) => {
    router.push(`/candidates/${id}`);
    onClose();
  };

  const goToApplication = (candidateId: string, appId: string) => {
    router.push(`/candidates/${candidateId}/applications/${appId}`);
    onClose();
  };

  const showResults = query.length >= 3;

  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 z-[99990] bg-black/25 dark:bg-black/50"
        onClick={onClose}
      />

      {/* palette */}
      <div className="fixed left-1/2 top-[10vh] z-[99999] w-full max-w-[620px] -translate-x-1/2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">

        {/* input row */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 dark:border-gray-800">
          {searching ? (
            <Loader2 size={16} className="shrink-0 animate-spin text-blue-500" />
          ) : (
            <Search size={16} className="shrink-0 text-gray-400" />
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email or phone…"
            className="h-[50px] flex-1 bg-transparent text-[14px] text-gray-800 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setCandidates([]); setSelected(null); }}
              className="rounded-md p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={14} />
            </button>
          )}
          <kbd className="rounded-md border border-gray-200 bg-gray-50 px-[7px] py-1 text-[11px] text-gray-400 dark:border-gray-700 dark:bg-gray-800">
            esc
          </kbd>
        </div>

        {/* hint before typing */}
        {!showResults && (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <Search size={28} className="text-gray-200 dark:text-gray-700" />
            <p className="text-[13px] text-gray-400">
              Type at least 3 characters to search candidates
            </p>
          </div>
        )}

        {/* results */}
        {showResults && (
          <div className="flex" style={{ minHeight: 280 }}>

            {/* left — candidate list */}
            <div className="w-[260px] shrink-0 overflow-y-auto border-r border-gray-100 dark:border-gray-800" style={{ maxHeight: 380 }}>
              {candidates.length === 0 && !searching && (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                  <User size={24} className="text-gray-200 dark:text-gray-700" />
                  <p className="text-[13px] text-gray-400">No candidates found</p>
                </div>
              )}

              {candidates.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectCandidate(c)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                    selected?.id === c.id
                      ? "bg-blue-50 dark:bg-blue-950"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <Avatar name={c.name} />
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-[13px] font-medium ${selected?.id === c.id ? "text-blue-700 dark:text-blue-300" : "text-gray-800 dark:text-white"}`}>
                      {c.name}
                    </p>
                    {c.email && (
                      <p className="truncate text-[11px] text-gray-400">{c.email}</p>
                    )}
                  </div>
                  <ChevronRight size={13} className={`shrink-0 ${selected?.id === c.id ? "text-blue-400" : "text-gray-300"}`} />
                </button>
              ))}
            </div>

            {/* right — applications panel */}
            <div className="flex-1 overflow-y-auto" style={{ maxHeight: 380 }}>
              {!selected && (
                <div className="flex h-full flex-col items-center justify-center gap-2 py-12 text-center">
                  <Briefcase size={24} className="text-gray-200 dark:text-gray-700" />
                  <p className="text-[13px] text-gray-400">Select a candidate<br />to see their applications</p>
                </div>
              )}

              {selected && (
                <>
                  {/* candidate header */}
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar name={selected.name} />
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-gray-800 dark:text-white">{selected.name}</p>
                        {selected.phone && (
                          <p className="text-[11px] text-gray-400 flex items-center gap-1">
                            <Phone size={10} /> {selected.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => goToCandidate(selected.id)}
                      className="flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-[11px] text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 transition-colors"
                    >
                      View <ExternalLink size={10} />
                    </button>
                  </div>

                  {/* applications list */}
                  {loadingApps && (
                    <div className="flex items-center justify-center gap-2 py-10">
                      <Loader2 size={16} className="animate-spin text-blue-400" />
                      <span className="text-[13px] text-gray-400">Loading applications…</span>
                    </div>
                  )}

                  {!loadingApps && applications.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                      <Briefcase size={22} className="text-gray-200 dark:text-gray-700" />
                      <p className="text-[13px] text-gray-400">No applications found</p>
                    </div>
                  )}

                  {!loadingApps && applications.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => goToApplication(selected.id, app.id)}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
                        <Briefcase size={13} className="text-gray-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-gray-800 dark:text-white">
                          {app.jobTitle ?? "Untitled Job"}
                        </p>
                        {app.appliedAt && (
                          <p className="text-[11px] text-gray-400">
                            {new Date(app.appliedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                          </p>
                        )}
                      </div>
                      <StatusBadge status={app.status} />
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* footer */}
        <div className="flex items-center gap-4 border-t border-gray-100 px-4 py-2 dark:border-gray-800">
          {[
            { key: "↑↓", label: "navigate" },
            { key: "↵", label: "select" },
            { key: "esc", label: "close" },
          ].map(({ key, label }) => (
            <span key={key} className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-[10px] dark:border-gray-700 dark:bg-gray-800">
                {key}
              </kbd>
              {label}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}