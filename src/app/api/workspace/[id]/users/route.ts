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

  const res = await prisma.workspace.findUnique({
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

  if (res?.users) {
    res.users.sort((a, b) => (roleOrder[a.role] ?? 99) - (roleOrder[b.role] ?? 99));
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

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const workspaceUser = await prisma.workspaceUser.create({
      data: {
        workspaceId: id,
        userId: user.id,
        role,
      },
    });

    return NextResponse.json({
      workspaceUser,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      message: 'User added successfully',
    });
  } catch (error) {
    console.error('Error adding user to worksapce:', error);
    return NextResponse.json({ error: 'Failed to add user to workspace' }, { status: 500 });
  }
}
