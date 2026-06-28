import api from "@/lib/axios";

export const getQuestions = async (
  mockTestId: string,
) => {
  const response = await api.get(
    `/mock-question/mock-test/${mockTestId}`,
  );

  return response.data;
};

export const createQuestion = async (
  payload: any,
) => {
  const response = await api.post(
    "/mock-question/",
    payload,
  );

  return response.data;
};

export const deleteQuestion = async (
  id: string,
) => {
  const response = await api.delete(
    `/mock-question/${id}`,
  );

  return response.data;
};