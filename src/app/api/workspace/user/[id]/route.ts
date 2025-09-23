import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || null;

  try {
    // Workspaces owned by the user
    const workspaces = await prisma.workspace.findMany({
      where: {
        ownerId: id,
      },
      include: {
        projects: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: [
        {
          createdAt: 'asc',
        },
      ],
    })

    // Workspaces where the user is invited (assigned)
    const invited = await prisma.workspace.findMany({
      where: {
        users: {
          some: {
            userId: id,
            role: {
              notIn: ['OWNER'] // Adjust roles as needed
            },
          },
        },
      },
      include: {
        projects: {
          where: {
            users: {
              some: {
                userId: id,
              },
            },
          },
          include: {
            users: {
              where: {
                userId: id,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        users: {
          where: {
            userId: id,
          },
        },
      },
      orderBy: [
        {
          createdAt: 'asc',
        },
      ],
    })

    // Add userRole: 'Admin' to all projects in owned workspaces
    const workspacesWithRole = workspaces.map(ws => ({
      ...ws,
      userRole: 'OWNER',
      projects: ws.projects.map(project => ({
        ...project,
        userRole: 'OWNER'
      }))
    }));

    // Add userRole from users[0].role to all projects in invited workspaces
    const invitedWithRole = invited.map(ws => {
      // Ambil role dari users[0] di tingkat workspace
      const workspaceUserRole = ws.users[0]?.role || null;
      return {
      ...ws,
      userRole: workspaceUserRole,
      // Hapus users di tingkat workspace
      users: undefined,
      projects: ws.projects.map(project => {
        // Ambil role dari users[0] di tingkat project
        const projectUserRole = project.users?.[0]?.role || workspaceUserRole;
        return {
        ...project,
        userRole: projectUserRole,
        // Hapus users di tingkat project
        users: undefined,
        };
      }),
      };
    }).map(ws => {
      // Hapus properti users yang undefined
      const { users, ...rest } = ws;
      return {
      ...rest,
      projects: ws.projects.map(project => {
        const { users, ...restProject } = project;
        return restProject;
      }),
      };
    });

    return NextResponse.json({ workspaces: workspacesWithRole, invited: invitedWithRole })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user workspaces' }, { status: 500 })
  }
}