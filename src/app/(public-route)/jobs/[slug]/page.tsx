import JobDetailsViewer from "@/components/jobs/jobDetailsViewer";

interface Props {
  params: Promise<{ slug: string }>
}


export default async function JobDetailsPage({ params }: Props) {
    const { slug } = await params;

    return <JobDetailsViewer job={slug} />;
}