// src/services/mock-test.service.ts

import axiosInstance from "@/lib/axios";

// export const createMockTest = async (payload: {
//   title: string;
//   description?: string;
//   duration: number;
//   totalMarks: number;
// }) => {
//   const response = await axiosInstance.post("/mock-tests", payload);
//   return response.data;
// };

export const createMockTest = (
  data: FormData,
) => {
  return axiosInstance.post(
    "/mock-tests",
    data,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    },
  );
};

export const getAllMockTests = async () => {
  const response = await axiosInstance.get("/mock-tests");
  return response.data.data;
};

export const getMockTestById = async (id: string) => {
  const response = await axiosInstance.get(`/mock-tests/${id}`);
  return response.data;
};

// export const updateMockTest = async (
//   id: string,
//   payload: {
//     title?: string;
//     description?: string;
//     duration?: number;
//     totalMarks?: number;
//   }
// ) => {
//   const response = await axiosInstance.put(`/mock-tests/${id}`, payload);
//   return response.data;
// };
export const updateMockTest = async (
  id: string,
  payload: FormData
) => {
  const response = await axiosInstance.put(
    `/mock-tests/${id}`,
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteMockTest = async (id: string) => {
  const response = await axiosInstance.delete(`/mock-tests/${id}`);
  return response.data;
};