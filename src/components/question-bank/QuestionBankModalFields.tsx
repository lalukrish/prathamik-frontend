// components/question-bank/QuestionBankModalFields.tsx
"use client"
import { NormalInputField, RadioField, SearchableSelectField } from "@/components/form/formFields"

interface Props {
  selectedRow: any
  setSelectedRow: (fn: (prev: any) => any) => void
  allJobs: { id: string; title: string }[]
}

interface FieldErrors {
  jobId?: string
  title?: string
  description?: string
  count?: string
  difficulty?: string
  types?: string
}

interface Props {
  selectedRow: any
  setSelectedRow: (fn: (prev: any) => any) => void
  allJobs: { id: string; title: string }[]
  errors?: FieldErrors          // ← add this
  clearError?: (key: keyof FieldErrors) => void  // ← and this
}

const QUESTION_TYPES = ["TEXT", "MULTIPLE_SELECT", "RADIO", "VOICE_SPEAK", "VOICE_TYPE"]

function formatType(type: string) {
  return type.toLowerCase().split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

export function QuestionBankModalFields({ selectedRow, setSelectedRow, allJobs ,errors = {}, clearError }: Props) {
  return (
    <>
    <div><SearchableSelectField
        label="Select Job"
        placeholder="Search job..."
        value={selectedRow.jobId || ""}
onChange={(value) => {
            setSelectedRow((prev: any) => ({ ...prev, jobId: value }))
            clearError?.("jobId")
          }}        options={allJobs.map((job) => ({ label: job.title, value: job.id }))}
      />
              {errors.jobId && <p className="mt-1 text-xs text-red-500">{errors.jobId}</p>}

</div>
      <div>
      <NormalInputField
        label="Title"
        type="text"
        placeholder="Enter question bank title"
        value={selectedRow.title || ""}
        required
 onChange={(e) => {
            setSelectedRow((prev: any) => ({ ...prev, title: e.target.value }))
            clearError?.("title")
          }}      />
                  {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}

      </div>

<div>
      <NormalInputField
        label="Description"
        type="text"
        placeholder="Enter description"
        value={selectedRow.description || ""}
        required
  onChange={(e) => {
            setSelectedRow((prev: any) => ({ ...prev, description: e.target.value }))
            clearError?.("description")
          }}      />
                  {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}

      </div>

      {/* Mode + AI config — CREATE only */}
      {!selectedRow.id && (
        <>
          <RadioField
            label="Mode"
            name="mode"
            value={selectedRow.mode || "MANUAL"}
            onChange={(value) => setSelectedRow((prev: any) => ({ ...prev, mode: value }))}
            options={[
              { label: "AI",     value: "AI"     },
              { label: "Manual", value: "MANUAL" },
            ]}
          />

          {selectedRow.mode === "AI" && (
            <>
            <div>
              <NormalInputField
                label="Question Count"
                type="number"
                placeholder="e.g. 10"
                value={selectedRow.config?.count || ""}
                required
               onChange={(e) => {
                    setSelectedRow((prev: any) => ({ ...prev, config: { ...prev.config, count: e.target.value } }))
                    clearError?.("count")
                  }}
              />
                              {errors.count && <p className="mt-1 text-xs text-red-500">{errors.count}</p>}

              </div>
              <div>

              <SearchableSelectField
                label="Difficulty"
                placeholder="Select difficulty"
                value={selectedRow.config?.difficulty || ""}
              onChange={(value) => {
                    setSelectedRow((prev: any) => ({ ...prev, config: { ...prev.config, difficulty: value } }))
                    clearError?.("difficulty")
                  }}
                options={[
                  { label: "Easy",   value: "EASY"   },
                  { label: "Medium", value: "MEDIUM" },
                  { label: "Hard",   value: "HARD"   },
                ]}

              />
                              {errors.difficulty && <p className="mt-1 text-xs text-red-500">{errors.difficulty}</p>}

              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Question Types
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                {/* <div></div> */}
                <div className="flex flex-wrap gap-2">
                  {QUESTION_TYPES.map((type) => {
                    const selected = selectedRow.config?.types?.includes(type)
                    return (
                      <button
                        type="button"
                        key={type}
                        onClick={() => {
                          const current = selectedRow.config?.types || []
                          const updated = selected
                            ? current.filter((t: string) => t !== type)
                            : [...current, type]
                          setSelectedRow((prev: any) => ({ ...prev, config: { ...prev.config, types: updated } }))
                                                    clearError?.("types")

                        }}
                        className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                          selected
                            ? "bg-brand-500 text-white border-brand-500"
                            : "bg-white text-gray-700 border-gray-300 hover:border-brand-400"
                        }`}
                      >
                        {formatType(type)}
                      </button>
                    )
                  })}
                </div>
                                {errors.types && <p className="mt-1 text-xs text-red-500">{errors.types}</p>}

              </div>
            </>
          )}
        </>
      )}
    </>
  )
}