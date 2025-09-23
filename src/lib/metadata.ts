import { AppName } from "@/lib/appConst";
import { Metadata } from "next";

export function createMetadata(title: string, description: string): Metadata {
  return {
    title: `${title} | ${AppName}`,
    description,
    keywords: ["login", "signin", "authentication", "user account"],
    openGraph: {
      title: `${title} | ${AppName}`,
      description,
      url: "/login",
      type: "website",
    },
  };
}
