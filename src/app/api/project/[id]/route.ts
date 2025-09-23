import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || null;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      workspace: true,
      taskStatuses: {
        orderBy: {
          order: 'asc',
        },
        include: {
          tasks: {
            where: {
              deletedAt: null,
            },
            include: {
              assignees: true,
              status: true,
              priority: true,
              attachments: {
                orderBy: {
                  createdAt: 'desc',
                },
              },
            },
          },
        },
      },
      users: {
        where: userId ? { userId } : undefined,
      },
    },
  });


  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const { users, ...restProject } = project as any;
  const userRole = users && users.length > 0 ? users[0].role : null;
  return NextResponse.json({ ...restProject, userRole });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { name, ownerId } = await req.json();

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const authResult = await findAndAuthorizeProject(id, ownerId);
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const updatedProject = await prisma.project.update({
    where: { id },
    data: { name },
  });

  return NextResponse.json({
    message: 'Project updated successfully',
    project: updatedProject,
  });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { ownerId } = await req.json();

  // const authResult = await findAndAuthorizeProject(id, ownerId);
  // if ('error' in authResult) {
  //   return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  // }

  const deletedProject = await prisma.project.delete({
    where: { id },
  });

  return NextResponse.json({
    message: 'Project deleted successfully',
    project: deletedProject,
  });
}

async function findAndAuthorizeProject(id: string, ownerId: string) {
  if (!ownerId) {
    return { error: 'Owner ID is required', status: 400 };
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      workspace: true,
    },
  });

  if (!project) {
    return { error: 'Project not found', status: 404 };
  }

  if (project.workspace.ownerId !== ownerId) {
    return { error: 'Unauthorized', status: 403 };
  }

  return { project };
}