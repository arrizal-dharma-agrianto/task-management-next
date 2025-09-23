import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || null;

  const task = await prisma.task.findUnique({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      status: true,
      priority: true,
      assignees: true,
      project: {
        include: {
          workspace: true,
          users: true,
        },
      },
      attachments: true,
    },
  });

  if (task && Array.isArray(task.assignees)) {
    task.assignees = task.assignees.map((assignee: any) => assignee.id);
  }

  if (!task) {
    return NextResponse.json({ message: 'Task not found' }, { status: 404 });
  }

  const userRole = task?.project?.users.find((u: any) => u.userId === userId)?.role || 'viewer';
  const taskWithRole = { ...task, role: userRole };

  return NextResponse.json({
    message: 'Task fetched successfully',
    task: taskWithRole,
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { data } = await req.json();

  const { assignees, order: newOrder, statusId: newStatusId, ...rest } = data;

  // Ambil task lama dari DB untuk dapatkan order dan status sebelumnya
  const currentTask = await prisma.task.findUnique({
    where: { id },
    include: {
      status: true,
      priority: true,
      assignees: true,
    },
  });

  if (!currentTask) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  const oldOrder = currentTask.order;
  const oldStatusId = currentTask.statusId;

  // Cek jika order berubah atau kolom/status berubah
  const isOrderChanged = newOrder !== undefined && (newOrder !== oldOrder || newStatusId !== oldStatusId);

  // Jika order diubah, perbaiki urutan task lainnya dulu
  if (isOrderChanged) {
    if (newStatusId === oldStatusId) {
      // Geser dalam kolom yang sama
      if (newOrder < oldOrder) {
        // Geser naik → semua task dari newOrder sampai oldOrder - 1 naik 1
        await prisma.task.updateMany({
          where: {
            statusId: oldStatusId,
            order: {
              gte: newOrder,
              lt: oldOrder,
            },
          },
          data: {
            order: { increment: 1 },
          },
        });
      } else {
        // Geser turun → semua task dari oldOrder + 1 sampai newOrder turun 1
        await prisma.task.updateMany({
          where: {
            statusId: oldStatusId,
            order: {
              gt: oldOrder,
              lte: newOrder,
            },
          },
          data: {
            order: { decrement: 1 },
          },
        });
      }
    } else {
      // Pindah ke kolom lain → geser semua task di kolom baru dari newOrder ke bawah naik 1
      await prisma.task.updateMany({
        where: {
          statusId: newStatusId,
          order: {
            gte: newOrder,
          },
        },
        data: {
          order: { increment: 1 },
        },
      });

      // Kosongkan slot lama
      await prisma.task.updateMany({
        where: {
          statusId: oldStatusId,
          order: {
            gt: oldOrder,
          },
        },
        data: {
          order: { decrement: 1 },
        },
      });
    }
  }

  // Siapkan payload untuk update
  const reqData = {
    ...rest,
    ...(newOrder !== undefined && { order: newOrder }),
    ...(newStatusId !== undefined && { statusId: newStatusId }),
    ...(Array.isArray(assignees)
      ? {
        assignees: {
          set: assignees.map((userId: string) => ({ id: userId })),
        },
      }
      : {}),
  };

  // Update task
  const updatedTask = await prisma.task.update({
    where: { id },
    data: reqData,
    include: {
      status: true,
      priority: true,
      assignees: true,
    },
  });

  const action = await getTaskChangeAction(currentTask, updatedTask);

  return NextResponse.json({
    message: "Task updated successfully",
    previous: currentTask,
    new: updatedTask,
    action,
  });
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  // Find the task to get its order and statusId before deleting
  const taskToDelete = await prisma.task.findUnique({
    where: { id },
    select: { order: true, statusId: true },
  });

  if (!taskToDelete) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  // Delete the task
  const deletedTask = await prisma.task.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  await prisma.task.updateMany({
    where: {
      statusId: taskToDelete.statusId,
      order: {
        gt: taskToDelete.order,
      },
    },
    data: {
      order: { decrement: 1 },
    },
  });

  return NextResponse.json({
    message: 'Task deleted successfully',
    project: deletedTask,
  });
}

const getTaskChangeAction = async (previous: any, updated: any) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userLoginId = user?.id || null;

  if (previous.title !== updated.title) {
    return `RENAME_TASK/${previous.title}/${updated.title}`;
  }

  if (previous.statusId !== updated.statusId) {
    await prisma.notification.createMany({
      data: updated.assignees
        .filter((assignee: any) => assignee.id !== userLoginId)
        .map((assignee: any) => ({
          userId: assignee.id,
          message: `Task "${updated.title}" has been moved to ${updated.status.name}`,
          url: `/task/${updated.id}`,
        })),
    });
    return `MOVE_TASK/${updated.status.name}`;
  }

  if (previous.priorityId === null && updated.priorityId !== null) {
    return `ADD_PRIORITY/${updated.priority.name}`;
  }

  if (previous.priorityId !== updated.priorityId) {
    return `CHANGE_PRIORITY/${previous.priority.name}/${updated.priority.name}`;
  }

  if (previous.description !== updated.description) {
    return `CHANGE_DESCRIPTION`;
  }

  if (new Date(previous.dueDate).getTime() !== new Date(updated.dueDate).getTime()) {
    return `CHANGE_DUEDATE/${formatDate(previous.dueDate)}/${formatDate(updated.dueDate)}`;
  }

  if (previous.assignees.length !== updated.assignees.length) {
    const addedAssignees = updated.assignees.filter((assignee: any) =>
      !previous.assignees.some((prevAssignee: any) => prevAssignee.id === assignee.id)
    );
    const removedAssignees = previous.assignees.filter((assignee: any) =>
      !updated.assignees.some((newAssignee: any) => newAssignee.id === assignee.id)
    );
    if (addedAssignees.length > 0 && removedAssignees.length > 0) {
      return `CHANGE_ASSIGNEES/${addedAssignees.map((a: any) => a.fullName).join(', ')}/${removedAssignees.map((a: any) => a.fullName).join(', ')}`;
    } else if (addedAssignees.length > 0) {

      await prisma.notification.createMany({
        data: addedAssignees
          .filter((assignee: any) => assignee.id !== userLoginId)
          .map((assignee: any) => ({
            userId: assignee.id,
            message: `You have been assigned to task "${updated.title}"`,
            url: `/task/${updated.id}`,
          })),
      });
      return `ADD_ASSIGNEES/${addedAssignees.map((a: any) => a.fullName).join(', ')}`;
    } else if (removedAssignees.length > 0) {
      return `REMOVE_ASSIGNEES/${removedAssignees.map((a: any) => a.fullName).join(', ')}`;
    }
  }

  if (previous.assignees.length === updated.assignees.length) {
    const previousAssignees = previous.assignees.map((a: any) => a.id).sort();
    const updatedAssignees = updated.assignees.map((a: any) => a.id).sort();
    if (JSON.stringify(previousAssignees) !== JSON.stringify(updatedAssignees)) {
      return `ASSIGNEES_CHANGED`;
    }
  }

  // Tambahkan deteksi perubahan lain sesuai kebutuhan
  return 'NOTHING_CHANGED';
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // bulan dimulai dari 0
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}