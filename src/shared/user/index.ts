
import api from "@/lib/axios";

export const getAllUsers = async ({
  page,
  limit,
  search,
  token,
  role,
}: {
  page: number;
  limit: number;
  search: string;
  token: string;
  role?: string;
}) => {

  const response = await api.get(
    `/user?page=${page}&limit=${limit}&search=${search}&role=${role || ""}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getUserProfile = async (id: string) => {

  const response = await api.get(`/user/${id}`);

  return response.data;
};

export const getRecruitersByOrg = async () => {

  const response = await api.get(`/user/list/recruiters?status=${true}`);

  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.put(`/user/delete-user/${id}`, { isActive: false });
  return response.data;
};