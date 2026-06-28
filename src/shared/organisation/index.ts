import api from "@/lib/axios";

type createJobDetails = {
    title: string;
    jdHtml: string;
    requiredSkills: string[];
    niceToHave: string[];
    experienceMin?: number;
    experienceMax?: number;
};

export const getAllOrganisation = async ({
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
    `/admin/organizations?page=${page}&limit=${limit}&search=${search}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }, 
    }
  );

  return response.data;
};

