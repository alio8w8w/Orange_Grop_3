import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Verificăm sesiunea. Aceasta este verificarea criptografică la nivel de server.
  const { data: { session } } = await supabase.auth.getSession()

  // REGULI DE PROTECȚIE

  // 1. Dacă utilizatorul încearcă să acceseze orice rută din (admin)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Dacă NU există sesiune, redirecționăm instantaneu la login
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 2. Dacă utilizatorul este deja logat și încearcă să acceseze pagina de login
  if (request.nextUrl.pathname === '/login' && session) {
     return NextResponse.redirect(new URL('/admin', request.url))
  }

  return response
}

// Configurăm middleware-ul să ruleze doar pe rutele relevante
export const config = {
  matcher: [
    // Rulează pe rutele de admin și login
    '/admin/:path*', 
    '/login',
    // Exclude fișierele statice și API intern
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}