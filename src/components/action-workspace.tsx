import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenuAction,
  useSidebar,
} from "@/components/ui/sidebar"
import { deleteWorkspace } from "@/service/workspace"
import { removeWorkspace, setIsEditNameWorkspace } from "@/store/slices/navigationSlice"
import { openSheet } from "@/store/slices/uiSlice"
import { RootState } from "@/store/store"
import {
  Eye,
  Folder,
  MoreHorizontal,
  PenBox,
  Trash2,
  Users,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"

export default function ActionWorkspace({ id, role }: { id: string, role: string }) {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)
  const { isMobile } = useSidebar()
  const router = useRouter();

  const handleDeleteWorkspace = async () => {
    const res = await deleteWorkspace(id, user.id)
    if (res.workspace) {
      dispatch(removeWorkspace(id))
      router.replace("/dashboard")
    } else {
      alert("Failed to delete workspace")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction showOnHover className={`${(role === 'ADMIN' || role === 'OWNER') ? '-translate-x-7' : ''}`}>
          <MoreHorizontal />
          <span className="sr-only">More</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align={isMobile ? "end" : "start"}
      >
        <DropdownMenuItem onClick={() => { router.push(`/workspace/${id}`) }}>
          <Eye className="text-muted-foreground" />
          <span>View</span>
        </DropdownMenuItem>
        {role === 'ADMIN' || role === 'OWNER' &&
          <DropdownMenuItem onClick={() => { dispatch(setIsEditNameWorkspace({ id, isEditName: true })) }}>
            <PenBox className="text-muted-foreground" />
            <span>Rename</span>
          </DropdownMenuItem>
        }
        <DropdownMenuItem onClick={() => {
          router.push(`/workspace/${id}`)
          dispatch(openSheet({ isSheetOpen: true, sheetContent: "workspace-members", id }))
        }} >
          <Users className="text-muted-foreground" />
          <span>Members</span>
        </DropdownMenuItem>
        {role === 'ADMIN' || role === 'OWNER' &&
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDeleteWorkspace}>
              <Trash2 className="text-muted-foreground" />
              <span>Delete</span>
            </DropdownMenuItem>
          </>
        }
      </DropdownMenuContent>
    </DropdownMenu >
  )
}