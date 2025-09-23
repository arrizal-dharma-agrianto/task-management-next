'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CircleCheckBig, MessageSquareOff, MessageSquareText, Save } from "lucide-react";
import TaskChat from "./task-chat";
import { useEffect, useState } from "react";
import { getTaskById } from "@/service/task";
import Quill from "./quill";
import { useRef } from "react";
import { updateTask } from "@/service/task";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Loading } from "./ui/loading";
import { getStatusesByProjectId } from "@/service/status";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import TaskDetailDue from "./task-detail-due";
import { getPrioritiesByProjectId } from "@/service/priority";
import TaskDetailAssignee from "./task-detail-assignee";
import { useDispatch, useSelector } from "react-redux";
import { clearBreadcrumbs, setBreadcrumbs } from "@/store/slices/position";
import TaskDetailAttachment from "./task-detail-attachment";
import { postLogProject } from "@/service/project";
import { RootState } from "@/store/store";

export default function TaskDetail({ id }: { id: string }) {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.id)

  const [task, setTask] = useState<any>(null);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [priorities, setPriorities] = useState<any[]>([]);
  const [chatOpen, setChatOpen] = useState(false);

  const isFirstLoad = useRef(true);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const isEditing = useRef(false);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");

  useEffect(() => {
    dispatch(clearBreadcrumbs());

    const fetchTask = async () => {
      const res = await getTaskById(id);
      if (!res) {
        console.error("Task not found");
        router.push("/404");
        return;
      }
      setTask(res);
      setCurrentTitle(res.title);
      setCurrentDescription(res.description || "");

      dispatch(setBreadcrumbs([
        {
          name: "Dashboard",
          id: "dashboard",
          url: "/dashboard",
        },
        {
          name: res.project.workspace.name,
          id: res.project.workspace.id,
          url: `/workspace/${res.project.workspace.id}`,
        },
        {
          name: res.project.name,
          id: res.project.id,
          url: `/project/${res.project.id}`,
        },
        {
          name: res.title,
          id: res.id,
          url: `/task/${res.id}`,
        },
      ]));

      if (!res) {
        router.push("/404");
      }

      const statusses = await getStatusesByProjectId(res.project.id);
      setStatuses(statusses);
      const priorities = await getPrioritiesByProjectId(res.project.id);
      setPriorities(priorities);
    }

    fetchTask();
    isFirstLoad.current = true;
  }, [dispatch, id, router]);

  // Debounced update effect
  useEffect(() => {
    if (!task) return;
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    if (isEditing.current) {
      return;
    }

    console.log("Updating task");


    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(async () => {
      const res = await updateTask(id, task)
      console.log("Task updated", res);
      if (!res) {
        console.error("Failed to update task");
        return;
      }

      await postLogProject({
        userId,
        projectId: res.new.projectId,
        action: res.action,
        taskId: res.new.id,
      });

    }, 300);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);


  const handleUpdateDueDate = (date: Date | undefined) => {
    if (!date) {
      setTask((prev: any) => ({ ...prev, dueDate: null }));
      return;
    }
    setTask((prev: any) => ({ ...prev, dueDate: date.toISOString() }));
  }

  const handleUpdateAssignees = (assignees: string[]) => {
    setTask((prev: any) => ({
      ...prev,
      assignees,
    }));
  }

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask((prev: any) => ({ ...prev, title: e.target.value }));
  }

  return (
    <div className="flex gap-2 justify-between bg-gray-100 p-4" style={{ height: "calc(100vh - 64px)" }}>
      <Card className="w-full shadow-lg flex-1 flex flex-row gap-6 h-full">
        {/* Left: Task Details */}
        <div className="flex-1 flex flex-col h-full">
          <CardHeader className="sticky top-0 z-10 rounded-t-xl bg-white/90 backdrop-blur shadow-b shadow-sm px-6 py-4">
            <CardTitle className="text-2xl flex items-center gap-3 justify-between">
              <Button
                onClick={() => { router.push(`/project/${task?.project.id}`) }}
              >
                {task ? <ArrowLeft className="w-4 h-4" /> : <Loading />}
              </Button>
              {task ? (
                <input
                  type="text"
                  value={task.title}
                  onChange={handleChangeName}
                  className="bg-transparent border-none outline-none text-2xl font-bold w-full flex-grow"
                  placeholder="Task Title"
                  onFocus={() => {
                    isEditing.current = true;
                  }}
                  onBlur={() => {
                    isEditing.current = false;
                    if (task.title.trim() === "") {
                      setTask((prev: any) => ({ ...prev, title: "Untitled Task" }));
                    } else {
                      if (task.title.trim() === currentTitle.trim()) return;
                      setTask((prev: any) => ({ ...prev, title: task.title.trim() }));
                    }
                  }}
                />
              ) : (
                <div className="flex-grow">
                  <div className="h-8 max-w-56 bg-gray-200 rounded animate-pulse" />
                </div>
              )}
              {isEditing.current ? (
                <span
                  className="cursor-pointer text-muted-foreground inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground p-2"
                >
                  <Save className="w-4 h-4" />
                </span>
              ) : (
                <span className="text-green-600 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input shadow-sm bg-background text-accent-foreground p-2 disabled">
                  <CircleCheckBig className="w-4 h-4" />
                </span>
              )}
              <Button
                variant='outline'
                onClick={() => setChatOpen(!chatOpen)}
              >
                {chatOpen ? (
                  <MessageSquareOff className="w-4 h-4" />
                ) : (
                  <MessageSquareText className="w-4 h-4" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent key="84738rtf7ygfufgugyu" className="space-y-6 flex-1 overflow-auto pt-4">
            {/* Project & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label className="text-muted-foreground">Project</Label>
                {task ? (
                  <div>{task.project.name}</div>
                ) : (
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground mb-1">Status</Label>
                {!task ? (
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                ) : task.role !== "ADMIN" && task.role !== "OWNER" ? (
                  <div>{task.status.name}</div>
                ) : (
                  <Select
                    value={task?.status.id}
                    onValueChange={
                      (value) => {
                        setTask((prev: any) => ({
                          ...prev,
                          status: statuses.find((s) => s.id === value),
                          statusId: value,
                        }));
                      }
                    }
                  >
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem
                          key={status.id}
                          value={status.id}
                        >
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {/* Priority & Due*/}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground mb-1">Priority</Label>
                {!task ? (
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                ) : task.role !== "ADMIN" && task.role !== "OWNER" ? (
                  <div>{task.priority?.name || "-"}</div>
                ) :
                  <Select
                    value={task?.priority?.id || ""}
                    onValueChange={
                      (value) => {
                        setTask((prev: any) => ({
                          ...prev,
                          priority: priorities.find((p) => p.id === value) || null,
                          priorityId: value,
                        }));
                      }
                    }
                  >
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem
                          key={priority.id}
                          value={priority.id}
                        >
                          {priority.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                }
              </div>

              <TaskDetailDue
                task={task}
                date={task?.dueDate || new Date()}
                onUpdateDueDate={handleUpdateDueDate}
              />
            </div>

            <div className="flex items-center gap-2">
              {task ? (
                <TaskDetailAssignee role={task.role} id={task?.project.id} assignees={task?.assignees} onUpdate={handleUpdateAssignees} />
              ) : (
                <div className="w-full max-w-[280px]">
                  <Label className="text-muted-foreground">Assignee</Label>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 animate-pulse" />
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 animate-pulse" />
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 animate-pulse" />
                    </div>
                    <div className="flex-1 h-6 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse ml-2" />
                  </div>
                </div>
              )}
            </div>
            <Separator />

            {/* Description */}
            <div>
              <Label className="text-muted-foreground">Description</Label>
              {task
                ? (task.role !== "ADMIN" && task.role !== "OWNER") ? (
                    <div
                    className="mt-2 text-gray-700 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: task.description || "<span class='text-gray-400'>No description</span>",
                    }}
                    />
                ) : (
                  <Quill
                    value={task?.description || ""}
                    onChange={(value) => setTask((prev: any) => ({ ...prev, description: value }))}
                    onFocus={() => {
                      isEditing.current = true;
                    }}
                    onBlur={() => {
                      isEditing.current = false;
                      if ((task.description || "").trim() === "") {
                        setTask((prev: any) => ({ ...prev, description: "" }));
                      } else {
                        console.log("Saving description", task.description);
                        console.log("Current description", currentDescription);
                        if ((task.description || "").trim() === currentDescription.trim()) return;
                        setTask((prev: any) => ({ ...prev, description: (task.description || "").trim() }));
                      }
                    }}
                  />
                ) : (
                  <>
                    <div className="h-8 bg-gray-200 mt-2 rounded animate-pulse" />
                    <div className="h-60 bg-gray-200 mt-1 rounded animate-pulse" />
                  </>
                )
              }
            </div>

            <Separator />
            <div>
              <h4 className="text-md font-semibold mb-2">Attachments</h4>
              {task ? (
                <TaskDetailAttachment role={task.role} attachment={task.attachments} taskId={task.id} />
              ) : (
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div className="flex flex-col gap-1" key={i}>
                      <div
                        className="h-24 w-24 bg-gray-200 rounded animate-pulse"
                      />
                      <div
                        className="h-8 w-24 bg-gray-200 rounded animate-pulse"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Card >
      <div className="flex flex-col gap-2 w-fit">
        {task && chatOpen && <TaskChat role={task.role} taskId={task?.id} />}
      </div>
    </div >
  )
}