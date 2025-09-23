import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const emailQuery = searchParams.get("email")?.toLowerCase() || "";

  const users = await prisma.user.findMany({});
  const filtered = users.filter(user =>
    user.email.toLowerCase().includes(emailQuery)
  );

  // Map the filtered users to the desired format
  const formattedUsers = filtered.map(user => ({
    id: user.id,
    name: user.fullName,
    email: user.email,
    username: user.username,
    avatar: user.avatarUrl,
  }));

  return NextResponse.json(formattedUsers);
}
