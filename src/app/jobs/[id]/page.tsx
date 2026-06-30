import { JobDetailsClient } from "./job-details-client";

export function generateStaticParams() {
  return [
    { id: "job-001" },
    { id: "job-002" },
    { id: "job-003" },
    { id: "job-004" },
    { id: "job-005" },
    { id: "job-006" },
    { id: "job-007" },
    { id: "job-008" }
  ];
}

export default async function JobDetailsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <JobDetailsClient id={id} />;
}
