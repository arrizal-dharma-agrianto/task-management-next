import DashboardView from "@/components/dashboard";
import NotificationView from "@/components/notification";
import { AppName } from "@/lib/appConst";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Notification | ${AppName}`,
  description: "View and manage your project details.",
};

export default function App() {
  return <NotificationView />;
}