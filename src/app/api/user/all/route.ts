import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {

  const userProfile = await prisma.user.findMany({})

  return NextResponse.json(
    userProfile.map((user) => ({
      id: user.id,
      name: user.fullName,
      username: user.username,
      email: user.email,
      avatar: user.avatarUrl,
    }))
  );
  
  
}