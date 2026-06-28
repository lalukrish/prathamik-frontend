import axiosInstance from "@/lib/axios";

export const getUsers = async (params?: {
  search?: string;
  status?: string;
  role?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await axiosInstance.get("/users", { params });
  return response.data;
};

export const getUserById = async (userId: string) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
};

export const updateUserStatus = async (
  userId: string,
  status: "ACTIVE" | "BLOCKED"
) => {
  const response = await axiosInstance.patch(`/users/${userId}/status`, { status });
  return response.data;
};

export const updateUserRole = async (
  userId: string,
  role: "ADMIN" | "USER"
) => {
  const response = await axiosInstance.patch(`/users/${userId}/role`, { role });
  return response.data;
};