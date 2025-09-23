import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || null;

  const roleOrder = { OWNER: 1, ADMIN: 2, MEMBER: 3, VIEWER: 4 };

  const res = await prisma.project.findUnique({
    where: { id },
    select: {
      users: {
        include: {
          user: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    }
  });

  // Sort users array based on custom role order
  if (res?.users) {
    res.users.sort((a: { role: string }, b: { role: string }) => (roleOrder[a.role] ?? 99) - (roleOrder[b.role] ?? 99));
  }

  const userRole = res?.users?.find((u) => u.userId === userId)?.role || null;

  return NextResponse.json({
    users: res?.users,
    userRole,
    message: 'Users fetched successfully',
  });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { email, role } = body;

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        workspace: {
          include: {
            users: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await prisma.notification.create({
      data: {
        userId: user.id,
        message: `You have been added to the project "${project.name}"`,
        url: `/project/${id}`,
      },
    });

    // Check if user is already in the workspace
    const isInWorkspace = project.workspace.users.some(
      (wu) => wu.userId === user.id
    );

    if (!isInWorkspace) {
      await prisma.workspaceUser.create({
        data: {
          workspaceId: project.workspace.id,
          userId: user.id,
          role: 'VIEWER',
        },
      });
    }

    const projectUser = await prisma.projectUser.create({
      data: {
        projectId: id,
        userId: user.id,
        role,
      },
    });

    return NextResponse.json({
      projectUser,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      message: 'User added successfully',
    });
  } catch (error) {
    console.error('Error adding user to project:', error);
    return NextResponse.json({ error: 'Failed to add user to project' }, { status: 500 });
  }
}
