"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { closeSheet } from "@/store/slices/uiSlice";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { deleteWorkspaceUser, getWorkspaceMembers, postWorkspaceUserByEmail, updateWorkspaceUserRole } from "@/service/workspace";
import { WorkspaceMembersItem } from "./workspace-members-item";
import { Loading } from "./ui/loading";
import { searchUserByEmail } from "@/service/user";

export default function WorkspaceMembers({ id }: { id: string }) {
  const dispatch = useDispatch();
  const ui = useSelector((state: RootState) => state.ui);

  const [members, setMembers] = useState<membersProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [suggestions, setSuggestions] = useState<membersProps[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState("VIEWER");

  const fetchData = async (id: string) => {
    const res = await getWorkspaceMembers(id);
    if (res) {
      setMembers(res.users.map((user: any) => ({
        name: user.user.fullName,
        role: user.role,
        id: user.user.id,
        email: user.user.email,
      })));
      setRole(res.userRole);
    }
  }
  useEffect(() => {
    fetchData(id);
  }, [id]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setError(null);
    if (value.length > 1) {
      const result = await searchUserByEmail(value);
      console.log("Search result:", result);

      const existingIds = members.map(m => m.id);
      const filtered = result.filter((user: any) => !existingIds.includes(user.id));
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleAddMember = async () => {
    if (!email) return;
    setIsLoading(true);
    setError(null);
    const res = await postWorkspaceUserByEmail(id, email, "VIEWER");
    if (res.error) {
      setError(res.error);
      console.error("Error adding member:", res.error);
      setIsLoading(false);
      return;
    }
    if (res) {
      setMembers((prev) => [...prev, { name: res.user.fullName, role: "VIEWER", id: res.workspaceUser.userId, email }]);
      setEmail("");
    }
    setIsLoading(false);
  }

  const handleUpdateRole = async (userId: string, role: string) => {
    const res = await updateWorkspaceUserRole(id, userId, role);
    if (res.error) {
      console.error("Error updating role:", res.error);
      return;
    }

    setMembers((prev) => prev.map((member) => member.id === userId ? { ...member, role } : member));
  }

  const handleDeleteMember = async (userId: string) => {
    const res = await deleteWorkspaceUser(id, userId);
    if (res.error) {
      console.error("Error deleting member:", res.error);
      return;
    }
    setMembers((prev) => prev.filter((member) => member.id !== userId));
  }

  return (
    <Sheet
      open={ui.isSheetOpen && ui.sheetContent === "workspace-members" && ui.id === id}
      onOpenChange={() => {
        dispatch(closeSheet())
        setTimeout(() => {
          document.body.style.pointerEvents = "auto";
        }, 500)
      }}
    >
      <SheetContent className="pb-0">
        <SheetHeader>
          <SheetTitle>Workspace Members</SheetTitle>
          <SheetDescription>
            View and manage the members of this workspace. You can remove members at any time.
          </SheetDescription>
          <div className="flex flex-col justify-between gap-4 mt-4 h-[calc(100vh-120px)]">
            <div className="grid flex-1 auto-rows-min gap-4 mt-6 overflow-auto max-h-full">
              {members.length === 0 ? (
                <>
                  <div className="flex items-center justify-between gap-2 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted" />
                      <div>
                        <div className="h-4 w-24 bg-muted rounded mb-1" />
                        <div className="h-3 w-16 bg-muted rounded" />
                      </div>
                    </div>
                    <div className="h-8 w-8 bg-muted rounded-full" />
                  </div>
                  <div className="flex items-center justify-between gap-2 animate-pulse mt-2">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted" />
                      <div>
                        <div className="h-4 w-20 bg-muted rounded mb-1" />
                        <div className="h-3 w-14 bg-muted rounded" />
                      </div>
                    </div>
                    <div className="h-8 w-8 bg-muted rounded-full" />
                  </div>
                  <div className="flex items-center justify-between gap-2 animate-pulse mt-2">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted" />
                      <div>
                        <div className="h-4 w-16 bg-muted rounded mb-1" />
                        <div className="h-3 w-12 bg-muted rounded" />
                      </div>
                    </div>
                    <div className="h-8 w-8 bg-muted rounded-full" />
                  </div>
                </>
              ) : (
                members.map((member, idx) => (
                  <WorkspaceMembersItem
                    role={role}
                    key={idx}
                    member={member}
                    onDelete={() => { handleDeleteMember(member.id) }}
                    onUpdate={handleUpdateRole}
                  />
                ))
              )}
            </div>
            {(role === "OWNER" || role === "ADMIN") &&
              <div>
                <h2 className="font-bold text-md mb-3">Add new member</h2>
                <div className="flex items-center gap-2 w-full">
                  <div className="relative flex flex-col-reverse flex-grow">
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute bottom-full z-10 w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded shadow-md mb-3">
                        {suggestions.map((user, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setEmail(user.email ?? "");
                              setShowSuggestions(false);
                            }}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-300 cursor-pointer flex items-center gap-3"
                          >
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                              {(user.name ?? "")
                                .split(" ")
                                .slice(0, 2)
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <Input
                      onChange={handleInputChange}
                      value={email}
                      type="email"
                      placeholder="Email"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    disabled={isLoading || !email || email === ""}
                    onClick={handleAddMember}  >
                    {isLoading ? <Loading /> : "Add"}
                  </Button>
                </div>
                <p className="text-sm min-h-8 text-destructive mt-1">
                  {error}
                </p>
              </div>
            }
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}