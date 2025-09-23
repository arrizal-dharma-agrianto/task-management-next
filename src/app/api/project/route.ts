import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import defaultStatuses from '@/app/default/task-status';
import defaultPriorities from '@/app/default/task-priority';

export async function GET() {
  const projects = await prisma.project.findMany();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const { name, workspaceId } = await request.json();
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) {
    return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
  }

  const project = await prisma.project.create({
    data: {
      name,
      workspaceId
    },
  });
  
  await prisma.projectUser.create({
    data: {
      userId: workspace.ownerId,
      projectId: project.id,
      role: 'OWNER',
    },
  });

  await createDefaultTaskStatuses(project.id);
  await createDefaultTaskPriorities(project.id);
  console.log('project', project);
  return NextResponse.json({ ...project, userId: workspace.ownerId });
}

const createDefaultTaskStatuses = async (projectId: string) => {
  const taskStatuses = defaultStatuses.map((status, index) => ({
    name: status.name,
    color: status.color,
    order: index,
    projectId,
  }));

  await prisma.taskStatus.createMany({
    data: taskStatuses,
  });
}

const createDefaultTaskPriorities = async (projectId: string) => {
  const taskPriorities = defaultPriorities.map((priority, index) => ({
    name: priority.name,
    color: priority.color,
    order: index,
    projectId,
  }));

  await prisma.taskPriority.createMany({
    data: taskPriorities,
  });
}

