import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/'
  if (!next.startsWith('/')) {
    next = '/'
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // ✅ Dapatkan user Supabase
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        console.error('Gagal mengambil user:', userError.message)
      }

      if (user) {
        // ✅ Sinkronkan user ke database (Prisma)
        const existing = await prisma.user.findUnique({
          where: { id: user.id },
        })

        if (!existing) {
          const baseUsername =
            user.user_metadata.name?.toLowerCase().replace(/\s/g, '') || 'user'

          let finalUsername = baseUsername
          let counter = 1

          while (
            await prisma.user.findUnique({ where: { username: finalUsername } })
          ) {
            finalUsername = `${baseUsername}${counter}`
            counter++
          }

          await prisma.user.create({
            data: {
              id: user.id,
              email: user.email!,
              fullName: user.user_metadata.full_name || '',
              username: finalUsername,
              password: '',
            },
          })
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      // Set a cookie to indicate successful login, can be used for toast notification
      const response = NextResponse.redirect(
        isLocalEnv
          ? `${origin}${next}`
          : forwardedHost
            ? `http://${forwardedHost}${next}`
            : `${origin}${next}`
      )

      response.cookies.set("auth_redirect_reason", "login_successful", {
        path: '/',
        maxAge: 10,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
      return response
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}

const generateUsername = (base: string, id: string) => {
  return `${base}${id.slice(0, 4)}`
}