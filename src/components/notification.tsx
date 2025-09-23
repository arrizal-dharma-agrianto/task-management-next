'use client';

import { readNotification } from "@/service/notification";
import { clearBreadcrumbs, setBreadcrumbs } from "@/store/slices/position";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dfh } from '@alfimonth/dfh'
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import { reduceNotification } from "@/store/slices/notifSlice";

export default function NotificationView() {
  const dispatch = useDispatch();
  const router = useRouter();

  const notifications = useSelector((state: RootState) => state.notif);

  useEffect(() => {
    const fetchNotifications = async () => {
      dispatch(clearBreadcrumbs());
      dispatch(setBreadcrumbs([
        { name: "Dashboard", url: "/dashboard", id: "dashboard" },
        { name: "Notifications", url: "/notification", id: "notification" }
      ]));
    }

    fetchNotifications();
  }, [dispatch]);

  const handleReadNotification = async (notificationId: string, url: string) => {
    const response = await readNotification(notificationId);
    if (!response) {
      console.error("Failed to mark notification as read");
      return;
    }
    dispatch(reduceNotification(notificationId));
    router.push(url);
  }
  return (
    <div className="flex flex-col gap-4 px-6 pt-2">
      <h1 className="text-2xl font-bold">Notifications</h1>
      <div className="flex flex-col gap-2">
        {/* Notification Item */}
        {notifications === null ? (
          // Skeleton loading state
          Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="p-4 bg-white rounded shadow animate-pulse flex flex-col gap-2"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          ))
        ) : notifications.length > 0 ? (
          notifications.map((notification: any) => (
            <div
              onClick={() => {
                handleReadNotification(notification.id, notification.url || '/notification');
              }}
              key={notification.id}
              className={`p-4 rounded shadow ${notification.read ? 'bg-white' : 'bg-blue-50'}  hover:bg-gray-50 transition cursor-pointer`}
            >
              <p className="text-sm text-gray-700">{notification.message}</p>
              <span className="text-xs text-gray-500">
                {dfh(notification.createdAt)}
              </span>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-sm">You have no notifications</div>
        )}
      </div>
    </div>
  );
}