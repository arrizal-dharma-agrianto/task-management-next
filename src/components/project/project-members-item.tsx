import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const ProjectMembersItem = ({
  member,
  onDelete,
  onUpdate,
  role,
}: {
  member: any;
  onDelete: any;
  onUpdate: (userId: string, role: string) => void;
  role: string;
}) => {
  const userId = useSelector((state: RootState) => state.user.id);

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
          {member.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()}
        </div>
        <div>
          <div className="text-sm font-medium">{member.name}</div>
          {member.role === "OWNER" ? (
            <div className="text-xs text-muted-foreground">Owner</div>
          ) : member.id === userId ? (
            <div className="text-xs text-muted-foreground">
              {member.role.charAt(0).toUpperCase() + member.role.slice(1).toLowerCase()}
            </div>
          ) : (role === "MEMBER" || role === "VIEWER") ? (
            <div className="text-xs text-muted-foreground">
              {member.role.charAt(0).toUpperCase() + member.role.slice(1).toLowerCase()}
            </div>
          ) : (
            <Select
              value={member.role}
              onValueChange={(value) => onUpdate(member.id, value)}
            >
              <SelectTrigger className="h-7 px-2 text-xs text-muted-foreground bg-transparent outline-none border-0 focus:ring-0 focus:outline-none w-[90px] shadow-none">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MEMBER">Member</SelectItem>
                <SelectItem value="VIEWER">Viewer</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      {(role === "OWNER" || role === "ADMIN") && member.role !== "OWNER" && member.id !== userId && (
        <Button
          onClick={onDelete}
          variant="ghost"
          size="icon"
          aria-label="Remove member"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}