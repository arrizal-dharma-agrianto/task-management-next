"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { createClient } from "@/utils/supabase/client";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

type ChatMessage = {
  id: string;
  userId: string;
  name: string;
  message: string;
  createdAt?: string;
};

export default function ChatBox({ taskId, role }: { taskId: string, role: string }) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.user);
  const currentUserId = user.id || "default-user-id";
  const supabase = createClient();

  useEffect(() => {

    if (!taskId && !user.id) {
      console.error("Task ID is required to fetch comments.");
      return;
    }
    const fetchComments = async () => {

      const { data, error } = await supabase
        .from("Comment")
        .select("id, userId, content, taskId, user:User(id, fullName), createdAt")
        .eq("taskId", taskId)
        .order("createdAt", { ascending: true });

      if (error) {
        console.error("Error fetching comments:", error);
        return;
      }

      if (data) {
        const formatted = data.map((c: any) => ({
          id: c.id,
          userId: c.userId,
          name: c.user?.fullName || "Unknown",
          message: c.content,
          createdAt: c.createdAt,
        }));
        setChatMessages(formatted);
      }
    };

    fetchComments();

    // Realtime subscription

    const channel = supabase.channel('chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Comment' },
        async (payload) => {
          console.log('Change received!', payload);

          // Only add if the comment is for this task
          if (payload.new.taskId !== taskId) return;

          // Optionally, fetch user name if not present
          let name = "Unknown";
          if (payload.new.userId === user.id && user.name) {
            name = user.name;
          } else {
            // Try to get user name from DB if needed
            const { data } = await supabase
              .from("User")
              .select("fullName")
              .eq("id", payload.new.userId)
              .single();
            if (data?.fullName) name = data.fullName;
          }

          setChatMessages((prev) => [
            ...prev,
            {
              id: payload.new.id,
              userId: payload.new.userId,
              name,
              message: payload.new.content,
              createdAt: payload.new.createdAt,
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      console.log('👋 Unsubscribing...');
      supabase.removeChannel(channel);
    };

  }, [supabase, taskId, user.id, user.name]);


  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const sendMessage = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const { error } = await supabase.from("Comment").insert({
      content: trimmed,
      userId: currentUserId,
      taskId: taskId,
    });

    setChatInput("");
  };

  return (
    <Card className="w-full max-w-sm mx-auto flex flex-col h-full">
      <CardHeader className="shadow-b shadow-sm flex flex-row items-center justify-between p-4 pl-6">
        <CardTitle>Chat</CardTitle>
        {/* <Button
          variant="ghost"
          size="icon"
          aria-label="Close chat"
          className="ml-2 h-8 w-8 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <span>
            <ChevronRight className="h-5 w-5" />
          </span>
        </Button> */}
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-3 pt-4">
        {chatMessages?.map((msg, index) => {
          const isCurrentUser = msg.userId === currentUserId;
          const initial = msg.name
            .split(" ")
            .slice(0, 2)
            .map((n) => n.charAt(0).toUpperCase())
            .join("");

          const messageDate = dayjs(msg.createdAt).tz("Asia/Jakarta");
          const currentDate = messageDate.format("YYYY-MM-DD");
          const prevDate =
            index > 0 ? dayjs(chatMessages[index - 1].createdAt).tz("Asia/Jakarta").format("YYYY-MM-DD") : null;

          let dateLabel = messageDate.format("dddd, DD MMMM YYYY");

          const now = dayjs().tz("Asia/Jakarta");
          if (messageDate.isSame(now, "day")) {
            dateLabel = "Today";
          } else if (messageDate.isSame(now.subtract(1, "day"), "day")) {
            dateLabel = "Yesterday";
          }

          const showDateDivider = currentDate !== prevDate;

          return (
            <div key={msg.id} className="w-full">
              {/* Tanggal Divider */}
              {showDateDivider && (
                <div className="flex items-center justify-center my-4">
                  <div className="text-xs text-gray-500 bg-gray-100 px-4 py-1 rounded-full shadow">
                    {dateLabel}
                  </div>
                </div>
              )}

              {/* Bubble Chat */}
              <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
                <div
                  className={`flex items-center space-x-2 ${isCurrentUser ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-800 flex items-center justify-center text-sm font-bold">
                    {initial}
                  </div>
                  <div className="flex flex-col items-start">
                    <div
                      className={`relative px-3 py-2 rounded-lg max-w-xs text-sm ${isCurrentUser
                        ? "bg-primary text-white text-right"
                        : "bg-white text-black border"
                        }`}
                    >
                      <div className="text-xs font-semibold mb-1">{msg.name}</div>
                      <div>{msg.message}</div>
                    </div>

                    {msg.createdAt && (
                      <div
                        className={`text-[10px] mt-1 w-full ${isCurrentUser ? "text-right" : "text-left"
                          } text-muted-foreground`}
                      >
                        {dayjs(msg.createdAt).tz("Asia/Jakarta").format("HH:mm")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </CardContent>
      {
        (role === "ADMIN" || role === "OWNER" || role === "MEMBER") &&
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center gap-2 border-t p-4"
        >


          <Input
            placeholder="Type a message..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      }
    </Card>
  );
}
