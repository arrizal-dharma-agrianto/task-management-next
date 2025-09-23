"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Loading } from "./ui/loading"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { addProject } from "@/store/slices/navigationSlice";
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { postLogProject } from "@/service/project"

export function CreateProject({ workspaceId, onSuccess }: { workspaceId: string, onSuccess?: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [projectName, setProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value)
  }

  const handleCreateProject = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName,
          workspaceId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Project created:", data);
        toast.success("Project created successfully");
        dispatch(addProject(data));
        await postLogProject({
          userId: data.userId,
          projectId: data.id,
          action: "CREATE_PROJECT/" + data.name,
        });
        router.push(`/project/${data.id}`);
        setProjectName("");
        onSuccess?.();
      }

      if (!res.ok) {
        setIsLoading(false)
        alert("Something went wrong");
      }

    } catch (error) {
      console.error("Error creating project:", error)
    }
  }

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Add Project</h4>
        <p className="text-sm text-muted-foreground">
          Create new awesome project.
        </p>
      </div>
      <div className="grid gap-2">
        <div className="flex flex-col space-y-2">
          <Input
            onChange={handleChange}
            value={projectName}
            id="width"
            placeholder="Project Name"
            className="col-span-2 h-8"
            autoComplete="off"
            disabled={isLoading}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (projectName.trim() !== '') {
                  handleCreateProject();
                }
              }
            }}
          />
        </div>
        <Button onClick={handleCreateProject} disabled={isLoading || projectName === ''} className="w-full">
          {isLoading ? <Loading /> : "Create"}
        </Button>
      </div >
    </div >
  )
}
