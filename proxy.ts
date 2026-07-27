import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_PREFIX = '/dsaidsuifds'
const ADMIN_LOGIN_PATH = '/dsaidsuifds/login'
const ADMIN_DASHBOARD_PATH = '/dsaidsuifds/dashbord' // Corectat pentru a se potrivi cu acțiunile tale

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

  // HTTP Security Headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  const pathname = request.nextUrl.pathname

  // Protecție rute admin
  if (pathname.startsWith(ADMIN_PREFIX)) {
    
    // EXCEPȚIE: Permitem accesul la pagina de login din interiorul adminului
    if (pathname === ADMIN_LOGIN_PATH) {
      // Dacă este pe pagina de login și este DEJA logat, trimite-l în dashboard
      if (user) {
        return NextResponse.redirect(new URL(ADMIN_DASHBOARD_PATH, request.url)) 
      }
      // Altfel, lasă-l să vadă pagina de login
      return response
    }

    // Pentru ORICE ALTĂ rută din /dsaidsuifds (ex: /dsaidsuifds/dashbord)
    if (!user || error) {
      // Nu e logat deloc -> trimis la login-ul de admin
      return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url))
    }

    // AM ELIMINAT REDIRECȚIONAREA CĂTRE '/' PENTRU CĂ BLOCA ACCESUL
  }

  return response
}

export const config = {
  matcher: [
    // Prinde tot ce e în folderul secret
    '/dsaidsuifds/:path*',
    // Exclude fișierele statice și de sistem Next.js
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}