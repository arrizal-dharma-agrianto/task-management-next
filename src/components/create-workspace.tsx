"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Loading } from "./ui/loading"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { addWorkspace } from "@/store/slices/navigationSlice";
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function CreateWorkspace({ onSuccess }: { onSuccess?: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const [workspaceName, setWorkspaceName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkspaceName(e.target.value)
  }

  const handleCreateWorkspace = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/workspace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: workspaceName,
          ownerId: user.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        dispatch(addWorkspace(data));
        toast.success(`Workspace "${workspaceName}" created successfully!`);
        router.push(`/workspace/${data.id}`);
        onSuccess?.();
      }

      if (!res.ok) {
        setIsLoading(false)
        alert("Something went wrong");
      }

    } catch (error) {
      console.error("Error creating workspace:", error)
    }
  }

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Add Workspace</h4>
        <p className="text-sm text-muted-foreground">
          Create new cool workspace.
        </p>
      </div>
      <div className="grid gap-2">
        <div className="flex flex-col space-y-2">
          <Input
            id="width"
            placeholder="Workspace Name"
            className="col-span-2 h-8"
            value={workspaceName}
            onChange={handleChange}
            autoComplete="off"
            disabled={isLoading}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && workspaceName !== '') {
                e.preventDefault();
                handleCreateWorkspace();
              }
            }}
          />
        </div>
        <Button onClick={handleCreateWorkspace} disabled={isLoading || workspaceName === ''} className="w-full">
          {isLoading ? <Loading /> : "Create"}
        </Button>
      </div>
    </div>
  )
}
