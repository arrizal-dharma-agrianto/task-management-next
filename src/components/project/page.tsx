"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Column } from './column';
import { Item } from './item';
import './styles.css';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';
import { useSidebar } from '@/components/ui/sidebar';
import { getProjectsById, postLogProject } from '@/service/project';
import { useParams, useRouter } from 'next/navigation';
import { ColumnData } from '@/types/project';
import { createTask, deleteTask, updateTask } from '@/service/task';
import { useDispatch, useSelector } from 'react-redux';
import { clearBreadcrumbs, setBreadcrumbs, } from '@/store/slices/position';
import { createStatus, deleteStatus, updateStatus } from '@/service/status';
import ProjectMembers from './project-members';
import { Button } from '../ui/button';
import { Plus, Printer, RefreshCcw, Users } from 'lucide-react';
import { openSheet } from '@/store/slices/uiSlice';
import { toast } from 'sonner';
import ActivityLog from '../activity';
import { RootState } from '@/store/store';
import ProjectPrintButton from './project-print-button';

export default function ProjectView() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [isCreatingTask, setIsCreatingTask] = useState<boolean>(false);
  const [project, setProject] = useState<any>(null);
  const [allData, setAllData] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const userId = useSelector((state: RootState) => state.user.id)
  const [role, setRole] = useState<string>('VIEWER');

  const { id } = useParams();
  const { state } = useSidebar();
  const previousItems = useRef(columns);
  const dispatch = useDispatch();
  const router = useRouter();
  const getProject = async () => {
    const res = await getProjectsById(id as string);
    if (!res?.taskStatuses) {
      router.replace('/not-found');
      return;
    };
    setAllData(res);
    setProject({
      id: res.id,
      name: res.name,
      workspaceId: res.workspaceId,
      workspace: res.workspace
    })
    setRole(res.userRole || 'VIEWER');

    if (res) {
      dispatch(setBreadcrumbs([
        {
          name: 'Dashboard',
          id: 'dashboard',
          url: '/dashboard'
        },
        {
          name: res.workspace?.name || 'Workspace',
          id: res.workspace?.id || res.workspaceId,
          url: `/workspace/${res.workspace?.id || res.workspaceId}`
        },
        {
          name: res.name,
          id: res.id,
          url: `/project/${res.id}`
        }
      ].map(b => ({
        ...b,
        // Ensure no functions or non-serializable values are present
      }))));
    }

    const mappedColumns: ColumnData[] = res.taskStatuses.map((status: any) => ({
      id: status.id,
      status: status.name,
      order: status.order,
      color: status.color,
      tasks: (status.tasks || []).map((task: any, index: number) => ({
        id: task.id,
        title: task.title,
        order: task.order ?? index,
        description: task.description,
        priority: task.priority?.name,
        assignees: task.assignees || [],
        isEditTitle: false,
        dueDate: task.dueDate || new Date().toISOString(),
      }))
    }));

    setColumns(mappedColumns);
  };

  useEffect(() => {
    dispatch(clearBreadcrumbs());
    getProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  const addColumn = () => {
    const container = document.querySelector('.Root');
    if (container) {
      setTimeout(() => {
        container.scrollLeft = container.scrollWidth;
      }, 0);
    }
    const lastColumn = columns[columns.length - 1];
    const newId = 'new-status-' + String.fromCharCode(lastColumn.id.charCodeAt(0) + 1);
    setColumns([...columns, { id: newId, status: '', order: columns.length, tasks: [], color: 'gray', isEditName: true }]);
  };

  const handleEditColumnName = (statusId: string) => {
    setColumns((prev) => {
      return prev.map((col) => {
        if (col.id === statusId) {
          return { ...col, isEditName: true };
        }
        return col;
      });
    });
  }

  const handleSaveColumn = async (statusId: string, name: string, color?: string) => {

    if (!name.trim()) {
      toast.error('Column name cannot be empty');
      setColumns((prev) => prev.filter((col) => col.id !== statusId));
      return;
    }

    if (statusId.startsWith('new-status-')) {
      const res = await createStatus({ name, order: columns.length - 1, projectId: id, color: color || 'gray' });

      if (res) {
        const column = columns.find(col => col.id === statusId);
        if (column) {
          const updatedColumn = { ...column, id: res.id, status: name, isEditName: false, color: color || 'gray' };
          setColumns((prev) => prev.map(col => (col.id === statusId ? updatedColumn : col)));
        }
      }
    } else {
      const res = await updateStatus(statusId, { name, color });
      if (res) {
        setColumns((prev) => {
          return prev.map((col) => {
            if (col.id === statusId) {
              return { ...col, status: name, isEditName: false, color: color ?? col.color };
            }
            return col;
          });
        });
      }
    }
  }

  const addItem = async (columnId: string) => {
    if (isCreatingTask) return;

    // setIsCreatingTask(true);
    const taskCount = columns.find(col => col.id === columnId)?.tasks.length ?? 0;
    // const newTask = await createTask({ title: 'Task Name', order: taskCount, statusId: columnId, projectId: id });
    // if (!newTask) return;
    // setIsCreatingTask(false);

    setColumns((prev) => {
      const a = prev.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: [
              ...col.tasks,
              // { id: newTask.id, title: newTask.title, order: newTask.order, isEditTitle: true }
              { id: `newtask-${taskCount}`, title: '', order: taskCount, isEditTitle: true }
            ],
          };
        }
        return col;
      });
      return a;
    });
  };

  const handleSaveNewTask = async (columnId: string, title: string, order: number) => {
    if (isCreatingTask) return;

    setIsCreatingTask(true);
    const newTask = await createTask({ title: title, order, statusId: columnId, projectId: id });
    setIsCreatingTask(false);
    if (!newTask) {
      handleDeleteTask(`newtask-${order}`);
      return;
    };

    setColumns((prev) => {
      return prev.map((col) => {
        const updatedTasks = col.tasks.map((t) => {
          if (t.id === `newtask-${order}`) {
            return { ...t, id: newTask.id, order: newTask.order, isEditTitle: false };
          }
          return t;
        });

        return {
          ...col,
          tasks: updatedTasks,
        };
      });
    });

    await postLogProject({
      userId: userId as string,
      projectId: id as string,
      taskId: newTask.id,
      action: "CREATE_TASK/" + newTask.title,
    });

    toast.success(`Task '${title}' created successfully!`,
      {
        duration: 2000,
      }
    );

    // setColumns((prev) => {
    //   return prev.map((col) => {
    //     if (col.id === columnId) {
    //       const updatedTasks = col.tasks.map((task) => {
    //         if (task.id.startsWith("newtask-")) {
    //           return { ...task, id: newTask.id, title: newTask.title, order: newTask.order, isEditTitle: false };
    //         }
    //         return task;
    //       });

    //       return {
    //         ...col,
    //         tasks: updatedTasks,
    //       };
    //     }
    //     return col;
    //   });
    // });

  };

  const handleTitleChange = (id: string, title: string) => {
    setColumns((prev) => {
      return prev.map((col) => {
        const updatedTasks = col.tasks.map((task) => {
          if (task.id === id) {
            return { ...task, title };
          }
          return task;
        });

        return {
          ...col,
          tasks: updatedTasks,
        };
      });
    }
    );
  }

  const handleUpdateTask = async (taskId: string, withColomn = false, type = '') => {
    const column = columns.find(col => col.tasks.some(task => task.id === taskId));
    const task = column?.tasks.find(task => task.id === taskId);
    if (task) {
      const payload = withColomn
        ? { ...task, statusId: column?.id }
        : task;
      const res = await updateTask(taskId, payload);
      console.log('Update task response:', res);
      if (type === 'rename') {
        await postLogProject({
          userId: userId as string,
          projectId: id as string,
          taskId,
          action: "RENAME_TASK/" + res.previous.title + '/' + payload.title,
        });
        toast.success(`Task renamed to '${payload.title}' successfully!`,
          {
            duration: 2000,
          }
        );
      }

      if (withColomn) {
        await postLogProject({
          userId: userId as string,
          projectId: id as string,
          taskId,
          action: "MOVE_TASK/" + (column?.status || "Untitled Status"),
        });
      }
      if (res) {
        setColumns((prev) => {
          return prev.map((col) => {
            const updatedTasks = col.tasks.map((t) => {
              if (t.id === taskId) {
                return { ...t, isEditTitle: false };
              }
              return t;
            });

            return {
              ...col,
              tasks: updatedTasks,
            };
          });
        });
      }
    }
  }

  const handleKeyDown = async (event: React.KeyboardEvent, id: string) => {
    if (event.key === 'Enter') {
      await handleUpdateTask(id, false, 'rename');
    }
  }

  const handleDoubleClick = (id: string) => {
    setColumns((prev) => {
      return prev.map((col) => {
        const updatedTasks = col.tasks.map((task) => {
          if (task.id === id) {
            return { ...task, isEditTitle: true };
          }
          return task;
        });

        return {
          ...col,
          tasks: updatedTasks,
        };
      });
    });
  }

  const moveTask = (
    sourceId: string,
    sourceIndex: number,
    targetId: string,
    targetIndex?: number
  ) => {
    setColumns((prevCols) => {
      return prevCols.map((col) => {
        if (col.id !== sourceId && col.id !== targetId) return col;

        let updatedTasks = [...col.tasks];

        // Jika ini kolom sumber, hapus task dari posisi sourceIndex
        if (col.id === sourceId) {
          updatedTasks.splice(sourceIndex, 1);
        }

        // Jika ini kolom target, sisipkan task ke posisi targetIndex
        if (col.id === targetId) {
          const movedTask = prevCols
            .find(c => c.id === sourceId)!
            .tasks[sourceIndex];

          const safeIndex = targetIndex !== undefined ? targetIndex : updatedTasks.length;
          updatedTasks.splice(safeIndex, 0, movedTask);
        }

        // Update order
        const reordered = updatedTasks.map((task, idx) => ({
          ...task,
          order: idx
        }));

        return {
          ...col,
          tasks: reordered
        };
      });
    });
  };

  const handleDragStart = (event: any) => {
    if (role === 'VIEWER') return;
    previousItems.current = columns;
    const id = event.operation?.source?.id;
    if (id) setActiveId(id as string);
  }

  const handleDragOver = (event: any) => {
    if (role === 'VIEWER') return;
    const { source, target } = event.operation;
    if (!source || !target) return;

    if (source.type === 'column' || target.type === 'column') return;

    let sourceColumnId = '';
    let sourceIndex = -1;
    for (const col of columns) {
      const idx = col.tasks.findIndex(t => t.id === source.id);
      if (idx !== -1) {
        sourceColumnId = col.id;
        sourceIndex = idx;
        break;
      }
    }

    if (!sourceColumnId || sourceIndex === -1) return;

    let targetColumnId = '';
    let targetIndex = -1;

    let found = false;
    for (const col of columns) {
      const idx = col.tasks.findIndex(t => t.id === target.id);
      if (idx !== -1) {
        targetColumnId = col.id;
        targetIndex = idx;
        found = true;
        break;
      }
    }
    if (!found) {
      targetColumnId = String(target.id);
      const targetCol = columns.find(c => c.id === targetColumnId);
      targetIndex = targetCol ? targetCol.tasks.length : 0;
    }

    if (sourceColumnId === targetColumnId && sourceIndex === targetIndex) return

    moveTask(sourceColumnId, sourceIndex, targetColumnId, targetIndex);
  }

  const handleDragEnd = (event: any) => {
    if (role === 'VIEWER') return;
    handleUpdateTask(activeId as string, true);
    setActiveId(null);
    const { source, target } = event.operation;
    if (!source || !target) return;

    if (event.canceled) {
      setColumns(previousItems.current);
      return;
    }
  }

  const handleDeleteColumn = async (id: string) => {
    const res = await deleteStatus(id);
    if (!res) return;
    setColumns((prev) => {
      return prev.filter((col) => col.id !== id);
    });
  }

  const handleDeleteTask = async (taskId: string,) => {
    if (!taskId.startsWith("newtask-")) {
      const res = deleteTask(taskId);
      toast.success(`Task deleted successfully!`)
      await postLogProject({
        userId: userId as string,
        projectId: id as string,
        taskId,
        action: "DELETE_TASK",
      });
      if (!res) return;
    }

    setColumns((prev) => {
      return prev.map((col) => {
        const updatedTasks = col.tasks.filter((task) => task.id !== taskId);

        return {
          ...col,
          tasks: updatedTasks,
        };
      });
    }

    );
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await getProject();
    setIsRefreshing(false);
  };

  if (!columns.length) {
    return (
      <div className="flex flex-1 m-5 h-full">
        <div className="w-fit">
          <div className="animate-pulse space-y-4">
            {/* <div className="h-8 bg-slate-200 rounded w-1/3 mb-6" /> */}
            <div className="flex flex-row gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 space-y-3 w-80">
                  <div className="h-6 bg-slate-200 rounded w-2/3 mb-2" />
                  <div className="h-20 bg-slate-100 rounded" />
                  <div className="h-20 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-6 flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{project?.name}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <span className="inline-flex items-center justify-center">
              <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} style={{ transformOrigin: '50% 50%' }} />
            </span>
          </Button>
          {
            (role === 'ADMIN' || role === 'OWNER') &&
            <ProjectPrintButton data={allData} />
          }

          <ActivityLog id={id as string} />
          <Button
            variant="outline"
            onClick={() => {
              router.push(`/project/${id}`)
              dispatch(openSheet({ isSheetOpen: true, sheetContent: "project-members", id }))
            }
            }>
            <Users className="w-4 h-4 " />
            Members
          </Button>
        </div>
      </div>
      <DragDropProvider
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div
          className={`Root h-full pl-6 ${state === 'expanded' ? 'md:w-[calc(98.5vw-16rem)]' : 'md:w-[calc(98.5vw-3rem)]'} w-[97vw] gap-2 flex flex-row overflow-x-scroll`}
        >
          {columns.map((col, index) => (
            <Column
              role={role}
              key={col.id}
              status={col.status}
              color={col.color}
              id={col.id}
              index={index}
              count={col.tasks.length}
              isEditName={col.isEditName}
              handleSaveColumn={handleSaveColumn}
              addItem={addItem}
              onEditColumnName={() => handleEditColumnName(col.id)}
              onDeleteColumn={() => handleDeleteColumn(col.id)}
              isCreatingTask={isCreatingTask}
            >
              {col.tasks
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((task, idx) => (
                  <Item
                    role={role}
                    key={task.id}
                    task={task}
                    title={task.title}
                    id={task.id}
                    index={task.order}
                    column={col.id}
                    isShadow={task.id === activeId}
                    onTitleChange={(title: string) => handleTitleChange(task.id, title)}
                    onUpdateTask={handleUpdateTask}
                    onKeyDown={(event: React.KeyboardEvent) => handleKeyDown(event, task.id)}
                    onDoubleClick={() => handleDoubleClick(task.id)}
                    onDeleteTask={() => handleDeleteTask(task.id)}
                    onSaveNewTask={() => handleSaveNewTask(col.id, task.title, task.order)}
                  />
                ))}
            </Column>
          ))}
          {(role === 'ADMIN' || role === 'OWNER') &&

            <div className="min-w-fit cursor-pointer" >
              <span onClick={addColumn} className="flex text-sm items-center gap-2 font-bold hover:bg-slate-100 rounded-lg h-min px-4 py-2 text-slate-500">
                <Plus className='w-4' /> Add Status
              </span>
            </div>
          }
        </div>
        <DragOverlay>
          {activeId ? (() => {
            const task = columns
              .flatMap(col => col.tasks)
              .find(task => task.id === activeId);
            return task ? (
              <Item
                key={activeId}
                task={task}
                title={task.title}
                id={activeId}
                index={task.order}
                column={columns.find(col => col.tasks.some(t => t.id === activeId))?.id || ''}
                isOverlay
              />
            ) : null;
          })() : null}
        </DragOverlay>

      </DragDropProvider>
      <ProjectMembers id={id as string} />

    </>
  );
}
