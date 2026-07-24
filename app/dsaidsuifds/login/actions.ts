'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'

const MAX_ATTEMPTS = 3
const LOCKOUT_DURATION_HOURS = 3

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

// Verificare suspendare temporară (Anti-brute force)
async function isEmailLockedOut(email: string) {
  try {
    const supabaseAdmin = await createAdminClient()

    const threeHoursAgo = new Date()
    threeHoursAgo.setHours(threeHoursAgo.getHours() - LOCKOUT_DURATION_HOURS)

    const { count, error } = await supabaseAdmin
      .from('login_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('email', email)
      .eq('is_successful', false)
      .gte('attempted_at', threeHoursAgo.toISOString())

    if (error) {
      console.error('Eroare verificare lockout:', error)
      return false
    }

    return (count || 0) >= MAX_ATTEMPTS
  } catch (e) {
    console.error('Eroare la crearea clientului admin Supabase:', e)
    return false
  }
}

// Înregistrare încercare login
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

// ETAPA 1: Solicitare Cod OTP pe Email / Link
export async function signIn(prevState: any, formData: FormData) {
  const rawEmail = formData.get('email') as string
  const turnstileToken = formData.get('cf-turnstile-response') as string

  if (!rawEmail) {
    return { error: 'Adresa de email este obligatorie.' }
  }

  // Igienizare email
  const email = rawEmail.trim().toLowerCase()

  // 1. Verificare Turnstile Bot Protection
  const isHuman = await verifyTurnstile(turnstileToken)
  if (!isHuman) {
    return { error: 'Validare bot eșuată. Reîncărcați pagina sau bifați verificarea Turnstile.' }
  }

  // 2. Verificare Lockout (Anti Brute-Force)
  const lockedOut = await isEmailLockedOut(email)
  if (lockedOut) {
    return { error: `Prea multe încercări eșuate. Contul este suspendat temporar (${LOCKOUT_DURATION_HOURS} ore).` }
  }

  const supabase = await createClient()

  // 3. Trimitere OTP pe Email
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false, // Blochează crearea de conturi noi neautorizate
    },
  })

  if (error) {
    await recordAttempt(email, false)
    
    if (error.status === 429) {
      return { error: 'Prea multe solicitări trimise. Așteptați câteva minute.' }
    }
    return { error: error.message || 'A apărut o eroare la trimiterea codului. Încercați din nou.' }
  } else {
    await recordAttempt(email, true)
  }

  return {
    success: true,
    message: 'Dacă adresa există în sistem, un cod de verificare a fost trimis pe email.',
    email: email,
  }
}

// ETAPA 2: Verificare cod OTP primit pe Email (8 cifre)
export async function verifyOTP(prevState: any, formData: FormData) {
  const code = formData.get('code') as string
  const email = formData.get('email') as string

  if (!code || !email) {
    return { error: 'Introduceți codul primit pe email.' }
  }

  const cleanCode = code.trim()
  const cleanEmail = email.trim().toLowerCase()

  const supabase = await createClient()

  // Verificare OTP cu Supabase
  const { error } = await supabase.auth.verifyOtp({
    email: cleanEmail,
    token: cleanCode,
    type: 'email',
  })

  if (error) {
    return { error: 'Cod invalid sau expirat. Verificați căsuța de email.' }
  }

  // Redirecționare către dashboard după autentificare reușită
  return { 
    success: true, 
    redirectTo: '/dsaidsuifds/dashbord' 
  }
}