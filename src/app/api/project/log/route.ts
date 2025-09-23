import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  const { userId, taskId, projectId, action } = body;

  if (!userId || !action) {
    return NextResponse.json({ error: 'userId and action are required' }, { status: 400 });
  }

  try {
    const activityLog = await prisma.activityLog.create({
      data: {
        userId,
        taskId,
        projectId,
        action,
      },
    });
    return NextResponse.json(activityLog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create activity log' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
  }

  try {
    const activityLogs = await prisma.activityLog.findMany({
      where: { projectId },
      include: {
        user: true,
        project: true,
        task:true,
      },

      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(activityLogs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch activity logs' }, { status: 500 });
  }
}