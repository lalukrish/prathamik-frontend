'use client'
import { useState, useEffect, useRef } from "react";
import { getInterviewScheduleHistory } from "@/shared/interviews";

interface Activity {
  id: string;
  interviewId: string;
  action: "SCHEDULED" | "CANCELLED" | "RESCHEDULED" | "EXPIRED" | "COMPLETED" | string;
  userId: string | null;
  candidateId: string | null;
  metadata: Record<string, string> | null;
  createdAt: string;
  user: { name: string } | null;
  candidate: { name: string } | null;
}

interface InterviewGroup {
  id: string;
  scheduledStartAt: string;
  activities: Activity[];
}

const ACTION_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  SCHEDULED:   { label: "Scheduled",   color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  CANCELLED:   { label: "Cancelled",   color: "bg-red-50 text-red-700 border-red-200",             dot: "bg-red-500"     },
  RESCHEDULED: { label: "Rescheduled", color: "bg-blue-50 text-blue-700 border-blue-200",          dot: "bg-blue-500"    },
  EXPIRED:     { label: "Expired",     color: "bg-violet-50 text-violet-700 border-violet-200",    dot: "bg-violet-400"  },
  COMPLETED:   { label: "Completed",   color: "bg-amber-50 text-amber-700 border-amber-200",       dot: "bg-amber-500"   },
};

function getPerformedBy(activity: Activity): { name: string; role: string } | null {
  if (activity.user)      return { name: activity.user.name,      role: "Recruiter"  };
  if (activity.candidate) return { name: activity.candidate.name, role: "Candidate"  };
  return null;
}

export function InterviewHistoryTab({ applicationId }: { applicationId: string }) {
  const hasFetched = useRef(false);

  const [groups, setGroups] = useState<InterviewGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      if (!applicationId || hasFetched.current) return;
  hasFetched.current = true;

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getInterviewScheduleHistory(
        applicationId
      );

        setGroups(res.data ?? []);
      } catch (err) {
        console.error("Failed to fetch interview history", err);
        setError("Failed to load interview history.");
      } finally {
        setLoading(false);
      }
    };
  fetchHistory(); 
  }, [applicationId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl  border border-gray-100 flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-400">Loading history…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl  border border-gray-100 flex items-center justify-center min-h-[200px]">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="bg-white rounded-2xl  border border-gray-100 flex flex-col items-center justify-center min-h-[200px] text-center p-6">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-500">No interview history yet</p>
        <p className="text-xs text-gray-400 mt-1">History will appear here once an interview is scheduled</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group, groupIndex) => {
        // Derive the final status from the last activity
        const lastActivity = group.activities[group.activities.length - 1];
        const finalCfg = ACTION_CONFIG[lastActivity?.action] ?? ACTION_CONFIG.SCHEDULED;

        return (
          <div key={group.id} className="bg-white rounded-2xl  border border-gray-00 overflow-hidden">

            {/* Interview group header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">{groupIndex + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Interview #    {groups.length - groupIndex}</p>
                  <p className="text-xs text-gray-800 mt-0.5">
                    Scheduled for{" "}
                    {new Date(group.scheduledStartAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${finalCfg.color}`}>
                {finalCfg.label}
              </span>
            </div>

            {/* Activities table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider w-8">#</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Cancelled By</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Reason / Note</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Updated At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {group.activities.map((activity, actIndex) => {
                    const cfg = ACTION_CONFIG[activity.action] ?? {
                      label: activity.action,
                      color: "bg-gray-50 text-gray-700 border-gray-200",
                      dot: "bg-gray-400",
                    };
                    const performer = getPerformedBy(activity);

                    return (
                      <tr key={activity.id} className="hover:bg-gray-50 transition-colors">

                        {/* Index */}
                        <td className="px-6 py-3.5 text-xs text-gray-300">{actIndex + 1}</td>

                        {/* Action */}
                        <td className="px-6 py-3.5">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
                            {cfg.label}
                          </span>
                        </td>

                        {/* Performed by */}
                        <td className="px-6 py-3.5">
                          {performer ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <span className="text-[10px] font-bold text-blue-600">
                                  {performer.name[0].toUpperCase()}
                                </span>
                              </div>
                              <div className="flex flex-col leading-tight">
                                <span className="text-xs font-medium text-gray-700">{performer.name}</span>
                                <span className="text-[10px] text-gray-400">{performer.role}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              System
                            </div>
                          )}
                        </td>

                        {/* Reason / metadata */}
                    <td className="px-6 py-3.5 text-xs text-gray-500 max-w-[220px]">
  {activity.metadata?.reason ? (
    <span className="italic text-gray-500">
      {activity.metadata.reason}
    </span>
  ) : activity.metadata?.expiredAt ? (
    <span className="text-gray-400">
      Auto-expired at{" "}
      {new Date(activity.metadata.expiredAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  ) : activity.metadata?.previousInterviewId ? (
    <span className="text-gray-400">
      Rescheduled from previous
    </span>
  ) : (
    <span className="text-gray-500">
      Interview Scheduled
    </span>
  )}
</td>

                        {/* Date */}
                        <td className="px-6 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                          {new Date(activity.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        );
      })}
    </div>
  );
}