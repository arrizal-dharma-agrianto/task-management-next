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

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const projectUser = await prisma.projectUser.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId: userId,
        },
      },
    });

    if (!projectUser) {
      return NextResponse.json({ error: 'Project user relation not found' }, { status: 404 });
    }

    const updatedProjectUser = await prisma.projectUser.update({
      where: {
        projectId_userId: {
          projectId: id,
          userId: userId,
        },
      },
      data: { role },
    });

    return NextResponse.json({
      projectUser: updatedProjectUser,
      message: 'Project user role updated successfully',
    });
  } catch (error) {
    console.error('Error updating project user role:', error);
    return NextResponse.json({ error: 'Failed to update project user role' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest, { params }: { params: { id: string, userId: string } }
) {
  try {
    const { id, userId } = params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const projectUser = await prisma.projectUser.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId: userId,
        },
      },
    });

    if (!projectUser) {
      return NextResponse.json({ error: 'Project user relation not found' }, { status: 404 });
    }

    await prisma.projectUser.delete({
      where: {
        projectId_userId: {
          projectId: id,
          userId: userId,
        },
      },
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}