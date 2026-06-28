import api from "@/lib/axios";

export const getSubjects = async (
) => {
  const response = await api.get(
    `/subjects`,
  );

  return response.data;
};