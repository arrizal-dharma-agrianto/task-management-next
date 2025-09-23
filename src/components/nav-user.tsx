"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { logout } from "@/app/(auth)/action"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter();

  const nameToAvatar = (name: string) => {
    const words = name.split(" ");
    return words
      .map((word, index) => (index < 2 && word[0] ? word[0].toUpperCase() : ""))
      .join("");
  };

  const handleLogout = async () => {
    try {
      const res = await logout();
      if( res.success ) {
        toast.success("Logout successful!", {
          duration: 5000,
          description: "You have been logged out successfully.",
        });
        router.replace("/login");
      } else {
        toast.error(`Logout failed. ${res.message || 'Something went wrong'}`, {
          duration: 5000,
          description: "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(`Logout failed. ${error instanceof Error ? error.message : 'Something went wrong'}`, {
        duration: 5000,
        description: "Please try again later.",
      });
    }
  };

  return (
    !user?.name ? (
      // Skeleton ketika user belum tersedia
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center space-x-3 p-3 animate-pulse">
            <div className="w-8 h-8 bg-muted rounded-lg" />
            <div className="flex flex-col space-y-1">
              <div className="w-32 h-3 bg-muted rounded" />
              <div className="w-24 h-2 bg-muted rounded" />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    ) : (
      // Konten asli ketika user sudah tersedia
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{nameToAvatar(user.name)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">{nameToAvatar(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {/* <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={() => router.push("/notification")}>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  );
}
