'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'

// Verificare Cloudflare Turnstile
async function verifyTurnstile(token: string) {
  console.log('[DEBUG] Token primit de la frontend:', token ? token.substring(0, 15) + '...' : 'GOL/LIPSA')
  console.log('[DEBUG] Cheia secretă există?:', process.env.TURNSTILE_SECRET_KEY ? 'DA (lungime: ' + process.env.TURNSTILE_SECRET_KEY.length + ')' : 'NU')

  // Ignorăm verificarea în mediul local de Dev dacă nu este setată cheia în .env.local
  if (!process.env.TURNSTILE_SECRET_KEY && process.env.NODE_ENV === 'development') {
    console.warn('[Turnstile] Secret key lipsă în .env.local - verificare ignorată în Dev mode.')
    return true
  }

  if (!token) {
    console.warn('[Turnstile] Token nefurnizat din frontend.')
    return false
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: token,
      }),
    })

    const outcome = await response.json()
    console.log('[DEBUG] Răspuns primit de la Cloudflare:', outcome)

    if (!outcome.success) {
      console.error('[Turnstile] Validare eșuată de la Cloudflare:', outcome['error-codes'])
    }

    return outcome.success
  } catch (error) {
    console.error('Eroare rețea/server la verificarea Turnstile:', error)
    return false
  }
}

// Înregistrare încercare login (păstrată pentru istoric, dar fără blocare)
async function recordAttempt(email: string, isSuccessful: boolean) {
  try {
    const supabaseAdmin = await createAdminClient()
    await supabaseAdmin.from('login_attempts').insert({ 
      email: email.trim().toLowerCase(), 
      is_successful: isSuccessful 
    })
  } catch (e) {
    console.error('Eroare la înregistrarea încercării de login:', e)
  }
}

// Autentificare clasică cu Email și Parolă
export async function signIn(prevState: any, formData: FormData) {
  const rawEmail = formData.get('email') as string
  const rawPassword = formData.get('password') as string
  const turnstileToken = formData.get('cf-turnstile-response') as string

  if (!rawEmail || !rawPassword) {
    return { error: 'Emailul și parola sunt obligatorii.' }
  }

  // Igienizare
  const email = rawEmail.trim().toLowerCase()
  const password = rawPassword.trim()

  // 1. Verificare Turnstile Bot Protection
  const isHuman = await verifyTurnstile(turnstileToken)
  if (!isHuman) {
    return { error: 'Validare bot eșuată. Reîncărcați pagina sau bifați verificarea Turnstile.' }
  }

  // 2. Autentificare efectivă cu Supabase Auth PRIMA DATĂ
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('[SUPABASE AUTH ERROR]:', error.message)
    await recordAttempt(email, false)
    return { error: 'Email sau parolă incorectă.' }
  }

  // 3. Verificare suplimentară: Este userul în admin_profiles?
  const supabaseAdmin = await createAdminClient()
  const { data: adminRecord, error: adminError } = await supabaseAdmin
    .from('admin_profiles')
    .select('email')
    .eq('email', email)
    .maybeSingle()

  if (adminError || !adminRecord) {
    await recordAttempt(email, false)
    // Închidem sesiunea dacă nu e admin
    await supabase.auth.signOut()
    return { error: 'Acces neautorizat. Această adresă de email nu are permisiuni de administrator.' }
  }

  // Dacă totul este 100% corect
  await recordAttempt(email, true)

  return {
    success: true,
    redirectTo: '/dsaidsuifds/dashbord'
  }
}