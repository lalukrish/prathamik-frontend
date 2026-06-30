import axiosInstance from "@/lib/axios";


export const getAvailableTests = async () => {
  const response = await axiosInstance.get("/test-session/tests");

  return response.data;
};

export const startTest = async (
  mockTestId: string,
) => {
  const response = await axiosInstance.post(
    `/test-session/start/${mockTestId}`
  );

  return response.data;
};

export const getSession = async (
  sessionId: string,
) => {
  const response = await axiosInstance.get(
    `/test-session/${sessionId}`,
  );

  return response.data;
};

export const pauseTest = async (
  sessionId: string,
) => {
  const response = await axiosInstance.patch(
    `/test-session/pause/${sessionId}`,
  );

  return response.data;
};

export const resumeTest = async (
  sessionId: string,
) => {
  const response = await axiosInstance.patch(
    `/test-session/${sessionId}/resume`,
  );

  return response.data;
};

export const submitAnswer = async (
  sessionId: string,
  questionId: string,
  optionId: string,
) => {
  const response = await axiosInstance.post(
    `/test-session/${sessionId}/answer`,
    {
      questionId,
      optionId,
    },
  );

  return response.data;
};

export const submitTest = async (
  sessionId: string,
) => {
  const response = await axiosInstance.post(
    `/test-session/${sessionId}/submit`,
  );

  return response.data;
};


export const getResult = async (
  sessionId: string,
) => {
  const response = await axiosInstance.get(
    `/results/result/${sessionId}`,
  );
 
  return response.data;
};
 

