"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import Alert from "@/components/ui/alert/Alert";
import { NormalInputField, PasswordInputField } from "@/components/form/formFields";
import { getjobCandidate } from "@/shared/candidates";
import axios from "axios";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Snackbar from "@/components/ui/notification";

type ApplicationStatus =
  | "APPLIED" | "SHORTLISTED" | "REJECTED"
  | "INTERVIEW" | "SELECTED";

const statusColor: Record<ApplicationStatus, string> = {
  "APPLIED": "bg-blue-100 text-blue-700 border-blue-300",
  "SHORTLISTED": "bg-orange-100 text-orange-700 border-orange-300",
  "REJECTED": "bg-red-100 text-red-700 border-red-300",
  "INTERVIEW": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "SELECTED": "bg-green-100 text-green-700 border-green-300",
};

export default function CandidateTable() {
  const [search, setSearch] = useState("");
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

  const params = useParams()
  const router = useRouter();

  const jobId = params.slug as string

  const handleCreate = async (data: any) => {

    try {
     const user = JSON.parse(localStorage.getItem("user") ?? "{}");
     const token = user.token;      
     const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: "candidate",
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/create`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

            showSnackbar("success", "Candidate created successfully");

      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong";
         showSnackbar("error", errorMessage);
       return null;
    }
  };

  const handleEdit = async (data: any) => {
    try {
const user = JSON.parse(localStorage.getItem("user") ?? "{}");
const token = user.token;
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/candidate/${data.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
 
                  showSnackbar("success", "Candidate updated successfully");

      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong";
        showSnackbar("error", errorMessage);
      return null;
    }
  };

const handleDelete = async (id: string) => {
  console.log("Delete Candidate:", id);
  return true
};

  // useEffect(() => {
  //   if (alert) {
  //     const timer = setTimeout(() => setAlert(null), 6000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [alert]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Candidates" />

      <div className="space-y-6">
        <BasicTableOne
          search={search}
          onSearchChange={setSearch}
          fetchFunction={() =>
            getjobCandidate(jobId)}
          handleCreate={handleCreate}
          handleEdit={handleEdit}
          handleDelete={handleDelete}

          emptyRow={{
            id: "",
            name: "",
            email: "",
            password: "",
          }}

          transformRowForEdit={(row) => ({
            id: row.id,
            name: row.name,
            email: row.email,
            password: "",
          })}

          transformCreateResponse={(data) => ({
            id: data.id,
            name: data.name,
            email: data.email,
            createdAt: data.createdAt,
          })}

          transformEditResponse={(rows, data) =>
            rows.map((row) =>
              row.id !== data.id ? row : {
                ...row,
                name: data.name,
                email: data.email,
              }
            )
          }

          modalCreateTitle="Create Candidate"
          modalEditTitle="Edit Candidate"
          modalCreateLabel="Create Candidate"
          modalEditLabel="Update Candidate"

          modalFields={(selectedRow, setSelectedRow) => (
            <>
              <NormalInputField
                label="Name"
                type="text"
                placeholder="Enter candidate name"
                value={selectedRow.name}
                required
                onChange={(e) =>
                  setSelectedRow((prev: any) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />

              <NormalInputField
                label="Email"
                type="email"
                placeholder="Enter email"
                value={selectedRow.email}
                required
                onChange={(e) =>
                  setSelectedRow((prev: any) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />

              <PasswordInputField
                label="Password"
                placeholder="Enter password"
                value={selectedRow.password}
                autoComplete="new-password"
                onChange={(e) =>
                  setSelectedRow((prev: any) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
            </>
          )}

          buttons={(openCreateModal) => (
            <button
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20"
              onClick={openCreateModal}
            >
              <Plus size={18} />
              <span>Create Candidate</span>
            </button>
          )}

          columns={[
            {
              key: "name",
              label: "Name",
              render: (row) => row.candidate.name ?? "—",
            },
            {
              key: "email",
              label: "Email",
              render: (row) => row.candidate.email ?? "—",
            },
            {
              key: "phone",
              label: "Phone",
              render: (row) => row.candidate.phone ?? "—",
            },
            {
              key: "totalExperience",
              label: "Total Experience",
          render: (row) => `${row.candidate.totalExperience} years`,
            },

            {
              key: "createdAt",
              label: "Created At",
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
  key: "status",
  label: "Stage",
  render: (row) => {
    const status = row.status as ApplicationStatus | undefined;

    if (!status) {
      return "—";
    }

    const formattedStatus =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    return (
      <span
        className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${
          statusColor[status] ??
          "bg-gray-100 text-gray-700 border-gray-300"
        }`}
      >
        {formattedStatus}
      </span>
    );
  },
},
{
  key: "interviewStatus",
  label: "Interview Status",
  render: (row) => {
    const status = row.interviews?.[0]?.status;

    if (!status) {
      return (
        <span className="inline-flex items-center rounded-full border border-cyan-300 bg-cyan-100 px-3 py-1 text-sm font-medium text-green-700">
          Not Scheduled
        </span>
      );
    }

    const displayStatus =
      status.charAt(0).toUpperCase() +
      status.slice(1).toLowerCase();

    return (
      <span
        className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${
          status === "COMPLETED"
            ? "bg-green-100 text-green-700 border-green-300"
            : status === "EXPIRED"
            ? "bg-red-100 text-red-700 border-red-300"
            : status === "SCHEDULED"
            ? "bg-blue-100 text-blue-700 border-blue-300"
            : "bg-gray-100 text-gray-700 border-gray-300"
        }`}
      >
        {displayStatus}
      </span>
    );
  },
},
            {
              key: "details",
              label: "Details",
              render: (row) => (
                <button
                  onClick={() =>
                    router.push(`/applicants/applicant-profile/${row.id}/`)
                  }
                  className="rounded-lg bg-brand-500 px-3 py-1 text-sm text-white hover:bg-brand-600"
                >
                  View Candidate
                </button>
              ),
            },
          ]}
        />

     <Snackbar
            show={snackbar.show}
            type={snackbar.variant}
            message={snackbar.message}
            onClose={() => setSnackbar((s) => ({ ...s, show: false }))}
          />
      </div>
    </div>
  );
}