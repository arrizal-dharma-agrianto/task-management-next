import { Pen, SquarePen, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TaskCardAction({ id, onDeleteTask, ...props }: { [key: string]: any }) {
  const router = useRouter();
  return (
    <div {...props} onClick={(e) => {
      e.stopPropagation();
    }} className="w-fit p-1 h-8 border absolute bg-white rounded-md m-2 right-0 flex justify-between items-center shadow-md" >
      <div
        className="w-6 h-6 rounded-sm hover:bg-gray-200 items-center flex justify-center"
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/task/${id}`);
        }}
      >
        <SquarePen className="w-4" />
      </div>
      <div
        className="w-6 h-6 rounded-sm hover:bg-gray-200 items-center flex justify-center"
        onClick={(e) => {
          e.stopPropagation();
          onDeleteTask();
        }}
      >
        <Trash className="w-4" />
      </div>
    </div>
  );
}