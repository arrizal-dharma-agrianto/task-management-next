import DashboardView from "@/components/dashboard";
import { AppName } from "@/lib/appConst";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Dashboard | ${AppName}`,
  description: "View and manage your project details.",
};

export default function App() {
  return <DashboardView />;
}