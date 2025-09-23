import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || null;

  try {
    const count = await prisma.notification.count({
      where: {
        userId: userId || undefined,
        read: false,
      },
    });
    console.log('Notification count for user:', userId, 'is', count);
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notification count' }, { status: 500 });
  }
}
