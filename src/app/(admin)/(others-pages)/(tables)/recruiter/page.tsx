

"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import Snackbar from "@/components/ui/notification";
import { NormalInputField, PasswordInputField } from "@/components/form/formFields";
import { deleteUser, getAllUsers } from "@/shared/user";
import { getAllOrganisation } from "@/shared/organisation";
import axios from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


type BranchType = {
  id: string;
  name: string;
};

type OrganizationType = {
  id: string;
  name: string;
  branches: BranchType[];
};

export default function RecruiterTable() {
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState<{
    show: boolean;
    variant: "success" | "error" | "warning" | "info";
    message: string;
  }>({ show: false, variant: "info", message: "" });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [organizations, setOrganizations] = useState<OrganizationType[]>([]);
  const [branches, setBranches] = useState<BranchType[]>([]);
  const router = useRouter();

  const showSnackbar = (
    variant: "success" | "error" | "warning" | "info",
    message: string
  ) => {
    setSnackbar({ show: false, variant, message });
    setTimeout(() => setSnackbar({ show: true, variant, message }), 50);
  };

  const validateRecruiter = (data: any, isEdit = false): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!data.name?.trim()) errors.name = "Name is required";
    else if (data.name.trim().length < 2) errors.name = "Name must be at least 2 characters";
    if (!data.email?.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = "Invalid email address";
    if (!isEdit) {
      if (!data.password?.trim()) errors.password = "Password is required";
      else if (data.password.length < 6) errors.password = "Password must be at least 6 characters";
    }
    return errors;
  };

  // fetch organizations once on mount
  useEffect(() => {
    async function fetchOrganizations() {
      try {
        const user = JSON.parse(localStorage.getItem("user") ?? "{}");
        const token = user.token; const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/organizations`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrganizations(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOrganizations();
  }, []);

  function handleOrganizationChange(
    e: React.ChangeEvent<HTMLSelectElement>,
    setSelectedRow: React.Dispatch<React.SetStateAction<any>>
  ) {
    const orgId = e.target.value;

    const selectedOrg = organizations.find(
      (org) => org.id === orgId
    );

    setBranches(selectedOrg?.branches || []);

    setSelectedRow((prev: any) => ({
      ...prev,
      orgId,
      branchId: "",
    }));
  }

  function handleBranchChange(
    e: React.ChangeEvent<HTMLSelectElement>,
    setSelectedRow: React.Dispatch<React.SetStateAction<any>>
  ) {
    const branchId = e.target.value;

    setSelectedRow((prev: any) => ({
      ...prev,
      branchId,
    }));
  }

  const handleCreate = async (data: any) => {
    const errors = validateRecruiter(data, false);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return null;
    }
    setFieldErrors({});

    try {
      const user = JSON.parse(localStorage.getItem("user") ?? "{}");
      const token = user.token;
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: "recruiter",
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/create`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSnackbar("success", "Recruiter created successfully");
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
    const errors = validateRecruiter(data, true);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return null;
    }

    if (data.password?.trim()) {
      if (data.password.trim().length < 6) {
        setFieldErrors({ password: "Password must be at least 6 characters" });
        return null;
      }
    }

    setFieldErrors({});

    try {
      const user = JSON.parse(localStorage.getItem("user") ?? "{}");
      const token = user.token;

      const payload: Record<string, any> = {
        name: data.name,
       // email: data.email,
      };

      if (data.password?.trim()) {
        payload.password = data.password.trim();
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${data.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSnackbar("success", "Recruiter updated successfully");
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
    try {
      await deleteUser(id);
      showSnackbar("success", "Recruiter deleted successfully");
      return true;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong";
      showSnackbar("error", errorMessage);
      return false;
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Recruiters" />

      <div className="space-y-6">
        <BasicTableOne
          search={search}
          onSearchChange={setSearch}
          fetchFunction={(params) => getAllUsers({ ...params, role: "recruiter" })}
          handleCreate={handleCreate}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          tableTitle="Recruiter Directory"
          onModalClose={() => setFieldErrors({})}

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

          modalCreateTitle="Create Recruiter"
          modalEditTitle="Edit Recruiter"
          modalCreateLabel="Create Recruiter"
          modalEditLabel="Update Recruiter"

          modalFields={(selectedRow, setSelectedRow) => (
            <>
              <NormalInputField
                label="Name"
                type="text"
                placeholder="Enter recruiter name"
                value={selectedRow.name}
                required
                error={fieldErrors.name}
                onChange={(e) => {
                  setSelectedRow((prev: any) => ({ ...prev, name: e.target.value }));
                  setFieldErrors((prev) => ({ ...prev, name: "" }));
                }}
              />

              <NormalInputField
                label="Email"
                type="email"
                placeholder="Enter email"
                value={selectedRow.email}
                required
                error={fieldErrors.email}
                  readOnly={!!selectedRow.id}  // readonly only in edit mode

                onChange={(e) => {
                  setSelectedRow((prev: any) => ({ ...prev, email: e.target.value }));
                  setFieldErrors((prev) => ({ ...prev, email: "" }));
                }}
              />

              <PasswordInputField
                label="Password"
                placeholder={selectedRow.id ? "Leave blank to keep current" : "Enter password"}
                value={selectedRow.password}
                autoComplete="new-password"
                error={fieldErrors.password}
                onChange={(e) => {
                  setSelectedRow((prev: any) => ({ ...prev, password: e.target.value }));
                  setFieldErrors((prev) => ({ ...prev, password: "" }));
                }}
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
                <span>Create Recruiter</span>
              </button>
            </>
          )}

          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email", render: (row) => row.email ?? "—" },
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
      </div>

      <Snackbar
        show={snackbar.show}
        type={snackbar.variant}
        message={snackbar.message}
        onClose={() => setSnackbar((s) => ({ ...s, show: false }))}
      />
    </div>
  );
}