import { RegisterForm } from "@/components/register-form"

import { createMetadata } from "@/lib/metadata";
import { Metadata } from "next";
export const metadata: Metadata = createMetadata("Sign Up", "Create a new account");

export default function Page() {
  return (
    <div className="w-full max-w-sm md:max-w-4xl">
      <RegisterForm />
    </div>
  )
}