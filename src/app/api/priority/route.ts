import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
  }

  const statuses = await prisma.taskPriority.findMany({
    where: {
      projectId: projectId
    },
    orderBy: {
      order: 'asc'
    }
  });

  return NextResponse.json(statuses);
}