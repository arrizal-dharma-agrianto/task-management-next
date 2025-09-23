import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  // const checkResult = await checkWorkspaceAndAuthorize(id, ownerId);
  // if ('error' in checkResult) {
  //   return NextResponse.json({ error: checkResult.error }, { status: checkResult.status });
  // }
  const workspace = await prisma.workspace.findUnique({
    where: { id },
    include: {
      projects: {
        include: {
          tasks: {
            where: {
              deletedAt: null,
            },
            include: {
              status: true,
            }
          },
        }
      },
    }
  });
  if (!workspace) {
    return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
  }

  const projects = workspace.projects.map(project => {
    // Flexible status breakdown
    const status: Record<string, number> = {};
    project.tasks.forEach(task => {
      const statusName = task.status?.name ?? 'Unknown';
      status[statusName] = (status[statusName] || 0) + 1;
    });
    return {
      id: project.id,
      name: project.name,
      totalTasks: project.tasks.length,
      status,
    };
  });

  return NextResponse.json({
    message: 'Workspace retrieved successfully',
    workspace: {
      ...workspace,
      projects,
    }
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const { name, ownerId } = await req.json();
  if (!name || !ownerId) {
    return NextResponse.json({ error: 'Name and Owner ID are required' }, { status: 400 });
  }

  const checkResult = await checkWorkspaceAndAuthorize(id, ownerId);
  if ('error' in checkResult) {
    return NextResponse.json({ error: checkResult.error }, { status: checkResult.status });
  }

  const updatedWorkspace = await prisma.workspace.update({
    where: { id },
    data: { name },
  });

  return NextResponse.json({
    message: 'Workspace updated successfully',
    workspace: updatedWorkspace
  });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const { ownerId } = await req.json();
  if (!ownerId) {
    return NextResponse.json({ error: 'Owner ID is required' }, { status: 400 });
  }

  const checkResult = await checkWorkspaceAndAuthorize(id, ownerId);
  if ('error' in checkResult) {
    return NextResponse.json({ error: checkResult.error }, { status: checkResult.status });
  }

  const deletedWorkspace = await prisma.workspace.delete({
    where: { id },
  });

  return NextResponse.json({
    message: 'Workspace deleted successfully',
    workspace: deletedWorkspace
  });
}

async function checkWorkspaceAndAuthorize(id: string, ownerId: string) {
  const workspace = await prisma.workspace.findUnique({
    where: { id },
  });

  if (!workspace) {
    return { error: 'Workspace not found', status: 404 };
  }

  if (workspace.ownerId !== ownerId) {
    return { error: 'Unauthorized', status: 403 };
  }

  return { workspace };
}