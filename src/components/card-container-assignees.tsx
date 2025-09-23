import * as React from "react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

export default function CardConAssignees({ assignees }: { assignees: any }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center mt-1 cursor-pointer">
          <div className="flex space-x-[-7px]">
            {assignees.slice(0, 3).map((assignee: { id: string; fullName: string }, idx: number) => {
              const initials = assignee.fullName
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();
              return (
                <div
                  key={assignee.id}
                  className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-700"
                  style={{ zIndex: assignees.length - idx }}
                >
                  {initials}
                </div>
              );
            })}
            {assignees.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-700">
                +{assignees.length - 3}
              </div>
            )}
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-fit p-2">
        <div className="flex flex-col space-y-2">
          {assignees.map((assignee: { id: string; fullName: string }) => {
            const initials = assignee.fullName
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();
            return (
              <div key={assignee.id} className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
                  {initials}
                </div>
                <span className="text-sm text-slate-800">{assignee.fullName}</span>
              </div>
            );
          })}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
