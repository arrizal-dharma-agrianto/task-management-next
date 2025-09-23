import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/workspace/:path*',
    '/project/:path*',
    '/task/:path*',
    '/notification/:path*',
    '/dnd',
    '/login',
    '/register',
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /register (registration path)
     * Feel free to modify this pattern to include more paths.
     */
    // '/((?!^$|_next/static|_next/image|favicon.ico|register|about|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',  
  ],
}