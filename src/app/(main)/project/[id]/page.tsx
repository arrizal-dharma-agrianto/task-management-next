import ProjectView from "@/components/project/page";
import { AppName } from "@/lib/appConst";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Project - ${AppName}`,
  description: "View and manage your project details.",
};

export default function App() {
  return <ProjectView />;
}

