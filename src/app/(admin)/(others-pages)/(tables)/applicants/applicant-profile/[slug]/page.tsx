'use client'
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { getCandidateById } from "@/shared/candidates";
import type { InterviewFormData } from "@/components/application-form/ScheduleInterviewModal";
import { ApplicantProfileView } from "@/components/application-form/ApplicantProfileView";
import type { ApiResponse, ApplicationStatus, ModalType, InterviewData } from "@/components/application-form/applican-profile/types";
import { CancelInterviewModal } from "@/components/application-form/CancelInterviewModal";
import { getQuestionBanksByJobId } from "@/shared/question-bank";
import { cancelInterview, rescheduleInterview, scheduleInterview } from "@/shared/interviews";
import { updateApplicationStatus } from "@/shared/applications";
import Snackbar from "@/components/ui/notification";

export default function ApplicantProfile() {
  const params = useParams();
  const applicantId = params?.slug as string;
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<ApplicationStatus>("APPLIED");
  const [statusOpen, setStatusOpen] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);
  const [notes, setNotes] = useState("");
  const [pendingStatus, setPendingStatus] = useState<ApplicationStatus | null>(null);
  const [questionBankOptions, setQuestionBankOptions] = useState<{ label: string; value: string }[]>([]);
  const [interviewData, setInterviewData] = useState<InterviewData[] | null>(null); 
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isReschedule, setIsReschedule] = useState(false); 
  const [alert, setAlert] = useState<{ message: string; type: "error" | "success" } | null>(null);
  const [isSchedulingInterview, setIsSchedulingInterview] = useState(false);
  

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

const fetchApplicant = useCallback(async (silent = false) => {
  if (!silent) setLoading(true);
  try {
    const res = await getCandidateById(applicantId);
    setData(res.data);
    setStatus(res.data.status as ApplicationStatus);
    setNotes(res.data.candidate?.notes ?? "");
    if (res.data.interviews) setInterviewData(res.data.interviews);
  } catch (error) {
    console.error("Failed to fetch applicant", error);
  } finally {
    if (!silent) setLoading(false);
  }
}, [applicantId]);

useEffect(() => {
  if (applicantId) fetchApplicant();
}, [applicantId, fetchApplicant]);
  
  useEffect(() => {
  if (!data?.jobId) return;

  const fetchQuestionBanks = async () => {
    try {
      const res = await getQuestionBanksByJobId(data.jobId!);

      setQuestionBankOptions(
        res.data.map((qb: { id: string; title: string }) => ({
          label: qb.title,
          value: qb.id,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch question banks", err);
    }
  };

  fetchQuestionBanks();
}, [data?.jobId]);

  
  const handleStatusChange = (newStatus: ApplicationStatus) => {
    setStatusOpen(false);
    setTimeout(() => {
      if (newStatus === "INTERVIEW") {
        setIsReschedule(false); 
        setPendingStatus(newStatus);
        setModal("interview");
      } else {
        applyStatusChange(newStatus);
      }
    }, 0);
  };

  const applyStatusChange = async (newStatus: ApplicationStatus) => {
    setStatus(newStatus);
    try {
    await updateApplicationStatus(
      applicantId,
      newStatus
    );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };



const handleInterviewConfirm = async (formData: InterviewFormData) => {
  setModal(null);

  if (isReschedule) {
    try {
      const interviewId = interviewData?.[0]?.id;
      if (!interviewId) { setIsReschedule(false); return; }

      setIsSchedulingInterview(true);
      await rescheduleInterview({
        interviewId,
        questionBankId: formData.questionBankId,
        scheduledStartAt: new Date(`${formData.date}T${formData.time}`).toISOString(),
        reason: formData.rescheduleReason,
      });
      // ✅ no setInterviewData, just refetch
      await fetchApplicant(true);
            showSnackbar("success", "Interview rescheduled successfully");

    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to reschedule interview.";
      setAlert({ message: msg, type: "error" });
            showSnackbar("error", msg);

    } finally {
      setIsSchedulingInterview(false);
      setIsReschedule(false);
    }
    return;
  }

  // Fresh schedule
  if (pendingStatus) {
    if (pendingStatus !== "INTERVIEW") await applyStatusChange(pendingStatus);
    setStatus(pendingStatus);

    try {
      setIsSchedulingInterview(true);
      await scheduleInterview({
        applicationId: applicantId,
        questionBankId: formData.questionBankId,
        scheduledStartAt: new Date(`${formData.date}T${formData.time}`).toISOString(),
      });
      // ✅ no setInterviewData, just refetch
      await fetchApplicant(true);
            showSnackbar("success", "Interview scheduled! Link is ready");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to schedule interview.";
                  showSnackbar("error",msg);

      // setAlert({ message: msg, type: "error" });
    } finally {
      setIsSchedulingInterview(false);
      setPendingStatus(null);
    }
  }
};

  // ── Cancel interview ──
  const handleCancelInterview = async () => {
    try {
      const interviewId = interviewData?.[0]?.id;
      if (!interviewId) return;
      await cancelInterview({
      interviewId,
      reason: cancelReason,
    });      setInterviewData((prev) =>
        prev?.map((i) => ({ ...i, status: "CANCELLED" as const })) ?? null
      );
      setShowCancelModal(false);
      setCancelReason("");
      // setAlert({ message: "Interview cancelled.", type: "success" });
            showSnackbar("success", "Interview cancelled");

    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to cancel interview.";
    //  setAlert({ message: msg, type: "error" });
                  showSnackbar("error", msg);

    }
  };

  const handleInterviewClose = () => {
    setModal(null);
    setPendingStatus(null);
    setIsReschedule(false); 
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-white text-sm">Loading applicant profile…</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Applicant not found.</p>
      </div>
    );
  }

  return (
    <>
     {/* <AlertBanner
        message={alert?.message ?? null}
        type={alert?.type}
        onDismiss={() => setAlert(null)}
      /> */}
      
            <Snackbar
              show={snackbar.show}
              type={snackbar.variant}
              message={snackbar.message}
              onClose={() => setSnackbar((s) => ({ ...s, show: false }))}
            />
      <ApplicantProfileView
        data={data}
        status={status}
        statusOpen={statusOpen}
        modal={modal}
        notes={notes}
        questionBankOptions={questionBankOptions}
        onStatusToggle={() => setStatusOpen((p) => !p)}
        onStatusChange={handleStatusChange}
        onModalOpen={(m) => setModal(m)}
        onModalClose={() => setModal(null)}
        onNotesChange={setNotes}
        onInterviewConfirm={handleInterviewConfirm}
        onInterviewClose={handleInterviewClose}
        interviewData={interviewData}
        onReschedule={() => {
          setIsReschedule(true);       
          setPendingStatus(null);       
          setTimeout(() => setModal("interview"), 0); 
        }}
        onCancelInterview={() => setShowCancelModal(true)}
        isReschedule={isReschedule}    
        isSchedulingInterview={isSchedulingInterview} 
        onRefetch={fetchApplicant}
      />
      {showCancelModal && (
        <CancelInterviewModal
          cancelReason={cancelReason}
          onReasonChange={setCancelReason}
          onClose={() => { setShowCancelModal(false); setCancelReason(""); }}
          onConfirm={handleCancelInterview}
        />
      )}
    </>
  );
}