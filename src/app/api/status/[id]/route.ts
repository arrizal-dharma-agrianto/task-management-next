import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }){
  const { id } = params;
  const data = await req.json();
  console.log('Updating status with data:', data);

  const { name, color } = data;

  const updatedStatus = await prisma.taskStatus.update({
    where: { id },
    data: {
      name,
      color,
    },
  });

  return NextResponse.json({
    message: 'Status updated successfully',
    status: updatedStatus,
  });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const deletedStatus = await prisma.taskStatus.delete({
    where: { id },
  });

  return NextResponse.json({
    message: 'Status deleted successfully',
    status: deletedStatus,
  });
}