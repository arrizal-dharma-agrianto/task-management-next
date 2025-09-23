'use client';

import { clearBreadcrumbs, setBreadcrumbs } from "@/store/slices/position";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ellipsis, Printer, RefreshCcw } from "lucide-react"
import { ArrowRight } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { getStats } from "@/service/stats";
import { RootState } from "@/store/store";
import Link from "next/link";
import { readNotification } from "@/service/notification";
import { reduceNotification } from "@/store/slices/notifSlice";
import { getYourTasks } from "@/service/task";

function AnimatedCounter({ value, className }: { value: number, className?: string }) {
  const controls = useAnimation();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frame: number;
    let start = 0;
    const duration = 800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const newValue = Math.floor(progress * value);
      setDisplayValue(newValue);
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <motion.span
      className={` font-bold text-primary ${className ? ` ${className}` : 'text-3xl'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayValue}
    </motion.span>
  );
}

const taskQuotes = [
  "Plan your work and work your plan.",
  "Small steps every day lead to big results.",
  "Stay focused and never give up.",
  "Tasks are the steps to your success.",
  "Prioritize what matters most.",
  "One task at a time, one win at a time.",
  "Consistency beats intensity.",
  "Done is better than perfect.",
  "Start where you are. Use what you have. Do what you can.",
  "Don’t wait for motivation—build discipline."
]

export function WelcomeBanner({ nameUser = "Alfi", onRefresh }: { nameUser?: string, onRefresh: any }) {
  const [quote, setQuote] = useState("")
  const router = useRouter()

  const refreshData = () => {
    router.refresh()
    updateQuote();
    onRefresh();
  }

  const updateQuote = () => {
    const randomIndex = Math.floor(Math.random() * taskQuotes.length)
    setQuote(taskQuotes[randomIndex])
  }

  useEffect(() => {
    updateQuote();
  }, [])

  return (
    <div className="p-6 rounded-xl bg-muted/50 mb-6 shadow-sm flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold">Welcome, {nameUser} 👋</h2>
        <p className="text-muted-foreground mt-1 text-sm">{quote}</p>
      </div>
      <div className="flex items-center gap-2">
        {/* <Button
          variant="ghost"
          size="icon"
          onClick={refreshData}
          className="text-muted-foreground hover:text-foreground"
        >
          <Printer className="w-8 h-8" />
        </Button> */}
        <div className="text-sm text-muted-foreground mr-2">
          {new Date().toLocaleDateString('us-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={refreshData}
          className="text-muted-foreground hover:text-foreground"
        >
          <RefreshCcw className="w-8 h-8" />
        </Button>
      </div>
    </div>
  )
}


export default function DashboardView() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [stats, setStats] = useState<any>()
  const user = useSelector((state: RootState) => state.user)
  const notifications = useSelector((state: RootState) => state.notif);
  const [yourTasks, setYourTasks] = useState<any[] | null>(null);

  const fetchStats = async () => {
    const response = await getStats(user.id);
    setStats(response);
  };

  const fetchYourTasks = async () => {
    const task = await getYourTasks();
    if (task) {
      setYourTasks(task);
    } else {
      console.error("Failed to fetch your tasks");
    }
  }

  useEffect(() => {
    if (!user || !user.id) {
      return;
    }

    fetchStats();
    fetchYourTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    dispatch(clearBreadcrumbs());
    dispatch(
      setBreadcrumbs([
        {
          name: 'Dashboard',
          id: 'dashboard',
          url: '/dashboard',
        },
      ])
    );
  }, [dispatch]);

  const handleReadNotification = async (notificationId: string, url: string) => {
    const response = await readNotification(notificationId);
    if (!response) {
      console.error("Failed to mark notification as read");
      return;
    }
    dispatch(reduceNotification(notificationId));
    router.push(url);
  }

  const handleRefresh = () => {
    console.log("Refreshing stats...");
    setStats({});
    setYourTasks(null);
    fetchStats();
    fetchYourTasks();
  }


  return (
    <div className="p-6 pt-4 space-y-6">
      <WelcomeBanner nameUser={user?.name} onRefresh={handleRefresh} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="col-span-1 min-h-28">
          <div className="flex items-center justify-center flex-1 h-full">
            <div className="text-4xl font-bold text-center">
              {stats && stats.workspace !== undefined ? (
                <AnimatedCounter value={stats.workspace} />
              ) : (
                <div className="w-12 h-8 bg-muted rounded animate-pulse mx-auto mb-1" />
              )}
              <div className="text-sm font-medium text-muted-foreground mt-1">
                {stats?.workspace > 1 ? "Workspaces" : "Workspace"}
              </div>
            </div>
          </div>
        </Card>
        <Card className="col-span-1">
          <div className="flex items-center justify-center flex-1 h-full">
            <div className="text-4xl font-bold text-center">
              {stats && stats.project !== undefined ? (
                <AnimatedCounter value={stats.project} />
              ) : (
                <div className="w-12 h-8 bg-muted rounded animate-pulse mx-auto mb-1" />
              )}
              <div className="text-sm font-medium text-muted-foreground mt-1">
                {stats?.project > 1 ? "Projects" : "Project"}
              </div>
            </div>
          </div>
        </Card>
        <Card className="col-span-2">
          <div className="flex p-4">
            <div className="flex items-center justify-center flex-1">
              <div className="text-4xl font-bold text-center">
                {stats && stats.taskDetail?.total !== undefined ? (
                  <AnimatedCounter value={stats.taskDetail.total} />
                ) : (
                  <div className="w-12 h-8 bg-muted rounded animate-pulse mx-auto mb-1" />
                )}
                <div className="text-sm font-medium text-muted-foreground mt-1">
                  {stats?.taskDetail?.total > 1 ? "Tasks" : "Task"}
                </div>
              </div>
            </div>

            <div
              className="flex-1 space-y-2 text-sm"
              style={{
                minHeight: "144px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
                {stats && stats.taskDetail?.status
                ? (() => {
                  type StatusEntry = [string, { count: number; color: string }];
                  const entries: StatusEntry[] = Object.entries(stats.taskDetail.status) as StatusEntry[];
                  const minRows = 4;
                  const rows: (StatusEntry | undefined)[] = entries.length >= minRows
                  ? entries
                  : [
                    ...entries,
                    ...Array.from({ length: minRows - entries.length }) as (StatusEntry | undefined)[],
                  ];
                  return rows.map((row, idx) =>
                  row && (
                    <div className="flex items-center justify-between" key={row[0]}>
                    <div className="flex items-center gap-2">
                      <Badge
                      variant="outline"
                      className={`bg-${row[1].color}-100 text-${row[1].color}-800`}
                      >
                      {row[0]}
                      </Badge>
                    </div>
                    <AnimatedCounter value={row[1].count} className="text-xl" />
                    </div>
                  )
                  );
                })()
                : Array.from({ length: 4 }).map((_, idx) => (
                  <div className="flex items-center justify-between" key={idx}>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-6 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="w-8 h-6 bg-muted rounded animate-pulse" />
                  </div>
                ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {yourTasks === null ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-2 rounded bg-muted animate-pulse"
                  >
                    <div className="w-32 h-4 bg-gray-200 rounded" />
                    <div className="w-16 h-6 bg-gray-200 rounded" />
                  </div>
                ))
              ) : yourTasks.length === 0 ? (
                <div className="text-muted-foreground text-sm px-3 py-2">
                  You are not assigned to any tasks.
                </div>
              ) : (
                (yourTasks.slice(0, 5) || []).map((task) => (
                  <Link
                    href={`/task/${task.id}`}
                    key={task.id}
                    className={`flex items-center justify-between text-sm text-muted-foreground rounded px-3 py-2 hover:bg-muted transition ${task.status.name === "done"
                      ? "bg-green-50"
                      : task.status.name === "inProgress"
                        ? "bg-yellow-50"
                        : task.status.name === "onReview"
                          ? "bg-blue-50"
                          : "bg-muted/50"
                      }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium truncate">{task.title}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </div>
                    <Badge
                      variant="outline"
                      className={`bg-${task.status.color}-100 text-${task.status.color}-800`}
                    >
                      {task.status.name.replace(/([A-Z])/g, " $1")}
                    </Badge>
                  </Link>
                ))
              )}
              {/* {yourTasks && yourTasks.length > 4 && (
                <Link
                  href="/task"
                  className="flex items-center justify-between text-sm font-medium text-primary px-3 py-2 hover:bg-muted/50 transition rounded w-fit"
                >
                  <span>
                    <Ellipsis />
                  </span>
                </Link>
              )} */}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Notification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(notifications?.slice(0, 4) || []).map((notif: any) => (
                <div
                  onClick={() => {
                    handleReadNotification(notif.id, notif.url || '/notification');
                  }}
                  key={notif.id}
                  className={`${notif.read ? ' bg-muted/50' : 'bg-blue-50'} flex items-center justify-between text-sm text-muted-foreground rounded px-3 py-2 hover:bg-muted transition`}
                >
                  <span className="truncate">{notif.message}</span>
                  {notif.url && (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </div>
              ))}
              {notifications && notifications.length > 4 && (
                <Link
                  href='/notification'
                  className="flex items-center justify-between text-sm font-medium text-primary px-3 py-2 hover:bg-muted/50 transition rounded w-fit"
                >
                  <span><Ellipsis /></span>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
