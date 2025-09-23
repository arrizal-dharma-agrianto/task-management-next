import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'

export async function PUT(
  req: NextRequest, { params }: { params: { id: string, userId: string } }
) {
  try {
    const { id, userId } = params;
    const body = await req.json();
    const { role } = body;

    const workspace = await prisma.workspace.findUnique({
      where: { id },
    });
    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const workspaceUser = await prisma.workspaceUser.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: id,
          userId: userId,
        },
      },
    });
    if (!workspaceUser) {
      return NextResponse.json({ error: 'Workspace user relation not found' }, { status: 404 });
    }

    const updatedWorkspaceUser = await prisma.workspaceUser.update({
      where: {
        workspaceId_userId: {
          workspaceId: id,
          userId: userId,
        },
      },
      data: { role },
    });

    return NextResponse.json({
      workspaceUser: updatedWorkspaceUser,
      message: 'Role updated successfully',
    });
  }
  catch (error) {
    console.error('Error updating workspace user role:', error);
    return NextResponse.json({ error: 'Failed to update workspace user role' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest, { params }: { params: { id: string, userId: string } }
) {
  try {
    const { id, userId } = params;
    const workspace = await prisma.workspace.findUnique({
      where: { id },
    });
    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }
    const workspaceUser = await prisma.workspaceUser.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: id,
          userId: userId,
        },
      },
    });
    if (!workspaceUser) {
      return NextResponse.json({ error: 'Workspace user relation not found' }, { status: 404 });
    }

    await prisma.workspaceUser.delete({
      where: {
        workspaceId_userId: {
          workspaceId: id,
          userId: userId,
        },
      },
    });

    return NextResponse.json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete workspace' }, { status: 500 });
  }
}