import api from "@/lib/axios";


export const getAllJobs = async ({
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

  console.log("GET ALL JOBS TOKEN =>", token);

  const response = await api.get(
    `/jobs?page=${page}&limit=${limit}&search=${search}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

