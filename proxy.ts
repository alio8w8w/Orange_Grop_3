import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Lista celor 4 persoane care au voie în dashboard
const ADMIN_EMAILS = [
  'admin1@exemplu.com', 
  'admin2@exemplu.com', 
  'admin3@exemplu.com', 
  'admin4@exemplu.com'
]

const ADMIN_PATH = '/dsaidsuifds' 

// MODIFICAREA AICI: Am redenumit funcția din 'middleware' în 'proxy'
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('⚠️ Lipsesc variabilele Supabase în .env.local!')
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()

  // 1. HTTP Security Headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  const isTryingToAccessAdmin = request.nextUrl.pathname.startsWith(ADMIN_PATH)

  // 2. Protecție rute admin
  if (isTryingToAccessAdmin) {
    if (!user || error) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (!ADMIN_EMAILS.includes(user.email ?? '')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // 3. Redirecționare dacă este deja autentificat pe pagina de login
  if (request.nextUrl.pathname === '/login' && user) {
    if (ADMIN_EMAILS.includes(user.email ?? '')) {
      return NextResponse.redirect(new URL(ADMIN_PATH, request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/dsaidsuifds/:path*',
    '/admin/:path*',
    '/login',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}