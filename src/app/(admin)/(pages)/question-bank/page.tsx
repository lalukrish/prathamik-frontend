"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import BasicTableOne from "@/components/tables/BasicTableOne"
import Alert from "@/components/ui/alert/Alert"
import { getAllQuestionBank } from "@/shared/question-bank"
import { getAllJobsDropDown } from "@/shared/jobs"
import { QuestionBankModalFields } from "@/components/question-bank/QuestionBankModalFields"
import { useQuestionBankActions, validateQBankForm, type FieldErrors } from "@/components/question-bank/useQuestionBankActions"
import Snackbar from "@/components/ui/notification"

export default function QuestionBankPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [allJobs, setAllJobs] = useState<any[]>([])
  const [snackbar, setSnackbar] = useState<{
    show: boolean;
    variant: "success" | "error" | "warning" | "info";
    message: string;
  }>({ show: false, variant: "info", message: "" }); 

  const { handleCreate, handleEdit, handleDelete } = useQuestionBankActions(setSnackbar)

  useEffect(() => {
    getAllJobsDropDown({ token: window.localStorage.getItem("token") || "" })
      .then((res) => setAllJobs(res.data || []))
      .catch(console.error)
  }, [])

  // useEffect(() => {
  //   if (!alert) return
  //   const t = setTimeout(() => setAlert(null), 6000)
  //   return () => clearTimeout(t)
  // }, [alert])

  // ── After successful create: navigate to questions page ──
  
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const clearError = (key: keyof FieldErrors) =>
    setFieldErrors((prev) => { const e = { ...prev }; delete e[key]; return e })

  // In handleCreateWithNav — validate before calling the API
  const handleCreateWithNav = async (data: any) => {
    const errors = validateQBankForm(data)
    if (Object.keys(errors).length) {
      setFieldErrors(errors)
      return null   // ← BasicTableOne sees null and keeps the modal open
    }
    setFieldErrors({})
    const result = await handleCreate(data)
    if (result?.id) router.push(`/question-bank/${result.id}`)
    return result
  }

  // Same for edit
  const handleEditWithValidation = async (data: any) => {
    const errors = validateQBankForm(data)
    if (Object.keys(errors).length) {
      setFieldErrors(errors)
      return null
    }
    setFieldErrors({})
    return handleEdit(data)
  }

  // Reset errors when modal closes — pass this wherever BasicTableOne exposes an onClose
  const handleModalClose = () => setFieldErrors({})
  return (
    <div>
      <PageBreadcrumb pageTitle="Question Banks" />
      <div className="space-y-6">
        <BasicTableOne
          search={search}
          onSearchChange={setSearch}
          fetchFunction={getAllQuestionBank}
          handleCreate={handleCreateWithNav}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleView={(row) => router.push(`/question-bank/${row.id}`)}
          emptyRow={{
            jobId: "", title: "", description: "", mode: "MANUAL",
            config: { count: 10, difficulty: "MEDIUM", types: [] },
          }}
          transformRowForEdit={(row) => ({
            id: row.id, jobId: row.jobId ?? "", title: row.title ?? "",
            description: row.description ?? "", mode: row.mode ?? "MANUAL",
            config: { count: row.config?.count ?? 10, difficulty: row.config?.difficulty ?? "MEDIUM", types: row.config?.types ?? [] },
          })}
          transformCreateResponse={(data) => ({
            id: data.id, title: data.title, description: data.description,
            mode: data.mode, totalQuestions: data.totalQuestions ?? 0,
            isActive: data.isActive ?? true, createdAt: data.createdAt,
          })}
          transformEditResponse={(rows, data) =>
            rows.map((row) => row.id !== data.id ? row : {
              ...row, title: data.title, description: data.description,
              mode: data.mode, totalQuestions: data.totalQuestions, isActive: data.isActive,
            })
          }
          modalCreateTitle="Create Question Bank"
          modalEditTitle="Edit Question Bank"
          modalCreateLabel="Create Question Bank"
          modalEditLabel="Update Question Bank"
          modalFields={(selectedRow, setSelectedRow) => (
            <QuestionBankModalFields
              selectedRow={selectedRow}
              setSelectedRow={setSelectedRow}
              allJobs={allJobs}
              errors={fieldErrors}          // ← pass errors
              clearError={clearError}       // ← pass clear
            />
          )}
          buttons={(openCreateModal) => (
            <button
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
              onClick={openCreateModal}
            >
              <Plus size={18} />
              <span>Create Question Bank</span>
            </button>
          )}
          columns={[
            { key: "name", label: "Question Bank Name", render: (row) => row.title ?? "—" },
            { key: "admin", label: "Total Questions", render: (row) => row.totalQuestions ?? "—" },
            {
              key: "mode", label: "Question Mode",
              render: (row: any) => (
                <span className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-medium ${row.mode === "AI" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                  }`}>
                  {row.mode ? row.mode.charAt(0) + row.mode.slice(1).toLowerCase() : "—"}
                </span>
              ),
            },
            {
              key: "status", label: "Status",
              render: (row: any) => {
                const label = row.isActive ? "Active" : "Inactive"
                return (
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${row.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
                    }`}>
                    {label}
                  </span>
                )
              },
            },
            {
              key: "createdAt", label: "Created At",
              render: (row) => row.createdAt
                ? new Date(row.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                : "—",
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
  )
}