"use client";

import { useEffect, useState } from "react";
import { getUserById, updateUserStatus } from "@/shared/users";

// ── Types ─────────────────────────────────────────────────────────────────────

interface UserStats {
  totalSessions: number;
  submitted: number;
  inProgress: number;
  paused: number;
  expired: number;
  avgScore: number;
  bestScore: number;
  lastActive: string | null;
}

interface UserSession {
  sessionId: string;
  title: string;
  status: string;
  score: number | null;
  totalMarks: number;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  percentage: number;
  startedAt: string;
  submittedAt: string | null;
  durationMinutes: number;
}

interface UserDetail {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "ACTIVE" | "BLOCKED";
  createdAt: string;
  updatedAt: string;
  stats: UserStats;
  sessions: UserSession[];
}

interface Props {
  userId: string | null;
  onClose: () => void;
  onStatusChange: (userId: string, status: "ACTIVE" | "BLOCKED") => void;
}

// ── Helper components ─────────────────────────────────────────────────────────

function SessionStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    SUBMITTED:   "bg-emerald-100 text-emerald-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    PAUSED:      "bg-amber-100 text-amber-700",
    EXPIRED:     "bg-red-100 text-red-600",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${map[status] ?? "bg-slate-100 text-slate-500"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function ScoreBar({ percentage }: { percentage: number }) {
  const color =
    percentage >= 75 ? "bg-emerald-400" :
    percentage >= 50 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
      <span className="w-9 text-right text-xs font-semibold text-slate-600">
        {percentage}%
      </span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function UserDetailDrawer({ userId, onClose, onStatusChange }: Props) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "sessions">("overview");

  useEffect(() => {
    if (!userId) { setUser(null); return; }
    setLoading(true);
    setActiveTab("overview");
    getUserById(userId)
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleStatusToggle = async () => {
    if (!user) return;
    const next = user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    setStatusLoading(true);
    try {
      await updateUserStatus(user.id, next);
      setUser((prev) => prev ? { ...prev, status: next } : prev);
      onStatusChange(user.id, next);
    } finally {
      setStatusLoading(false);
    }
  };

  const isOpen = !!userId;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer panel */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-[520px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-800">User Details</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-sky-500" />
          </div>
        )}

        {/* Content */}
        {!loading && user && (
          <div className="flex flex-1 flex-col overflow-hidden">

            {/* Identity + stats strip */}
            <div className="shrink-0 border-b border-slate-100 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-400 text-base font-bold text-white">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{user.name}</p>
                    <p className="text-sm text-slate-400">{user.email}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          user.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {user.status}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Block / Activate */}
                <button
                  onClick={handleStatusToggle}
                  disabled={statusLoading}
                  className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all disabled:opacity-60 ${
                    user.status === "ACTIVE"
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  }`}
                >
                  {statusLoading
                    ? "..."
                    : user.status === "ACTIVE"
                    ? "Block User"
                    : "Activate User"}
                </button>
              </div>

              {/* Mini stats */}
              <div className="mt-4 grid grid-cols-4 divide-x divide-slate-100 rounded-xl bg-slate-50 py-3">
                {[
                  { label: "Tests",     value: user.stats.totalSessions },
                  { label: "Submitted", value: user.stats.submitted },
                  { label: "Avg Score", value: `${user.stats.avgScore}%` },
                  { label: "Best",      value: `${user.stats.bestScore}%` },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col items-center gap-0.5 px-2">
                    <p className="text-base font-bold text-slate-800">{s.value}</p>
                    <p className="text-[11px] text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex shrink-0 border-b border-slate-100 px-6">
              {(["overview", "sessions"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`mr-6 border-b-2 py-3 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? "border-sky-500 text-sky-600"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">

              {/* Overview tab */}
              {activeTab === "overview" && (
                <div className="flex flex-col gap-5">
                  <div className="divide-y divide-slate-50 rounded-xl border border-slate-100">
                    {[
                      {
                        label: "Joined",
                        value: new Date(user.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        }),
                      },
                      {
                        label: "Last Active",
                        value: user.stats.lastActive
                          ? new Date(user.stats.lastActive).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                            })
                          : "Never",
                      },
                      { label: "In Progress", value: user.stats.inProgress },
                      { label: "Paused",      value: user.stats.paused },
                      { label: "Expired",     value: user.stats.expired },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between px-4 py-2.5">
                        <span className="text-xs text-slate-400">{row.label}</span>
                        <span className="text-xs font-medium text-slate-700">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  {user.sessions.length > 0 && (
                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Recent Tests
                      </p>
                      <div className="flex flex-col gap-2">
                        {user.sessions.slice(0, 3).map((s) => (
                          <div key={s.sessionId} className="rounded-xl border border-slate-100 p-3">
                            <div className="mb-1.5 flex items-start justify-between gap-2">
                              <p className="text-xs font-medium leading-snug text-slate-700">{s.title}</p>
                              <SessionStatusBadge status={s.status} />
                            </div>
                            {s.status === "SUBMITTED" && <ScoreBar percentage={s.percentage} />}
                          </div>
                        ))}
                      </div>
                      {user.sessions.length > 3 && (
                        <button
                          onClick={() => setActiveTab("sessions")}
                          className="mt-2 text-xs font-medium text-sky-500 hover:text-sky-600"
                        >
                          View all {user.sessions.length} sessions →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Sessions tab */}
              {activeTab === "sessions" && (
                <div className="flex flex-col gap-3">
                  {user.sessions.length === 0 && (
                    <div className="flex h-40 items-center justify-center text-sm text-slate-400">
                      No sessions yet
                    </div>
                  )}
                  {user.sessions.map((s) => (
                    <div key={s.sessionId} className="rounded-xl border border-slate-100 p-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-snug text-slate-800">{s.title}</p>
                        <SessionStatusBadge status={s.status} />
                      </div>

                      {s.status === "SUBMITTED" && (
                        <>
                          <ScoreBar percentage={s.percentage} />
                          <div className="mt-2 flex gap-4 text-xs">
                            <span className="font-medium text-emerald-600">✓ {s.correct} correct</span>
                            <span className="font-medium text-red-500">✗ {s.incorrect} wrong</span>
                            <span className="text-slate-400">{s.attempted}/{s.totalQuestions} attempted</span>
                          </div>
                        </>
                      )}

                      <div className="mt-2 flex gap-3 text-[11px] text-slate-400">
                        <span>
                          Started{" "}
                          {new Date(s.startedAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short",
                          })}
                        </span>
                        {s.submittedAt && (
                          <span>
                            · Submitted{" "}
                            {new Date(s.submittedAt).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short",
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* Empty state when not loading but no user */}
        {!loading && !user && isOpen && (
          <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
            Failed to load user details
          </div>
        )}
      </div>
    </>
  );
}