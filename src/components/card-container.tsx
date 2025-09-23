import * as React from "react"
import { useRouter } from "next/navigation";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import TaskCardAction from "./task-card-action";
import { Calendar, Flag } from "lucide-react";
import CardConDescription from "./card-container-desc";
import CardConAssignees from "./card-container-assignees";

export default function CardContainer(
  { 
    role,
    data,
    onTitleChange,
    isShadow = false,
    onUpdateTask,
    onDoubleClick,
    onDeleteTask,
    onSaveNewTask
  }: {
    role?: string,
    data: any,
    onTitleChange: any,
    isShadow?: boolean,
    onUpdateTask?: any,
    onKeyDown?: any,
    onDoubleClick?: any,
    onDeleteTask?: any,
    onSaveNewTask?: any
  }) {
  const [isHover, setIsHover] = React.useState(false);

  const router = useRouter();

  const suppressClickRef = React.useRef(false);

  const handleClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    router.push(`/task/${data.id}`);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    suppressClickRef.current = true;
    onDoubleClick && onDoubleClick(e);
  };

  return (
    <Card
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={handleClick}
      className={`w-full hover:shadow-lg min-w-56 relative ${isShadow ? 'opacity-70' : ''}`}
    >
      <div className={`${isShadow ? 'opacity-0' : ''}`}>
        {isHover && !data.isEditTitle && (role === 'ADMIN' || role === 'OWNER' ) && (
          <TaskCardAction id={data.id} onDeleteTask={onDeleteTask} />
        )}
        <CardHeader
          className="p-3 pb-0"
        >
          {data.isEditTitle ? (
            <input
              type="text"
              value={data.title}
              className="text-sm font-semibold tracking-tight bg-transparent border-none focus:ring-0 focus:outline-none w-full"
              placeholder="Task Name"
              onChange={(e) => onTitleChange(e.target.value)}
              onBlur={() => {
                setIsHover(false);
                if (typeof data.id === "string" && data.id.startsWith("newtask-")) {
                  if (data.title.trim() === '') {
                    onDeleteTask(data.id);
                    return;
                  } else {
                    onSaveNewTask();
                    return;
                  }
                };
                onUpdateTask(data.id, false, 'rename');
              }}
              onKeyDown={(event: React.KeyboardEvent) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  setIsHover(false);
                  if (typeof data.id === "string" && data.id.startsWith("newtask-")) {
                    if (data.title.trim() === '') {
                      onDeleteTask(data.id);
                      return;
                    } else {
                      onSaveNewTask();
                      return;
                    }
                  };
                  onUpdateTask(data.id, false, 'rename');
                }
              }
              }
              autoFocus
              ref={(input) => {
                if (input && !input.dataset.selected) {
                  input.select();
                  input.dataset.selected = "true";
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.currentTarget.dataset.selected = "true";
              }}
            />
          ) : (
            <CardTitle
              className="font-semibold tracking-tight cursor-pointer text-sm"
              onClick={(e) => { e.stopPropagation(); }}
              onDoubleClick={handleDoubleClick}
            >
              {data.title === '' ? 'Task Name' : data.title}
            </CardTitle>
          )}
        </CardHeader>

        <CardContent className="p-3 pt-2">
          <div className="flex justify-between items-center gap-1">
            {
              data.description && (
                <span onClick={(e) => { e.stopPropagation(); }}>
                  <CardConDescription
                    desc={data.description} />
                </span>
              )
            }
            <div></div>
            {Array.isArray(data.assignees) && data.assignees.length > 0 && (
              <CardConAssignees assignees={data.assignees} />
            )}
          </div>

          <div className="flex gap-0.5 items-center flex-wrap text-[11px] mt-1 justify-between">
            <div className={`px-1.5 rounded h-5 flex items-center ${getDateColor(data.dueDate)}`}>
              <Calendar className="w-2.5" />
              <span className="ml-0.5">{getFormattedDate(data.dueDate)}</span>
            </div>
            <div></div>
            {data?.priority && (
              <div
                className={`px-1.5 text-[11px] text-center rounded h-5 flex items-center group ml-auto w-fit mt-2 ${getPriorityColor(data?.priority ?? 'Low')}`}
              >
                <Flag className="w-2.5" />
                <span className="ml-0.5 transition-opacity duration-150 group-hover:block">
                  {data?.priority ?? 'Low'}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Urgent':
      return 'bg-red-600 text-white hover:bg-red-700';
    case 'High':
      return 'bg-red-500 text-white hover:bg-red-600';
    case 'Medium':
      return 'bg-yellow-400 hover:bg-yellow-500';
    case 'Low':
      return 'bg-green-400  hover:bg-green-500';
    default:
      return 'bg-gray-300';
  }
}

const getFormattedDate = (date: string) => {
  const targetDate = dayjs(date);
  return targetDate.isValid() ? targetDate.format('DD-MM-YYYY') : 'Invalid date';
}

const getDateColor = (date: string) => {
  const targetDate = dayjs(date);
  const today = dayjs();
  const diffDays = targetDate.diff(today, 'day');

  return 'bg-slate-100  hover:bg-slate-200';

  if (diffDays < 0) {
    return 'bg-red-400 hover:bg-red-500';
  } else if (diffDays === 0) {
    return 'bg-blue-400 hover:bg-blue-500';
  } else if (diffDays <= 1) {
    return 'bg-yellow-400  hover:bg-yellow-500';
  } else {
    return 'bg-green-400  hover:bg-green-500';
  }
}

