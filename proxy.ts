import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
// Importăm funcțiile necesare pentru next-intl
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing' // Calea corectă bazată pe structura ta

const ADMIN_PREFIX = '/dsaidsuifds'
const ADMIN_LOGIN_PATH = '/dsaidsuifds/login'
const ADMIN_DASHBOARD_PATH = '/dsaidsuifds/dashbord'

// Inițializăm middleware-ul de traducere cu setările tale
const intlMiddleware = createIntlMiddleware(routing)

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 1. ZONA DE SECURITATE: Dacă utilizatorul accesează panoul de admin
  if (pathname.startsWith(ADMIN_PREFIX)) {
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

    // HTTP Security Headers (Protecții adiționale)
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

    // EXCEPȚIE: Permitem accesul la pagina de login din interiorul adminului
    if (pathname === ADMIN_LOGIN_PATH) {
      if (user) {
        return NextResponse.redirect(new URL(ADMIN_DASHBOARD_PATH, request.url)) 
      }
      return response
    }

    // Pentru ORICE ALTĂ rută din admin
    if (!user || error) {
      return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url))
    }

    return response
  }

  // 2. ZONA PUBLICĂ: Dacă nu este o rută de admin, aplicăm redirecționarea i18n
  // Acest apel va intercepta `/` și îl va transforma automat în `/ro`
  return intlMiddleware(request)
}

export const config = {
  // Am simplificat matcher-ul pentru a prinde absolut toate rutele, 
  // dar exclude automat fișierele de sistem (imagini, css, API)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}