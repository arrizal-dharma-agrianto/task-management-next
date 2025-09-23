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
import { deleteProject } from "@/service/project"
import { removeProject, setIsEditNameProject } from "@/store/slices/navigationSlice"
import { openSheet } from "@/store/slices/uiSlice"
import { RootState } from "@/store/store"
import {
  MoreHorizontal,
  PenBoxIcon,
  Trash2,
  Users,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"

export default function ActionProject({ id }: { id: string }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const user = useSelector((state: RootState) => state.user)
  const { isMobile } = useSidebar()

  const handleDeleteProject = async () => {
    const res = await deleteProject(id, user.id)
    if (res.project) {
      dispatch(removeProject(id))
    } else {
      alert("Failed to delete project")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction showOnHover className="">
          <MoreHorizontal />
          <span className="sr-only">More</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align={isMobile ? "end" : "start"}
      >
        <DropdownMenuItem onClick={() => {
          router.push(`/project/${id}`)
          dispatch(openSheet({ isSheetOpen: true, sheetContent: "project-members", id }))
        }}>
          <Users className="text-muted-foreground" />
          <span>Members</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { dispatch(setIsEditNameProject({ id, isEditName: true })) }}>
          <PenBoxIcon className="text-muted-foreground" />
          <span>Rename</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDeleteProject}>
          <Trash2 className="text-muted-foreground" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}