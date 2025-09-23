"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { login, loginWithOAuth } from "@/app/(auth)/action"
import Link from "next/link"
import { useRedirectReasonToast } from "@/hooks/auth-redirect-toast"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { Loading } from "./ui/loading"
import LoginOAuth from "./login-oauth"
import { Agreement } from "./agreement"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  useRedirectReasonToast();
  const router = useRouter();
  const [redirect, setRedirect] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectParam = searchParams.get("redirect") || undefined;
      setRedirect(redirectParam);
    }
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    try {
      setIsSubmitting(true);
      const result = await login(formData);
      if (result.success) {

        toast.success("Login successful!", {
          duration: 5000,
          description: "You are now logged in.",
        });

        router.replace(redirect || "/dashboard");
      } else {
        toast.error(`Login failed. ${result.message || 'Something when wrong'}`, {
          duration: 5000,
          description: "Please check your credentials and try again.",
        });
        console.error("Login failed:", result.message);
      }
    } catch (error) {
      toast.error(`Login failed. ${error instanceof Error ? error.message : 'Something went wrong'}`, {
        duration: 2000,
        description: "Please check your credentials and try again.",
      });
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !email || !password}
              >
                {isSubmitting ? (<Loading />) : "Login"}
              </Button>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <LoginOAuth redirect={redirect} />
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/assets/images/banner-login.jpg"
              alt="Image"
              layout="fill"
              objectFit="cover"
              className="absolute inset-0 h-full w-full dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <Agreement />
    </div >
  )
}
