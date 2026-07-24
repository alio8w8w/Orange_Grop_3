import { createServerClient } from '@supabase/ssr'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

import { cookies } from 'next/headers'



// Client standard pentru Server (utilizează cookie-urile sesiunii curente)

export async function createClient() {

  const cookieStore = await cookies()



  return createServerClient(

    process.env.NEXT_PUBLIC_SUPABASE_URL!,

    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

    {

      cookies: {

        getAll() {

          return cookieStore.getAll()

        },

        setAll(cookiesToSet) {

          try {

            cookiesToSet.forEach(({ name, value, options }) =>

              cookieStore.set(name, value, options)

            )

          } catch {

            // Se ignoră dacă apelul este făcut dintr-un Server Component pur (read-only)

          }

        },

      },

    }

  )

}
// Client Admin cu Service Role (bypassează RLS, acces complet la BD/Auth)

export function createAdminClient() {

  return createSupabaseClient(

    process.env.NEXT_PUBLIC_SUPABASE_URL!,

    process.env.SUPABASE_SERVICE_ROLE_KEY!,

    {

      auth: {

        persistSession: false,

        autoRefreshToken: false,

      },

    }

  )

}