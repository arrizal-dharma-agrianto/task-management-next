"use client"

import { CalendarIcon } from "lucide-react";
import { Label } from "./ui/label";
import * as React from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function TaskDetailDue({ task, date, onUpdateDueDate }: any) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onUpdateDueDate(selectedDate);
      setOpen(false);
    };
  }

  return (
    <div className="flex flex-col gap-3">
      <Label className="text-muted-foreground">Due Date</Label>
      <div>
        {!task ? (
          <div className="h-6 w-64 bg-gray-200 rounded animate-pulse" />
        ) : task.role === "MEMBER" || task.role === "VIEWER" ? (
            <div>
            {task.dueDate
              ? format(new Date(task.dueDate), "EEEE, dd MMMM yyyy")
              : "-"}
            </div>
        ) : (
          date && (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className={cn("w-auto p-0")}>
                <Calendar
                  mode="single"
                  selected={date ? new Date(date) : undefined}
                  onSelect={handleSelect}
                  initialFocus
                  disabled={{ before: new Date() }}
                />
              </PopoverContent>
            </Popover>
          )
        )}
      </div>
    </div>
  );
}

