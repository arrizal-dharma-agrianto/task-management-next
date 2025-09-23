import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { id: string };

export async function GET(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const userId = params.id;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Workspace count
    const workspaceCount = await prisma.workspaceUser.count({
      where: { userId },
    });

    // Project count
    const projectCount = await prisma.projectUser.count({
      where: { userId },
    });


    // Task detail: total & status breakdown
    const tasks = await prisma.task.findMany({
      where: {
        project: {
          workspace: {
            ownerId: userId,
          },
        },
        deletedAt: null,
      },
      select: {
        status: {
          select: {
            name: true,
            color: true,
          },
        },
      },
    });
    
    const statusStats: Record<string, { count: number; color: string }> = {};
    for (const task of tasks) {
      const statusName = task.status?.name ?? 'Unknown';
      const statusColor = task.status?.color ?? 'grey';
      statusStats[statusName] = {
        count: (statusStats[statusName]?.count || 0) + 1,
        color: statusColor,
      }
    }

    const stats = {
      workspace: workspaceCount,
      project: projectCount,
      task: tasks.length,
      taskDetail: {
        total: tasks.length,
        status: statusStats,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}