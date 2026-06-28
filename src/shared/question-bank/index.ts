import api from "@/lib/axios";

export const getAllQuestionBank = async ({
  page,
  limit,
  search,
  token,
}: {
  page: number;
  limit: number;
  search: string;
  token: string;
}) => {


  const response = await api.get(
    `/question-bank/?page=${page}&limit=${limit}&search=${search}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }, 
    }
  );

  return response.data.result;
};


export const getQuestionsByQBankId = async ({ qstnBankid }: { qstnBankid: string }) => {
    try {
        const response = await api.get(`/question-bank/${qstnBankid}`);
        return response.data;
    } catch (error) {
        return "";
    }
}


export const updateQuestion = async (qstnBankid:string,
  id: string,
  payload: Record<string, unknown>
) => {
  try {
    const response = await api.patch(`/question-bank/${qstnBankid}/questions/${id}`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to update question"
    );
  }
};


export const  addQuestion= async (qstnBankid:string,
  payload: Record<string, unknown>
) => {
  try {
    const response = await api.post(`/question-bank/${qstnBankid}/questions/bulk`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to update question"
    );
  }
};

export const  deleteQuestion= async (qstnBankid:string,
  deleteId:string
) => {
  try {
    const response = await api.delete(`/question-bank/${qstnBankid}/questions/${deleteId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to update question"
    );
  }
};

export const  deleteQuestionBank= async (qstnBankid:string,
) => {
  try {
    const response = await api.delete(`/question-bank/${qstnBankid}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to update question"
    );
  }
};

export const getQuestionBanksByJobId = async (jobId: string) => {
  try {
    const response = await api.get(
      `/question-bank/questions-by-job-id/${jobId}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching question banks:", error);
    throw error;
  }
};

export const createQuestionBank = async (payload: Record<string, unknown>) => {
  try {
    const response = await api.post(`/question-bank`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to create question bank"
    );
  }
};
 
export const updateQuestionBank = async (
  id: string,
  payload: Record<string, unknown>
) => {
  try {
    const response = await api.patch(`/question-bank/${id}`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to update question bank"
    );
  }
};