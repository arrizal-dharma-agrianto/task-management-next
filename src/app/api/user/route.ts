import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const id = user?.id || null;

  const userProfile = await prisma.user.findUnique({
    where: { id: id || undefined },
  });

  return NextResponse.json(
    {
      id: userProfile?.id,
      name: userProfile?.fullName,
      username: userProfile?.username,
      email: userProfile?.email,
      avatar: userProfile?.avatarUrl,
    }
  );
}