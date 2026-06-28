
"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { NormalInputField, PasswordInputField } from "@/components/form/formFields";
import { getAllOrganisation } from "@/shared/organisation";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from  "react";
import { createOrganization, updateOrganization } from "@/shared/admin";
import Snackbar from "@/components/ui/notification";


export default function BasicTables() {
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

  const router = useRouter();

  const handleEdit = async (data: any) => {
    try {
       const response = await updateOrganization(data.id, {
      organizationName: data.name,
      adminId: data.admin.id,
      adminName: data.admin.name,
      adminEmail: data.admin.email,
      adminPassword: data.adminPassword,
    });
      showSnackbar("success", "Organization Updated successfully");
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

  const handleCreate = async (data: any) => {
    try {
      const response = await createOrganization({
      organizationName: data.name,
      adminName: data.admin.name,
      adminEmail: data.admin.email,
      adminPassword: data.adminPassword,
    });
          showSnackbar("success", "Organization created successfully");
      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong";
        showSnackbar("success", "Create Failed");
      return null;
    }
  };
const handleDelete = async (id: string) => {
  console.log("Delete:", id);
  return true;
};

  // useEffect(() => {
  //   if (alert) {
  //     const timer = setTimeout(() => setAlert(null), 6000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [alert]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Organisation" />
      <div className="space-y-6">

        <BasicTableOne
          search={search}
          onSearchChange={setSearch}
          fetchFunction={getAllOrganisation}
          handleCreate={handleCreate}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          tableTitle="Organisation Directory"
          emptyRow={{
            id: "",
            name: "",
            admin: { id: "", name: "", email: "" },
            adminPassword: "",
          }}

          transformRowForEdit={(row) => {
            const admin = row.users?.[0] ?? {};
            return {
              id: row.id,
              name: row.name,
              admin: {
                id: admin.id || "",
                name: admin.name || "",
                email: admin.email || "",
              },
              adminPassword: "",
            };
          }}

          transformCreateResponse={(data) => ({
            id: data.organization.id,
            name: data.organization.name,
            createdAt: data.organization.createdAt,
            users: [{
              id: data.admin.id,
              name: data.admin.name,
              email: data.admin.email,
            }],
          })}

          transformEditResponse={(rows, data) =>
            rows.map((row) =>
              row.id !== data.organization.id ? row : {
                ...row,
                name: data.organization.name,
                users: [{
                  ...row.users?.[0],
                  id: data.admin.id,
                  name: data.admin.name,
                  email: data.admin.email,
                }],
              }
            )
          }

          modalCreateTitle="Create Organization"
          modalEditTitle="Edit Organization"
          modalCreateLabel="Create Organization"
          modalEditLabel="Update Organization"

          modalFields={(selectedRow, setSelectedRow) => (
            <>
              <NormalInputField
                label="Organization Name"
                type="text"
                placeholder="Enter organization name"
                value={selectedRow.name}
                required
                onChange={(e) =>
                  setSelectedRow((prev: any) => ({ ...prev, name: e.target.value }))
                }
              />
              <NormalInputField
                label="Admin Name"
                type="text"
                placeholder="Enter admin name"
                value={selectedRow.admin?.name || ""}
                required
                onChange={(e) =>
                  setSelectedRow((prev: any) => ({
                    ...prev,
                    admin: { ...prev.admin, name: e.target.value },
                  }))
                }
              />
              <NormalInputField
                label="Admin Email"
                type="email"
                placeholder="Enter admin email"
                value={selectedRow.admin?.email || ""}
                autoComplete="new-email"
                required
                onChange={(e) =>
                  setSelectedRow((prev: any) => ({
                    ...prev,
                    admin: { ...prev.admin, email: e.target.value },
                  }))
                }
              />
              <PasswordInputField
                label="New Password"
                placeholder="Enter new password"
                value={selectedRow.adminPassword || ""}
                autoComplete="new-password"
                onChange={(e) =>
                  setSelectedRow((prev: any) => ({
                    ...prev,
                    adminPassword: e.target.value,
                  }))
                }
              />
            </>
          )}

          buttons={(openCreateModal) => (
            <>
              <button
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20"
                onClick={openCreateModal}
              >
                <Plus size={18} />
                <span>Create Organisation</span>
              </button>
              <button
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20"
                onClick={() => router.push("/branch/create")}
              >
                <Plus size={18} />
                <span>Create Branch</span>
              </button>
            </>
          )}

          columns={[
            { key: "name", label: "Organisation Name", render: (row) => row.name ?? "—" },
            { key: "admin", label: "Admin Name", render: (row) => row.users[0]?.name ?? "—" },
            { key: "email", label: "Admin email", render: (row) => row.users[0]?.email ?? "—" },
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
          ]}
        />
      <Snackbar
        show={snackbar.show}
        type={snackbar.variant}
        message={snackbar.message}
        onClose={() => setSnackbar((s) => ({ ...s, show: false }))}
      />      </div>
    </div>
  );
}