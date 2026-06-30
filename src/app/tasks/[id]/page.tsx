import { TaskDetailsClient } from "./task-details-client";

export function generateStaticParams() {
  return [
    { id: "task-001" },
    { id: "task-002" },
    { id: "task-003" },
    { id: "task-004" },
    { id: "task-005" },
    { id: "task-006" },
    { id: "task-007" },
    { id: "task-008" },
    { id: "task-009" },
    { id: "task-010" },
    { id: "task-011" },
    { id: "task-012" }
  ];
}

export default async function TaskDetailsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TaskDetailsClient id={id} />;
}
