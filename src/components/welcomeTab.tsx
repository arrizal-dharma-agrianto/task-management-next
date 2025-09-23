import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setIsWelcome } from "@/store/slices/isWelcome";
import { addProject, addWorkspace } from "@/store/slices/navigationSlice";
import { Loading } from "./ui/loading";
import { postLogProject } from "@/service/project";
import { toast } from "sonner";

export function WelcomeTab() {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const [activeTab, setActiveTab] = useState("welcome");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    workspace: "",
    project: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const workspace = await fetch("/api/workspace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.workspace,
          ownerId: user.id,
        }),
      });
      const workspaceData = await workspace.json();

      if (!workspace.ok) {
        setIsLoading(false);
        alert("Something went wrong");
        window.location.reload();
        throw new Error("Failed to create workspace");
      }

      const project = await fetch("/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.project,
          workspaceId: workspaceData.id,
        }),
      });
      const projectData = await project.json();

      if (!project.ok) {
        setIsLoading(false);
        alert("Something went wrong");
        window.location.reload();
        throw new Error("Failed to create project");
      }

      if (workspace.ok && project.ok) {
        dispatch(addWorkspace(workspaceData));
        dispatch(addProject(projectData));
        dispatch(setIsWelcome(false));
        toast.success("Workspace and project created successfully!");
        await postLogProject({
          userId: user.id,
          projectId: projectData.id,
          action: "CREATE_PROJECT/" + projectData.name,
        });
      }

    } catch (error) {
      console.error(error);
      alert("An error occurred while creating the workspace.");
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="welcome" disabled={isLoading}>Welcome</TabsTrigger>
        <TabsTrigger value="workspace" disabled={isLoading} >Workspace</TabsTrigger>
        <TabsTrigger value="project" disabled={!data.workspace}>Project</TabsTrigger>
      </TabsList>
      <TabsContent value="welcome" className="flex-1">
        <Card className="border-none shadow-none h-full flex flex-col justify-between">
          <p className="px-4 py-6 text-center font-medium text-muted-foreground">
            Welcome to CC Task Management! Let&apos;s get you started by setting up your workspace and creating your first project.
            Organize, plan, and achieve more with ease!
          </p>
          <CardFooter className="justify-end p-0">
            <Button onClick={() => setActiveTab("workspace")}>Next</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="workspace" className="flex-1">
        <Card className="border-none shadow-none h-full flex flex-col justify-between">
          <div className="space-y-2 my-5">
            <p className="font-medium text-muted-foreground">
              Create a new workspace to organize your projects and tasks effectively.
            </p>
            <div className="space-y-1">
              <Label htmlFor="workspace">New Workspace<span className="text-red-500">*</span></Label>
              <Input
                id="workspace"
                name="workspace"
                onChange={handleInputChange}
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && data.workspace) {
                    setActiveTab("project");
                  }
                }}
                placeholder="Enter workspace name"
                value={data.workspace}
                autoComplete="off"
                autoFocus
              />
            </div>
          </div>
          <CardFooter className="justify-between p-0">
            <Button onClick={() => setActiveTab("welcome")}>Back</Button>
            <Button disabled={!data.workspace} onClick={() => setActiveTab("project")}>Next</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="project" className="flex-1">
        <Card className="border-none shadow-none flex flex-col justify-between h-full">
          <div className="space-y-2 my-5">
            <p className="font-medium text-muted-foreground">
              Create a new project within your workspace to manage tasks efficiently.
            </p>
            <div className="space-y-1">
              <Label htmlFor="project">New Project<span className="text-red-500">*</span></Label>
              <Input
                id="project"
                name="project"
                onChange={handleInputChange}
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && data.project && !isLoading) {
                    handleSubmit();
                  }
                }}
                placeholder="Enter project name"
                value={data.project}
                autoComplete="off"
                autoFocus
              />
            </div>
          </div>
          <CardFooter className="justify-between p-0">
            <Button disabled={isLoading} onClick={() => setActiveTab("workspace")}>Back</Button>
            <Button disabled={!data.workspace || !data.project || isLoading} onClick={handleSubmit}>
              {isLoading ? <Loading /> : "Finish"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs >
  );
}
