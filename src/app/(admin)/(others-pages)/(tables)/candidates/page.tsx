

"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { getUsers, updateUserStatus } from "@/shared/users";
import React, { useState } from "react";
import UserDetailDrawer from "@/components/tables/Userdetaildrawer";
import Snackbar from "@/components/ui/notification";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const [snackbar, setSnackbar] = useState<{
    show: boolean;
    variant: "success" | "error" | "warning" | "info";
    message: string;
  }>({ show: false, variant: "info", message: "" });

  const showSnackbar = (
    variant: "success" | "error" | "warning" | "info",
    message: string
  ) => {
    setSnackbar({ show: false, variant, message });
    setTimeout(() => setSnackbar({ show: true, variant, message }), 50);
  };

  const handleView = (row: any) => {
    setSelectedUserId(row.id);
  };

  const handleStatusToggle = async (e: React.MouseEvent, row: any) => {
    e.stopPropagation();
    if (statusLoadingId === row.id) return;
    const next = row.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    setStatusLoadingId(row.id);
    try {
      await updateUserStatus(row.id, next);
      showSnackbar(
        "success",
        `User ${next === "BLOCKED" ? "blocked" : "activated"} successfully`
      );
      // Trigger refetch by bumping the key
      setRefetchTrigger((n) => n + 1);
    } catch {
      showSnackbar("error", "Failed to update user status");
    } finally {
      setStatusLoadingId(null);
    }
  };

  const handleDelete = async (_id: string) => {
    return true;
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Users" />

      <div className="space-y-6">
        <BasicTableOne
          key={refetchTrigger}          // remount to force refetch after status change
          search={search}
          onSearchChange={setSearch}
          fetchFunction={(params) =>
            getUsers({ ...params }).then((res) => ({
              data: res.users,
              total: res.pagination.total,
            }))
          }
          handleView={handleView}
          handleDelete={handleDelete}
          // BasicTableOne requires these even when not using create/edit modal
          emptyRow={{ id: "" }}
          modalFields={() => null}
          modalCreateTitle=""
          modalEditTitle=""
          modalCreateLabel=""
          modalEditLabel=""
          columns={[
            {
              key: "name",
              label: "Name",
              render: (row) => (
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-cyan-400 text-xs font-bold text-white">
                    {row.name?.slice(0, 2).toUpperCase() ?? "??"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {row.name ?? "—"}
                    </p>
                    <p className="text-xs text-gray-400">{row.email ?? "—"}</p>
                  </div>
                </div>
              ),
            },
            {
              key: "role",
              label: "Role",
              render: (row) => (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    row.role === "ADMIN"
                      ? "bg-violet-100 text-violet-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {row.role ?? "—"}
                </span>
              ),
            },
            {
              key: "status",
              label: "Status",
              render: (row) => (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    row.status === "ACTIVE"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      row.status === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  {row.status ?? "—"}
                </span>
              ),
            },
            {
              key: "stats",
              label: "Tests",
              render: (row) => (
                <span className="text-sm font-medium text-gray-700">
                  {row.stats?.totalSessions ?? 0}
                </span>
              ),
            },
            {
              key: "submitted",
              label: "Submitted",
              render: (row) => (
                <span className="text-sm font-medium text-emerald-600">
                  {row.stats?.submitted ?? 0}
                </span>
              ),
            },
            {
              key: "avgScore",
              label: "Avg Score",
              render: (row) => {
                const score = row.stats?.avgScore ?? 0;
                return (
                  <span
                    className={`text-sm font-semibold ${
                      score >= 75
                        ? "text-emerald-600"
                        : score >= 50
                        ? "text-amber-500"
                        : "text-slate-400"
                    }`}
                  >
                    {score > 0 ? `${score}%` : "—"}
                  </span>
                );
              },
            },
            {
              key: "createdAt",
              label: "Joined",
              render: (row) =>
                row.createdAt
                  ? new Date(row.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—",
            },
            {
              key: "blockAction",
              label: "Action",
              render: (row) => (
                <button
                  onClick={(e) => handleStatusToggle(e, row)}
                  disabled={statusLoadingId === row.id}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 ${
                    row.status === "ACTIVE"
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  }`}
                >
                  {statusLoadingId === row.id
                    ? "..."
                    : row.status === "ACTIVE"
                    ? "Block"
                    : "Activate"}
                </button>
              ),
            },
          ]}
        />
      </div>

      <UserDetailDrawer
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
        onStatusChange={(userId, status) => {
          showSnackbar(
            "success",
            `User ${status === "BLOCKED" ? "blocked" : "activated"} successfully`
          );
          setRefetchTrigger((n) => n + 1);
        }}
      />

      <Snackbar
        show={snackbar.show}
        type={snackbar.variant}
        message={snackbar.message}
        onClose={() => setSnackbar((s) => ({ ...s, show: false }))}
      />
    </div>
  );
}