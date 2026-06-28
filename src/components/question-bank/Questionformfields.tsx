'use client'

import { QuestionForm, FormErrors, QuestionType, Difficulty, TYPE_OPTIONS, DIFFICULTY_OPTIONS } from "./types"
import { TypeBadge, DifficultyBadge } from "./Badges"

// These imports are from your existing shared form components
import {
  TextareaField,
  SelectField,
  NormalInputField,
  TagsInputField,
} from "../form/formFields"

export function OptionsEditor({ options, onChange }: { options: string[]; onChange: (opts: string[]) => void }) {
  const add    = () => onChange([...options, ""])
  const remove = (i: number) => onChange(options.filter((_, idx) => idx !== i))
  const update = (i: number, val: string) => onChange(options.map((o, idx) => (idx === i ? val : o)))

  return (
    <div className="col-span-2 space-y-2">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Options</p>
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <NormalInputField
            value={opt}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => update(i, e.target.value)}
            placeholder={`Option ${i + 1}`}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="flex-shrink-0 w-8 h-9 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors mt-1"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add Option
      </button>
    </div>
  )
}

export function QuestionFormFields({
  form,
  setField,
  errors = {},
}: {
  form: QuestionForm
  setField: <K extends keyof QuestionForm>(key: K, value: QuestionForm[K]) => void
  errors?: FormErrors
}) {
  const hasOptions = form.type === "RADIO" || form.type === "MULTIPLE_SELECT"
  const hasAudio   = form.type === "VOICE_TYPE"

  return (
    <>
      <div className="col-span-2">
        <TextareaField
          label="Question"
          required
          rows={3}
          value={form.question}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setField("question", e.target.value)}
          placeholder="Enter the question…"
        />
        {errors.question && <p className="mt-1 text-xs text-red-500 font-medium">{errors.question}</p>}
      </div>

    <div>
  <SelectField
    label="Question Type"
    required
    options={TYPE_OPTIONS}
    value={form.type}
    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
      setField("type", e.target.value as QuestionType)
    }}
  />
  {errors.type && <p className="mt-1 text-xs text-red-500 font-medium">{errors.type}</p>}  {/* ← add */}
</div>

    <div>
  <SelectField
    label="Difficulty"
    required
    options={DIFFICULTY_OPTIONS}
    value={form.difficulty}
    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setField("difficulty", e.target.value as Difficulty)}
  />
  {errors.difficulty && <p className="mt-1 text-xs text-red-500 font-medium">{errors.difficulty}</p>}  {/* ← add */}
</div>
      <div>
        <NormalInputField
          className="no-spinner"
          label="Marks (Weight)"
          required
          type="number"
          min={1}
          max={100}
          value={form.weight}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("weight", Number(e.target.value))}
        />
        {errors.weight && <p className="mt-1 text-xs text-red-500 font-medium">{errors.weight}</p>}
      </div>

      {/* ── Time Limit ── */}
      <div>
        <NormalInputField
          className="no-spinner"
          label="Time Limit (seconds)"
          required
          type="number"
          min={10}
          max={3600}
          value={form.timeLimitSeconds}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("timeLimitSeconds", Number(e.target.value))}
        />
        {errors.timeLimitSeconds && <p className="mt-1 text-xs text-red-500 font-medium">{errors.timeLimitSeconds}</p>}
        {/* Helper: show friendly format */}
        {form.timeLimitSeconds >= 10 && (
          <p className="mt-1 text-[11px] text-slate-400">
            = {Math.floor(form.timeLimitSeconds / 60) > 0 ? `${Math.floor(form.timeLimitSeconds / 60)}m ` : ""}
            {form.timeLimitSeconds % 60 > 0 ? `${form.timeLimitSeconds % 60}s` : ""}
          </p>
        )}
      </div>

      <div>
        <TagsInputField
          label="Skill Tags"
          placeholder="Type a skill and press Enter or comma…"
          value={form.skillTags}
          onChange={(tags: string[]) => setField("skillTags", tags)}
        />
      </div>

      {hasOptions && (
        <>
          <OptionsEditor options={form.options} onChange={(opts) => setField("options", opts)} />
          {errors.options && <p className="col-span-2 text-xs text-red-500 font-medium -mt-1">{errors.options}</p>}
        </>
      )}

      {hasAudio && (
        <div className="col-span-2">
          <NormalInputField
            label="Audio URL"
            type="url"
            value={form.audioUrl ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("audioUrl", e.target.value)}
            placeholder="https://…/audio.mp3"
          />
          {errors.audioUrl && <p className="mt-1 text-xs text-red-500 font-medium">{errors.audioUrl}</p>}
        </div>
      )}

      <div className="col-span-2 flex items-center gap-2 pt-2 border-t border-slate-100">
        <span className="text-[11px] text-slate-400 font-medium">Preview:</span>
        <TypeBadge type={form.type} />
        <DifficultyBadge difficulty={form.difficulty} />
        <span className="bg-amber-100 text-amber-800 border border-amber-200 rounded-md px-2.5 py-0.5 text-xs font-bold font-mono">
          {form.weight} pts
        </span>
        <span className="bg-sky-50 text-sky-700 border border-sky-200 rounded-md px-2.5 py-0.5 text-xs font-semibold">
          ⏱ {form.timeLimitSeconds}s
        </span>
      </div>
    </>
  )
}