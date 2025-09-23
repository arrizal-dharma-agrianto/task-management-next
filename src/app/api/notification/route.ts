import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  const { userId, message } = body;

  if (!userId || !message) {
    return NextResponse.json({ error: 'userId and message are required' }, { status: 400 });
  }

  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        message,
      },
    });
    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || null;

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: userId || undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
