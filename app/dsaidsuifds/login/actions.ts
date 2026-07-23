'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'

const MAX_ATTEMPTS = 3
const LOCKOUT_DURATION_HOURS = 3

// Verificare Cloudflare Turnstile
async function verifyTurnstile(token: string) {
  if (!token) return false

  const formData = new FormData()
  formData.append('secret', process.env.TURNSTILE_SECRET_KEY!)
  formData.append('response', token)

  try {
    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      body: formData,
      method: 'POST',
    })
    const outcome = await result.json()
    return outcome.success
  } catch (error) {
    console.error('Eroare verificare Turnstile:', error)
    return false
  }
}

// Verificare suspendare temporară (Anti-brute force)
// NOTĂ: Supabase folosește interogări parametrizate, fiind 100% imun la SQL Injection.
async function isEmailLockedOut(email: string) {
  const supabaseAdmin = createAdminClient()

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
}

// Înregistrare încercare
async function recordAttempt(email: string, isSuccessful: boolean) {
  const supabaseAdmin = createAdminClient()
  await supabaseAdmin.from('login_attempts').insert({ 
    email: email.trim().toLowerCase(), 
    is_successful: isSuccessful 
  })
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
    return { error: 'Validare bot eșuată. Reîncărcați pagina.' }
  }

  // 2. Verificare Lockout (Anti Brute-Force)
  const lockedOut = await isEmailLockedOut(email)
  if (lockedOut) {
    return { error: `Prea multe încercări eșuate. Contul este suspendat temporar (${LOCKOUT_DURATION_HOURS} ore).` }
  }

  const supabase = await createClient()

  // 3. Trimitere OTP pe Email (Blocat pentru conturi noi via shouldCreateUser: false)
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false, // Blochează crearea de conturi noi neautorizate!
    },
  })

  if (error) {
    await recordAttempt(email, false)
    // Mesaj generic de securitate (evită confirmarea existenței adresei în baza de date)
    if (error.status === 429) {
      return { error: 'Prea multe solicitări trimise. Așteptați câteva minute.' }
    }
  } else {
    await recordAttempt(email, true)
  }

  // Răspundem cu succes chiar dacă adresa nu există (pentru securitate)
  return {
    success: true,
    message: 'Dacă adresa există în sistem, un cod de verificare și un link au fost trimise pe Gmail.',
    email: email,
  }
}

// ETAPA 2: Verificare cod OTP primit pe Email (8 cifre conform setării tale)
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

  return { success: true, redirectTo: '/admin' }
}