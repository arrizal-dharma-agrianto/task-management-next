'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"
import { signup } from "@/app/(auth)/action"
import { useState, useEffect } from "react"
import { Check, AlertCircle } from "lucide-react"
import { toast } from 'sonner'
import { useRouter } from "next/navigation"
import { Loading } from "./ui/loading"
import { useRedirectReasonToast } from "@/hooks/auth-redirect-toast"
import LoginOAuth from "./login-oauth"
import { Agreement } from "./agreement"

type Errors = {
  fullname?: string
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const router = useRouter()

  const [errors, setErrors] = useState<Errors>({})
  const [isValid, setIsValid] = useState(false)
  const [touched, setTouched] = useState<Record<keyof typeof form, boolean>>({
    fullname: false,
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    validateAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form])

  const validateAll = () => {
    const newErrors: Errors = {}

    if (form.fullname.trim().length < 3) {
      newErrors.fullname = "minimal 3 characters"
    }

    if (form.username.trim().length < 3) {
      newErrors.username = "minimal 3 characters"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      newErrors.email = "invalid email"
    }

    if (form.password.length < 8) {
      newErrors.password = "minimal 8 characters"
    }

    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "passwords do not match"
    }

    setErrors(newErrors)
    setIsValid(Object.keys(newErrors).length === 0)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: keyof typeof form; value: string }
    setForm((prev) => ({ ...prev, [name]: value }))
    setTouched((prev) => ({ ...prev, [name]: true }))
  }


  const renderField = (
    id: keyof typeof form,
    label: string,
    type: string,
    colSpan?: string
  ) => (
    <div className={cn("flex flex-col", colSpan)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={type}
          value={form[id]}
          onChange={handleChange}
          required
          className={cn({
            "pr-10 mt-2": true,
          })}
        />
        {form[id] && touched[id] && (
          <span className="absolute right-2 top-[27px] -translate-y-1/2 text-sm">
            {errors[id] ? (
              <AlertCircle className="text-destructive w-4 h-4" />
            ) : (
              <Check className="text-green-600 w-4 h-4" />
            )}
          </span>
        )}
      </div>
      <p className="min-h-[1.25rem] mt-1 text-sm text-destructive pl-1">
        {touched[id] && errors[id] ? errors[id] : " "}
      </p>
    </div>
  )

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isValid) {
      toast.error("Form tidak valid", {
        description: "Periksa kembali isian formulir.",
      })
      return
    }

    try {
      setIsSubmitting(true)
      const formData = new FormData()
      formData.append("fullname", form.fullname)
      formData.append("username", form.username)
      formData.append("email", form.email)
      formData.append("password", form.password)
      formData.append("confirmPassword", form.confirmPassword)
      formData.append("methode", "email")

      const response = await signup(formData) as {
        success?: boolean
        message?: string
        timestamp?: string
        status?: string
        error?: Errors
      }

      if (response?.success === false) {
        toast.error(response.message || "Register Failed", {
          description: response.timestamp
            ? new Date(response.timestamp).toLocaleString()
            : undefined,
        })

        if (response.error) {
          setErrors((prev) => ({ ...prev, ...response.error }))
        }

        return
      }

      router.push("/login")
      toast.success("Registration successful.", {
        description: `Please check your email '${form.email}' to verify your account!`,
        duration: 15000,
      })

    } catch (error: any) {
      console.error("Registration error:", error)
      toast.error("Unexpected Error", {
        description: error.message || "Try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-10">
          <form className="p-4 sm:p-6 md:py-6 md:px-8 col-span-6" onSubmit={handleRegister}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center text-center mb-4">
                <h1 className="text-2xl font-bold">Sign Up</h1>
                <p className="text-balance text-muted-foreground">
                  Create an account!
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {renderField("fullname", "Fullname", "text", "col-span-2")}
                {renderField("username", "Username", "text", "col-span-2 md:col-span-1")}
                {renderField("email", "Email", "email", "col-span-2 md:col-span-1")}
                {renderField("password", "Password", "password", "col-span-2 md:col-span-1")}
                {renderField("confirmPassword", "Confirm Password", "password", "col-span-2 md:col-span-1")}
              </div>

              <Button type="submit" className="w-full mt-3" disabled={!isValid}>
                {isSubmitting ? (<Loading />) : "Sign Up"}
              </Button>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <LoginOAuth />
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Sign In
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block col-span-4">
            <Image
              src="/assets/images/banner-login.jpg"
              alt="Image"
              layout="fill"
              objectFit="cover"
              className="absolute inset-0 h-full w-full scale-105 dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <Agreement />
    </div>
  )
}
