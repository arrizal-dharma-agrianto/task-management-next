'use client'

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { clearBreadcrumbs, setBreadcrumbs } from "@/store/slices/position";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Printer, Users } from "lucide-react";
import WorkspaceMembers from "./workspace-members";
import { openSheet } from "@/store/slices/uiSlice";
import { getStaticWorkspaces } from "@/service/workspace";

export default function WorkspaceView() {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const router = useRouter();

  const [projects, setProjects] = useState<any[] | null>(null);
  const [workspaceName, setWorkspaceName] = useState<string>("");

  useEffect(() => {
    dispatch(clearBreadcrumbs());
    const fetchProjects = async () => {
      if (id) {
        try {
          const data: any = await getStaticWorkspaces(id as string);
          dispatch(setBreadcrumbs([
            { name: "Dashboard", id: "dashboard", url: "/dashboard" },
            { name: data.name, id: "workspace", url: `/workspace/${data.id}` }
          ]));
          setProjects(data.projects || []);
          setWorkspaceName(data.name || "");
        } catch (err) {
          // handle error if needed
          console.error(err);
        }
      } else {
        setProjects([]);
      }
    };

    fetchProjects();
    if (!id) setProjects([]);
  }, [dispatch, id]);

  const handleRefresh = () => {
    // Call your fetch function or API here
    router.refresh(); // re-fetch server data if needed
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 pt-2">
      {/* Header with buttons */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{workspaceName}</h2>
        <div className="flex gap-2">
          {/* <Button variant="outline" onClick={handleRefresh}>
            <RefreshCcw className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 " />
            Report
          </Button> */}
          <Button
            variant="outline"
            onClick={() => {
              router.push(`/workspace/${id}`)
              dispatch(openSheet({ isSheetOpen: true, sheetContent: "workspace-members", id }))
            }
            }
          >
            <Users className="w-4 h-4 " />
            Members
          </Button>
        </div>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!projects
          ? Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-xl border p-4 shadow bg-background animate-pulse space-y-4"
            >
              <div className="h-6 bg-muted rounded w-2/3 mb-2" />
              <div className="h-4 bg-muted rounded w-1/3 mb-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 bg-muted rounded w-1/4" />
                  <div className="h-3 bg-muted rounded w-6" />
                </div>
                <div className="flex justify-between">
                  <div className="h-3 bg-muted rounded w-1/4" />
                  <div className="h-3 bg-muted rounded w-6" />
                </div>
              </div>
            </div>
          ))
          : projects.length === 0 ? (
            <div className="text-muted-foreground ">
              <h2 className="text-lg font-semibold mb-2">Workspace is empty</h2>
              <p className="text-sm">
                Press the <span className="font-semibold">+</span> next to Workspace in the sidebar to add a new project.
              </p>
            </div>
          ) : (
            projects.map((project) => (
              <Link
                key={project?.id}
                href={`/project/${project?.id}`}
                className="rounded-xl border p-4 shadow hover:shadow-md transition-colors bg-background"
              >
                <h3 className="text-lg font-semibold mb-2">{project?.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {project?.totalTasks} Tasks
                </p>
                <div className="space-y-1 text-sm">
                  {project?.status &&
                    Object.entries(project.status).map(([statusKey, count]) => (
                      <div className="flex justify-between" key={statusKey}>
                        <span
                          className={
                            statusKey === "To Do"
                              ? "text-muted-foreground"
                              : statusKey === "In Progress"
                                ? "text-yellow-700"
                                : statusKey === "In Review"
                                  ? "text-blue-700"
                                  : statusKey === "Done"
                                    ? "text-green-700"
                                    : "text-muted-foreground"
                          }
                        >
                          {statusKey === "inReview"
                            ? "In Review"
                            : statusKey.charAt(0).toUpperCase() +
                            statusKey.slice(1).replace(/([A-Z])/g, " $1")}
                        </span>
                        <span>{String(count)}</span>
                      </div>
                    ))}
                </div>
              </Link>
            ))
          )
        }
      </div>
      <WorkspaceMembers id={id as string} />
    </div>
  );
}
