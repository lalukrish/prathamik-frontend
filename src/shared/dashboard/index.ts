import api from "@/lib/axios";

export const getDashboardData = async () => {
  try {
    const response = await api.get("/dashboard");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    throw error;
  }
};

import axiosInstance from "@/lib/axios";

export const getDashboardStats = async () => {
  const response = await axiosInstance.get("/dashboard/stats");
  return response.data;
};

export const getAttendedTests = async () => {
  const response = await axiosInstance.get("/dashboard/tests");
  return response.data;
};

export const getTestResult = async (sessionId: string) => {
  const response = await axiosInstance.get(`/dashboard/tests/${sessionId}`);
  return response.data;
};

export const getInProgressTests = async () => {
  const response = await axiosInstance.get("/dashboard/in-progress");
  return response.data;
};