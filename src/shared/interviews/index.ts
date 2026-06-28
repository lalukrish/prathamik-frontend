import api from "@/lib/axios";

export const scheduleInterview = async ({
  applicationId,
  questionBankId,
  scheduledStartAt,
}: {
  applicationId: string;
  questionBankId: string;
  scheduledStartAt: string;
}) => {
  try {
    const response = await api.post("/interviews/schedule", {
      applicationId,
      questionBankId,
      scheduledStartAt,
    });

    return response.data;
  } catch (error) {
    console.error("Error scheduling interview:", error);
    throw error;
  }
};

export const rescheduleInterview = async ({
  interviewId,
  questionBankId,
  scheduledStartAt,
  reason,
}: {
  interviewId: string;
  questionBankId: string;
  scheduledStartAt: string;
  reason?: string;
}) => {
  try {
    const response = await api.post(
      `/interviews/${interviewId}/reschedule`,
      {
        questionBankId,
        scheduledStartAt,
        reason,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error rescheduling interview:", error);
    throw error;
  }
};


export const cancelInterview = async ({
  interviewId,
  reason,
}: {
  interviewId: string;
  reason: string;
}) => {
  try {
    const response = await api.post(
      `/interviews/${interviewId}/cancel`,
      { reason }
    );

    return response.data;
  } catch (error) {
    console.error("Error cancelling interview:", error);
    throw error;
  }
};

export const getInterviewScheduleHistory = async (
  applicationId: string
) => {
  try {
    const response = await api.get(
      `/interviews/${applicationId}/schedule-history`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching interview schedule history:",
      error
    );
    throw error;
  }
};