import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const workspaces = await prisma.workspace.findMany();
  return NextResponse.json(workspaces);
}

export async function POST(request: Request) {
  const { name, ownerId } = await request.json();
  const user = await prisma.user.findUnique({
    where: { id: ownerId },
  });

  const workspace = await prisma.workspace.create({
    data: {
      name,
      ownerId,
    },
  });

  await prisma.workspaceUser.create({
    data: {
      userId: ownerId,
      workspaceId: workspace.id,
      role: 'OWNER',
    },
  });
  return NextResponse.json(workspace);
}


