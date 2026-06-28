// hooks/useQuestionBankActions.ts
import axios from "axios"
import { createQuestionBank, deleteQuestionBank, updateQuestionBank } from "@/shared/question-bank"

export type SnackbarState = {
  show: boolean
  variant: "success" | "error" | "warning" | "info"
  message: string
}

export type FieldErrors = {
  jobId?: string
  title?: string
  description?: string
  count?: string
  difficulty?: string
  types?: string
}

export function validateQBankForm(data: any): FieldErrors {
  const errors: FieldErrors = {}
  if (!data.jobId)                errors.jobId       = "Please select a job."
  if (!data.title?.trim())        errors.title       = "Title is required."
  if (!data.description?.trim())  errors.description = "Description is required."
  if (data.mode === "AI") {
    if (!data.config?.count || Number(data.config.count) < 1)
                                  errors.count       = "Enter at least 1 question."
    if (!data.config?.difficulty) errors.difficulty  = "Please select a difficulty."
    if (!data.config?.types?.length) errors.types    = "Select at least one type."
  }
  return errors
}

export function useQuestionBankActions(setSnackbar: (s: SnackbarState) => void) {

  const showSnackbar = (variant: SnackbarState["variant"], message: string) => {
    setSnackbar({ show: false, variant, message })
    setTimeout(() => setSnackbar({ show: true, variant, message }), 50)
  }

  const handleCreate = async (data: any) => {
    try {
      const payload = data.mode === "AI"
        ? {
            jobId: data.jobId, title: data.title, description: data.description, mode: data.mode,
            config: { count: Number(data.config.count), difficulty: data.config.difficulty, types: data.config.types },
          }
        : { jobId: data.jobId, title: data.title, description: data.description, mode: data.mode }

           const response = await createQuestionBank(payload)

      showSnackbar("success", "Question Bank created successfully")
      return response.data.data
    } catch (error: any) {
      showSnackbar("error", error?.response?.data?.message || error?.response?.data?.error || "Something went wrong")
      return null
    }
  }

  const handleEdit = async (data: any) => {
    try {
      // const response = await axios.patch(
      //   `${process.env.NEXT_PUBLIC_API_URL}/question-bank/${data.id}`,
      //   { jobId: data.jobId, title: data.title, description: data.description },
      //   { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      // )

       const response = await updateQuestionBank(data.id, {
        jobId: data.jobId,
        title: data.title,
        description: data.description,
      })
      showSnackbar("success", "Question Bank updated successfully")
      return response.data.data
    } catch (error: any) {
      showSnackbar("error", error?.response?.data?.message || error?.response?.data?.error || "Something went wrong")
      return null
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteQuestionBank(id)
      showSnackbar("success", "Question Bank deleted successfully")
      return response.data
    } catch (error: any) {
      showSnackbar("error", error?.response?.data?.message || error?.response?.data?.error || "Failed to delete")
      return null
    }
  }

  return { handleCreate, handleEdit, handleDelete }
}

