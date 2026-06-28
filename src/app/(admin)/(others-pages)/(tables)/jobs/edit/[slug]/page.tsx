"use client";

import JobFormSection from "@/components/jobs/JobForm";
import { getJobBySlug } from "@/shared/jobs";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function EditJobPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await getJobBySlug({ slug });
                setJob(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [params.slug]);

    if (loading) {
        return <div className="flex items-center justify-center p-28">Loading...</div>;
    }

    return (
        <JobFormSection
           initialData={{
            ...job,
            recruiters: job.recruiterAssignments?.map(
                (ra: any) => ra.recruiter.id
            ) ?? [],
        }}
            isEdit={true}
            
        />
    );
}