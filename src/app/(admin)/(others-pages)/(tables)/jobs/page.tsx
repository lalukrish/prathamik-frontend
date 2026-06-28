"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import JobsTable from "@/components/tables/JobsTable";
import Button from "@/components/ui/button/Button";
import { deleteJob, getAllJobs } from "@/shared/jobs";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";



// const user = JSON.parse(localStorage.getItem("user") ?? "{}");
// const isRecruiter = user?.role === "recruiter";

export default function BasicTables() {
  const [search, setSearch] = useState("");
  const router = useRouter();

 const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("user") ?? "{}"
    );
    setUser(storedUser);
  }, []);

  const isRecruiter = user?.role === "recruiter";

  const handleAddJob = () => {
    router.push("/jobs/create");
  };

  const handleEdit = (slug: string) => {
    console.log(slug, "sdsds")
    router.push(`/jobs/edit/${slug}`);
  };

  const handleShare = async (slug: string) => {
    console.log(slug, "slug")
    const url = `${window.location.origin}/jobs/${slug}`;

    try {
      await navigator.clipboard.writeText(url);

      alert("Job link copied successfully!");
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Jobs" />
      <div className="space-y-6">
        <div className="flex justify-end">
          <button
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20"
            aria-label="Add Job"
            onClick={handleAddJob}
          >
            <Plus size={18} />
            <span>Add Job</span>
          </button>
        </div>

        <ComponentCard
          title="Job Listings"
          search={search}
          placeholder="Search jobs..."
          onSearchChange={setSearch}
        >
          <JobsTable
            showActions={!isRecruiter }
            search={search}
            fetchFunction={getAllJobs}
            deleteFunction={deleteJob}
            handleEdit={handleEdit}
            handleDelete={deleteJob}
            handleShare={handleShare}
            columns={[
              {
                key: "title",
                label: "Job Title",
              },
              {
                key: "totalApplicants",
                label: "Total Applicants",
                render: (row: any) => {
                  console.log(row);
                  return row._count?.applications ?? 0;
                },
              },
              {
                key: "status",
                label: "Status",
                render: (row: any) => (
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${row.disabled === false
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-700"
                    }`}>
                    {row.disabled === false ? "Active" : "Inactive"}
                  </span>
                ),
              },
              {
                key: "creator",
                label: "Created By",
                render: (row: any) => row.creator?.name ?? "—",
              },
              {
                key: "createdAt",
                label: "Created At",
                render: (row: any) =>
                  row.createdAt
                    ? new Date(row.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    : "—",
              },
              {
                key: "applicants",
                label: "Applicants",
                render: (row) => (
                  <Button
                    onClick={() =>
                      router.push(`/applicants/${row.id}`)
                    }
                    variant="outline"
                    size="sm"
                  >
                    View
                  </Button>
                ),
              },
            ]}
          />
        </ComponentCard>
      </div>
    </div >
  );
}