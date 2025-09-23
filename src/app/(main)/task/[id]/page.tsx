import TaskDetail from "@/components/task-detail";

type Props = {
  params: { id: string };
};

export default async function TaskPage({ params }: Props) {

  return (
    <TaskDetail id={params.id} />
  );
}
