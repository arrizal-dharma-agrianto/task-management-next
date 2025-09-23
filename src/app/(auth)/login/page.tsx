import { LoginForm } from "@/components/login-form"

import { createMetadata } from "@/lib/metadata";
import { Metadata } from "next";
export const metadata: Metadata = createMetadata("Sign In", "Sign in to your account");

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm md:max-w-3xl">
      <LoginForm  />
    </div>
  )
}



// export default function LoginPage() {
//   return (
//     <form>
//       <label htmlFor="email">Email:</label>
//       <input id="email" name="email" type="email" required />
//       <label htmlFor="password">Password:</label>
//       <input id="password" name="password" type="password" required />
//       <button formAction={login}>Log in</button>
//       <button formAction={signup}>Sign up</button>
//     </form>
//   )
// }