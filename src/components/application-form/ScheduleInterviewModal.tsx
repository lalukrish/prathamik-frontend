'use client'
import { useState } from "react";
import { ModalForm } from "@/components/ui/modal/modalForm";
import { NormalInputField, SearchableSelectField } from "@/components/form/formFields";
import DatePicker from "../form/date-picker";

export interface InterviewFormData {
  date: string;
  time: string;
  mode: string;
  questionBankId: string;
  rescheduleReason?: string;
}

export function ScheduleInterviewModal({
  onConfirm,
  onClose,
  questionBankOptions,
  isReschedule = false,
}: {
  onConfirm: (data: InterviewFormData) => void;
  onClose: () => void;
  questionBankOptions: { label: string; value: string }[];
  isReschedule?: boolean;
}) {
  const [form, setForm] = useState<InterviewFormData>({
    date: "",
    time: "",
    mode: "Online",
    questionBankId: "",
    rescheduleReason: "",
  });

  return (
    <ModalForm
      isOpen={true}
      title={isReschedule ? "Reschedule Interview" : "Schedule Interview"}
      onClose={onClose}
      onSubmit={() => onConfirm(form)}
      submitLabel={isReschedule ? "Confirm Reschedule" : "Confirm & Move to Interview"}
    >
<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Date */}
        <DatePicker
          id="interview-date"
          label="Interview Date"
          mode="single"
          placeholder="Select date"
          onChange={(selectedDates) => {
            if (selectedDates[0]) {
              const d = selectedDates[0];
              const yyyy = d.getFullYear();
              const mm = String(d.getMonth() + 1).padStart(2, "0");
              const dd = String(d.getDate()).padStart(2, "0");
              setForm((p) => ({ ...p, date: `${yyyy}-${mm}-${dd}` }));
            }
          }}
        />

        {/* Time */}
        <NormalInputField
          label="Interview Time"
          type="time"
          value={form.time}
          placeholder="Select time"
          onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
        />

        {/* Question Bank */}
        <SearchableSelectField
          label="Question Bank"
          placeholder="Search question bank..."
          value={form.questionBankId}
          onChange={(val) => setForm((p) => ({ ...p, questionBankId: val }))}
          options={questionBankOptions}
          required
        />

        {/* Reschedule reason — only shown when rescheduling */}
        {isReschedule && (
          <NormalInputField
            label="Reschedule Reason"
            type="text"
            value={form.rescheduleReason ?? ""}
            placeholder="Enter reason for rescheduling"
            onChange={(e) => setForm((p) => ({ ...p, rescheduleReason: e.target.value }))}
          />
        )}

      </div>
    </ModalForm>
  );
}