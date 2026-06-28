import api from "@/lib/axios";

export const updateApplicationStatus = async (
  applicantId: string,
  status: string
) => {
  try {
    const response = await api.patch(
      `/applications/${applicantId}/status`,
      { status }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
};