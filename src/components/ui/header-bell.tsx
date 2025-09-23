"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getNotifications } from "@/service/notification";
import { addNotification, setNotifications } from "@/store/slices/notifSlice";


export default function NotifBell() {
  const supabase = createClient();
  const dispatch = useDispatch();
  const notifCount = useSelector((state: RootState) => {
    if (!state.notif) return null;
    return state.notif.filter((notif: { read: boolean }) => notif.read === false).length;
  });
  const userId = useSelector((state: RootState) => state.user.id)

  useEffect(() => {
    if (!userId) return;
    const fetchNotificationsCount = async () => {
      const notif = await getNotifications();
      dispatch(setNotifications(notif));
    }

    fetchNotificationsCount();

    const channels = supabase.channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Notification' },
        async (payload) => {
          console.log('Notification change received!', payload);
          if (payload.new.userId === userId) {
            dispatch(addNotification(payload.new));
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channels);
    };
  }, [dispatch, supabase, userId]);

  return (
    <Link
      href="/notification"
      className={`rounded-full p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 flex gap-2 focus:ring-gray-500 ${notifCount > 0 ? 'bg-gray-100 px-3' : ''}`}
    >
      <Bell className="w-5 hover:text-gray-700 transition-colors cursor-pointer" />
      <span className={`${notifCount > 0 ? '' : 'hidden'} `}>
        {notifCount}
      </span>
    </Link>
  );
}