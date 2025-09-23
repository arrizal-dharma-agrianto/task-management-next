'use client';

import React, { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  parseISO,
} from 'date-fns';
import { Button } from './ui/button';
import { History } from 'lucide-react';
import { getLogProject } from '@/service/project';
import Link from 'next/link';

type Log = {
  id: string;
  user: 'Alfi Syahrin' | 'John Smith';
  avatar?: string;
  action: string;
  timestamp: string;
};

// const logs: Log[] = [
//   {
//     id: '1',
//     user: 'Alfi Syahrin',
//     action: 'Created a new task "Membuat Footer"',
//     timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
//   },
//   {
//     id: '2',
//     user: 'John Smith',
//     action: 'Moved Task "Membuat Content" to "IN PROGRESS"',
//     timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
//   },
//   {
//     id: '3',
//     user: 'Alfi Syahrin',
//     action: 'Created a new task "Membuat Content"',
//     timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
//   },
//   {
//     id: '1',
//     user: 'Alfi Syahrin',
//     action: 'Created a new task "Membuat Footer"',
//     timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
//   },
//   {
//     id: '2',
//     user: 'John Smith',
//     action: 'Moved Task "Membuat Content" to "IN PROGRESS"',
//     timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
//   },
//   {
//     id: '3',
//     user: 'Alfi Syahrin',
//     action: 'Created a new task "Membuat Content"',
//     timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
//   },
//   {
//     id: '1',
//     user: 'Alfi Syahrin',
//     action: 'Created a new task "Membuat Footer"',
//     timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
//   },
//   {
//     id: '2',
//     user: 'John Smith',
//     action: 'Moved Task "Membuat Content" to "IN PROGRESS"',
//     timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
//   },
//   {
//     id: '3',
//     user: 'Alfi Syahrin',
//     action: 'Created a new task "Membuat Content"',
//     timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
//   },
// ];

function getTimeDiff(timestamp: string) {
  const date = parseISO(timestamp);
  const now = new Date();

  const mins = differenceInMinutes(now, date);
  if (mins < 60) return `${mins} minutes ago`;

  const hours = differenceInHours(now, date);
  if (hours < 24) return `${hours} hours ago`;

  const days = differenceInDays(now, date);
  return `${days} days ago`;
}

export default function ActivityLog({ id }: { id: string }) {

  const [logs, setLogs] = useState<any[] | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    console.log('Fetching logs for project ID:', id);
    const fetchLogs = async () => {
      try {
        const res = await getLogProject(id);
        console.log('res', res);
        setLogs(res);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchLogs();
  }, [id, open]);

  const titleProjectLog = (name: string, id: string) => (
    <span
      className='text-sm cursor-pointer text-blue-700 hover:underline'
      onClick={() => {
        setOpen(false);
      }}
    >
      {name.length > 30 ? `${name.slice(0, 30)}...` : name}
    </span>
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {/* <button
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setOpen(true)}
            type="button"
          > */}
        <Button variant="outline" >
          <History
            className="w-4 h-4"
          // onAbort={() => setOpen(true)}
          />
          Log
        </Button>
        {/* </button> */}
      </SheetTrigger>
      <SheetContent side="right" className="w-[380px] sm:w-[420px] max-h-screen">
        <SheetHeader>
          <SheetTitle>Project Activity Log</SheetTitle>
        </SheetHeader>

        <ScrollArea className="mt-4 h-full pr-2">
          <div className="relative ml-4 mb-8">
            {/* Vertical line */}
            <div className="absolute -left-[5px] top-0 bottom-0 w-0.5 bg-muted" />
            <div className="space-y-6">
              {logs?.length !== 0 && logs?.map((log) => (
                <div key={log.id} className="flex gap-3 relative items-start">
                  {/* Dot on timeline */}
                  <div className="absolute -left-[10px] top-2 w-3 h-3 rounded-full bg-primary border-2 border-background z-10" />
                  {/* Avatar */}
                  <Avatar className="w-8 h-8 ml-3">
                    {/* <AvatarImage src={log.avatar} /> */}
                    <AvatarFallback>
                      {/* {log?.user} */}
                      {log?.user.fullName
                        .split(' ')
                        .map((n: any[]) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {/* Content */}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{log.user.fullName}</span>
                    {log.action.startsWith('CREATE_PROJECT/') ? (
                      <span className='text-sm text-muted-foreground'>
                        create project <span className="text-slate-900">{titleProjectLog(log.action.replace('CREATE_PROJECT/', ''), log.project?.id)}</span>
                      </span>
                    ) : log.action.startsWith('CREATE_TASK') ? (
                      <span className='text-sm text-muted-foreground'>
                        create task <span className="text-slate-900">{titleTaskLog(log.action.replace('CREATE_TASK/', ''), log.task?.id)}</span>
                      </span>
                    ) : log.action.startsWith('RENAME_TASK/') ? (
                      (() => {
                        const parts = log.action.split('/');
                        const oldTitle = parts[1] || '';
                        const newTitle = parts[2] || '';
                        return (
                          <span className='text-sm text-muted-foreground'>
                            rename task <span className="text-slate-900">{oldTitle}</span> to <span className="text-slate-900">{titleTaskLog(newTitle, log.task?.id)}</span>
                          </span>
                        );
                      })()
                    ) : log.action.startsWith('MOVE_TASK') ? (
                      <span className='text-sm text-muted-foreground'>
                        move task  <span className="text-slate-900">{titleTaskLog(log.task?.title, log.task?.id)}</span> to <span className="text-slate-900">{log.action.replace('MOVE_TASK/', '')}</span>
                      </span>
                    ) : log.action.startsWith('ADD_ASSIGNEES/') ? (
                      (() => {
                        const assignee = log.action.split('/')[1] || '';
                        return (
                          <span className='text-sm text-muted-foreground'>
                            assignee <span className="text-slate-900">{assignee}</span> to task <span className="text-slate-900">{titleTaskLog(log.task?.title, log.task?.id)}</span>
                          </span>
                        );
                      })()
                    ) : log.action.startsWith('REMOVE_ASSIGNEES') ? (
                      (() => {
                        const assignee = log.action.split('/')[1] || '';
                        return (
                          <span className='text-sm text-muted-foreground'>
                            remove <span className="text-slate-900">{assignee}</span> from task <span className="text-slate-900">{titleTaskLog(log.task?.title, log.task?.id)}</span>
                          </span>
                        );
                      })()
                    ) : log.action.startsWith('CHANGE_DUEDATE/') ? (
                      (() => {
                        const parts = log.action.split('/');
                        const oldDate = parts[1] || '';
                        const newDate = parts[2] || '';
                        return (
                          <span className='text-sm text-muted-foreground'>
                            change due date task <span className="text-slate-900">{titleTaskLog(log.task?.title, log.task?.id)}</span> to <span className="text-slate-900">{newDate}</span>
                          </span>
                        );
                      })()
                    ) : log.action === 'CHANGE_DESCRIPTION' ? (
                      <span className='text-sm text-muted-foreground'>
                        change description task <span className="text-slate-900">{titleTaskLog(log.task?.title, log.task?.id)}</span>
                      </span>
                    ) : log.action.startsWith('ADD_PRIORITY/') ? (
                      (() => {
                        const priority = log.action.split('/')[1] || '';
                        return (
                          <span className='text-sm text-muted-foreground'>
                            Set priority <span className="text-slate-900">{priority}</span> to task <span className="text-slate-900">{titleTaskLog(log.task?.title, log.task?.id)}</span>
                          </span>
                        );
                      })()
                    ) : log.action.startsWith('CHANGE_PRIORITY/') ? (
                      (() => {
                        const parts = log.action.split('/');
                        const oldPriority = parts[1] || '';
                        const newPriority = parts[2] || '';
                        return (
                          <span className='text-sm text-muted-foreground'>
                            change priority task <span className="text-slate-900">{titleTaskLog(log.task?.title, log.task?.id)}</span> from <span className="text-slate-900">{oldPriority}</span> to <span className="text-slate-900">{newPriority}</span>
                          </span>
                        );
                      })()
                    ) : log.action === 'ADD_MEMBER' ? (
                      <span className='text-sm text-muted-foreground'>
                        add member <span className="text-slate-900">{log.user.fullName}</span>
                      </span>
                    )
                      : log.action === 'DELETE_TASK' ? (
                        <span className='text-sm text-muted-foreground'>
                          delete task <span className="text-slate-900">{titleTaskLog(log.task?.title, log.task?.id)}</span>
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">{log.action}</span>
                      )
                    }
                    <span className="text-xs text-muted-foreground">
                      {getTimeDiff(log.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
              {logs?.length === 0 && (
                <div className="text-center text-muted-foreground">
                  No activity logs found.
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}


const titleTaskLog = (name: string, id: string) => (
  <Link href={`/task/${id}`} className='text-sm text-blue-700 hover:underline'>
    {name.length > 30 ? `${name.slice(0, 30)}...` : name}
  </Link>
)

const titleProjectLog = (name: string, id: string) => (
  <Link href={`/project/${id}`} className='text-sm text-blue-700 hover:underline'>
    {name.length > 30 ? `${name.slice(0, 30)}...` : name}
  </Link>
)