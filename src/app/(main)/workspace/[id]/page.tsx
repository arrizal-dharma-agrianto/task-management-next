import WorkspaceView from "@/components/workspace";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: " Page - CC-Task-Management",
  description: "View and manage your project details.",
};

export default function App() {
  return <WorkspaceView />;
}

