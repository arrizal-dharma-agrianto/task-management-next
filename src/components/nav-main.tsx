"use client"

import { Briefcase, ChevronRight, KanbanSquare, Plus, } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarMenuAction,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { CreateWorkspace } from "./create-workspace"
import { useState } from "react"
import { CreateProject } from "./create-project"
import { useDispatch } from "react-redux"
import { changeStatusWorkspace } from "@/store/slices/navigationSlice"
import ActionWorkspace from "./action-workspace"
import ActionProject from "./action-project"
import RenameWorkspace from "./rename-workspace"
import RenameProject from "./rename-project"

export function NavMain({ title = 'My Workspace', items, invited = false }: { title?: string, items: NavGroup, invited?: boolean }) {
  const dispatch = useDispatch();
  const { isMobile } = useSidebar();
  const [dropdownStates, setDropdownStates] = useState<Record<string, boolean>>({});

  const handleDropdownToggle = (id: string) => {
    setDropdownStates((prevStates) => ({
      ...prevStates,
      [id]: !prevStates[id],
    }));
  };

  return (
    <Collapsible defaultOpen={true} className="group/work-collapsible my-0">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger className="relative group/test transition-opacity">
            {title}
            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/work-collapsible:rotate-90 opacity-0 group-hover/test:opacity-100 group-hover:transition-opacity" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        {!invited && (
          <DropdownMenu open={dropdownStates['workspace']} onOpenChange={() => handleDropdownToggle('workspace')}>
            <DropdownMenuTrigger asChild>
              <SidebarGroupAction>
                <Plus />
                <span className="sr-only">Add</span>
              </SidebarGroupAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="rounded-lg p-4"
              side={isMobile ? "right" : "right"}
              align={isMobile ? "start" : "start"}
            >
              <CreateWorkspace onSuccess={() => handleDropdownToggle('workspace')} />
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <CollapsibleContent>
          {items.length === 0 ? (
            <div className="p-4 space-y-5">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center space-x-3 animate-pulse">
                    <div className="w-5 h-5 bg-muted rounded-md" />
                    <div className="h-4 bg-muted rounded w-40" />
                  </div>
                  <div className="ml-8 space-y-2">
                    {[...Array(2)].map((_, j) => (
                      <div key={j} className="flex items-center space-x-3 animate-pulse">
                        <div className="w-4 h-4 bg-muted rounded" />
                        <div className="h-3 bg-muted rounded w-32" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          ) : (
            <SidebarMenu>
              {items.map((item: NavGroup) => (
                <Collapsible
                  key={item.id}
                  asChild
                  open={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title} tabIndex={-1} onClick={() => {
                        if (!item.isEditName) {
                          dispatch(changeStatusWorkspace(item.id));
                        }
                      }}>
                        <Briefcase />
                        {item.isEditName ? (
                          <RenameWorkspace key={item.id + '-edit'} item={item} />
                        ) : (
                          <span>{item.title}
                            <Badge
                              className="ml-3 h-5 min-w-5 rounded-full px-1 tabular-nums"
                              variant="outline"
                            >
                              {item.items.length || 0}
                            </Badge>
                          </span>
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    {/* Dropdown Add */}
                    {
                      (item.role === 'ADMIN' || item.role === 'OWNER') &&
                      <DropdownMenu open={dropdownStates[item.id]} onOpenChange={() => handleDropdownToggle(item.id)}>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction>
                            <Plus />
                            <span className="sr-only">Add</span>
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="rounded-lg p-4"
                          side={isMobile ? "bottom" : "right"}
                          align={isMobile ? "end" : "start"}
                        >
                          <CreateProject workspaceId={item.id} onSuccess={() => handleDropdownToggle(item.id)} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    }

                    <ActionWorkspace id={item.id} role={item.role} />

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem: NavItem) => (
                          <SidebarMenuSubItem key={subItem.id}>
                            <Link href={`/project/${subItem.id}`}>
                              <SidebarMenuSubButton asChild>
                                <div className={`flex items-center text-sm ${typeof window !== "undefined" && window.location.pathname === `/project/${subItem.id}` ? "bg-slate-200" : ""}`}>
                                  <KanbanSquare />
                                  {subItem.isEditName ? (
                                    <RenameProject key={subItem.id + '-edit'} item={subItem} />
                                  ) : (
                                    <span >
                                      {subItem.title}
                                    </span>
                                  )}
                                  {
                                    (subItem.role === 'ADMIN' || subItem.role === 'OWNER') &&
                                    <div onClick={(e) => e.stopPropagation()} className="ml-auto">
                                      <ActionProject id={subItem.id} />
                                    </div>
                                  }

                                </div>
                              </SidebarMenuSubButton>
                            </Link>
                          </SidebarMenuSubItem>
                        ))
                        }
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          )}
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible >
  )
}
