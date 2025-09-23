import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { getProjectMembers } from "@/service/project"
import { Loading } from "./ui/loading"

const getInitials = (name: string) => {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export default function TaskDetailAssignee({
  id,
  assignees,
  onUpdate,
  role
}: {
  id: string,
  assignees?: string[]
  onUpdate?: any
  role?: string
}) {
  const [members, setMembers] = useState<membersProps[]>([])

  const [open, setOpen] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<string[]>(assignees || [])

  const areArraysEqual = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false
    const sortedA = [...a].sort()
    const sortedB = [...b].sort()
    return sortedA.every((val, index) => val === sortedB[index])
  }

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await getProjectMembers(id)
        setMembers(
          Array.isArray(res.users)
            ? res.users.map((m: any) => ({
              id: m.userId,
              name: m.user?.fullName || "Unknown",
            }))
            : []
        )
      } catch (error) {
        console.error("Failed to fetch members:", error)
        setMembers([])
      }
    }
    fetchMembers()
  }, [id])

  useEffect(() => {
    if (onUpdate && !open && !areArraysEqual(selectedMembers, assignees || [])) {
      onUpdate(selectedMembers)
    }
  }, [assignees, onUpdate, open, selectedMembers])

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  const selectedLabels = members
    .filter((m) => selectedMembers.includes(m.id))
    .map((m) => m.name)
    .join(", ")

  return (
    <div className={`${(role !== "ADMIN" && role !== "OWNER") ? '' : 'max-w-[280px]'} w-full`}>
      <Label className="text-muted-foreground">Assignee</Label>
      {role !== "ADMIN" && role !== "OWNER" ? (
        <div className="flex items-start mt-2">
          {/* Avatar Section */}
          <div className="flex items-center mr-2 shrink-0">
            {selectedMembers.length === 1 && (
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                {getInitials(members.find((m) => m.id === selectedMembers[0])?.name || "")}
              </div>
            )}
            {selectedMembers.length > 1 && (
              <div className="flex -space-x-2">
                {selectedMembers.slice(0, 3).map((id) => {
                  const member = members.find((m) => m.id === id)
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-[10px] font-medium text-muted-foreground border border-background"
                    >
                      {getInitials(member?.name || "")}
                    </div>
                  )
                })}
                {selectedMembers.length > 3 && (
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-[10px] font-medium text-muted-foreground border border-background">
                    +{selectedMembers.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Name Section */}
          <span className="text-sm text-left w-full text-muted-foreground">
            {selectedMembers.length > 0 ? selectedLabels : "No assignee"}
          </span>
        </div>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between mt-2 px-3 py-2 h-auto">
              <div className="flex items-center w-full">
                {/* Avatar Section */}
                <div className="flex items-center mr-2 shrink-0">
                  {selectedMembers.length === 1 && (
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      {getInitials(members.find((m) => m.id === selectedMembers[0])?.name || "")}
                    </div>
                  )}
                  {selectedMembers.length > 1 && (
                    <div className="flex -space-x-2">
                      {selectedMembers.slice(0, 3).map((id) => {
                        const member = members.find((m) => m.id === id)
                        return (
                          <div
                            key={id}
                            className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-[10px] font-medium text-muted-foreground border border-background"
                          >
                            {getInitials(member?.name || "")}
                          </div>
                        )
                      })}
                      {selectedMembers.length > 3 && (
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-[10px] font-medium text-muted-foreground border border-background">
                          +{selectedMembers.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Name Section */}
                <span className="flex-1 truncate text-sm text-left text-muted-foreground">
                  {selectedMembers.length > 0 ? selectedLabels : "Select assignees"}
                </span>

                {/* Icon Section */}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0">
            <Command>
              <CommandInput placeholder="Search members..." />
              <CommandEmpty>
                <div className="flex justify-center items-center py-4">
                  <Loading variant="black" />
                </div>
              </CommandEmpty>
              <CommandGroup>
                {members.map((member) => (
                  <CommandItem
                    key={member.id}
                    onSelect={() => toggleMember(member.id)}
                    className="cursor-pointer flex items-center space-x-2"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                        {getInitials(member.name)}
                      </div>
                      <span>{member.name}</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedMembers.includes(member.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
