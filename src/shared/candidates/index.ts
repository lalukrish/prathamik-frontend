import api from "@/lib/axios";



export const getAllCandidates = async ({
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
        `/candidate?page=${page}&limit=${limit}&search=${search}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    

    return response.data.data;
};

export const getJobById = async ({ jobId }: { jobId: string }) => {
    try {
        const response = await api.get(`/jobs/${jobId}`);
        return response.data;
    } catch (error) {
        return "";
    }
}

export const getjobCandidate = async (jobId: string) => {
  try {
    const response = await api.get(`/jobs/${jobId}/candidates`);
    return response.data;
  } catch (error) {
    console.error("Error fetching job candidates:", error);
    throw error;
  }
};

export const getCandidateById = async (applicantId: string) => {
  try {
    const response = await api.get(`/candidate/${applicantId}/application`);
    return response.data;
  } catch (error) {
    console.error("Error fetching candidate application:", error);
    throw error;
  }
};

export const getCandidateParsedData = async (
  applicationId: string
) => {
  const response = await api.get(
    `/candidate/${applicationId}/parsed-data`
  );

  return response.data;
};

export const updateCandidateNotes =async(candidateId:string,notes:string)=>{
    try{
        const response = await api.patch(`/candidate/${candidateId}/notes`,{notes})
        return response.data
    }catch(error){
        console.error("Error updateing candidate notes:",error)
        throw error;
    }
}

export const getCandidateInterviewHistory = async (
  applicationId: string
) => {
  try {
    const response = await api.get(
      `/candidate/${applicationId}/interview-history`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching candidate interview history:",
      error
    );
    throw error;
  }
};