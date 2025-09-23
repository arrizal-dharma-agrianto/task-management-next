'use client';

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { setUser } from '@/store/slices/userSlice';
import { setIsWelcome } from '@/store/slices/isWelcome';
import { setNavigation } from '@/store/slices/navigationSlice';
import { Welcome } from "../welcome";
import Link from "next/link";
import { useRedirectReasonToast } from "@/hooks/auth-redirect-toast";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import NotifBell from "../ui/header-bell";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const isWelcome = useSelector((state: RootState) => state.isWelcome);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  useRedirectReasonToast();
  useEffect(() => {
    const loadData = async () => {
      const res = await fetch('/api/user');
      const data = await res.json();

      if (data) {
        dispatch(setUser(data));
      } else {
        console.error('Failed to fetch user:', res.statusText);
      }

      if (data.id !== '') {
        const workspaceRes = await fetch(`/api/workspace/user/${data.id}`);
        const workspaceData = await workspaceRes.json();

        if (workspaceData.workspaces.length === 0) {
          dispatch(setIsWelcome(true));
        }

        dispatch(setNavigation(workspaceData));
      }
    };

    loadData();
  }, [dispatch]);

  const { breadcrumbs } = useSelector((state: RootState) => state.breadcumb ?? { breadcrumbs: [] });
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between pr-8">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.length === 0 ? (
                  <>
                    <BreadcrumbItem>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    </BreadcrumbItem>
                  </>
                ) : (
                  breadcrumbs.map((crumb, idx) => (
                    <span key={crumb.id} className="flex items-center">
                      <BreadcrumbItem>
                        {idx < breadcrumbs.length - 1 ? (
                          <BreadcrumbLink asChild>
                            <Link href={crumb.url}>
                              {crumb.name}
                            </Link>
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {idx < breadcrumbs.length - 1 && (
                        <BreadcrumbSeparator className="ml-2 hidden md:block" />
                      )}
                    </span>
                  ))
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <NotifBell />
        </header>
        {children}
        {
          isWelcome && <Welcome />
        }
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainLayout;