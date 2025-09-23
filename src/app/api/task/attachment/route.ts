import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  const { url, taskId, fileName, size } = data;

  if (!url || !taskId || !fileName || !size) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const attachment = await prisma.attachment.create({
      data: {
        url,
        taskId,
        fileName,
        size,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error('Error creating attachment:', error);
    return NextResponse.json({ error: 'Failed to create attachment' }, { status: 500 });
  }
}

