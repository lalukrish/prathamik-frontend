import api from "@/lib/axios";
import axios from "axios";

type createJobDetails = {
    title: string;
    jdHtml: string;
    requiredSkills: string[];
    niceToHave: string[];
    experienceMin?: number;
    experienceMax?: number;
};

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

export const getJobBySlug = async ({ slug }: { slug: string }) => {
    try {
        const response = await api.get(`/jobs/slug/${slug}`);
        return response.data;
    } catch (error) {
        return "";
    }
}

export const getJobPublicRoute = async (slug: string) => {
    console.log("sdcdhsbcbs", slug)
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/public/jobs/${slug}`);
    return response.data;
}

export const JobApplying = async (
    formData: FormData,
    jobId: string
) => {
    
    const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/public/apply/${jobId}`,
        formData
    );

    return response.data;
};

export const updateJob = async (jobId: string, details: createJobDetails) => {
    const response = await api.put(`/jobs/${jobId}`, details);
    return response.data;
}

export const deleteJob = async (jobId: string) => {
    const response = await api.delete(`/jobs/${jobId}`);
    return response.data;
}

export const createJob = async (details: createJobDetails) => {
    const response = await api.post(`/jobs`, details);
    return response.data;
}

export const getAllJobsDropDown = async ({
    
    token,
}: {
  
    token: string;
}) => {
    const response = await api.get(
        `/jobs/jobs-dropdown`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    

    return response.data;
};

