import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
  }

  const statuses = await prisma.taskStatus.findMany({
    where: {
      projectId: projectId
    },
    orderBy: {
      order: 'asc'
    }
  });

  return NextResponse.json(statuses);
}

export async function POST(request: Request) {
  const data = await request.json();

  const status = await prisma.taskStatus.create({
    data
  });

  return NextResponse.json(status);
}
