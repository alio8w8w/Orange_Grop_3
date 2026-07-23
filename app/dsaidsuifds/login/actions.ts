'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'

const MAX_ATTEMPTS = 3
const LOCKOUT_DURATION_HOURS = 3

// Funcție pentru verificarea Turnstile
async function verifyTurnstile(token: string) {
  const formData = new FormData()
  formData.append('secret', process.env.TURNSTILE_SECRET_KEY!)
  formData.append('response', token)

  const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    body: formData,
    method: 'POST',
  })

  const outcome = await result.json()
  return outcome.success
}

// Funcție pentru verificarea dacă email-ul este suspendat temporar
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
    console.error('Error checking lockout:', error)
    return false
  }

  return (count || 0) >= MAX_ATTEMPTS
}

// Funcție pentru înregistrarea unei încercări
async function recordAttempt(email: string, isSuccessful: boolean) {
  const supabaseAdmin = createAdminClient()
  await supabaseAdmin.from('login_attempts').insert({ email, is_successful: isSuccessful })
}

export async function signIn(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const turnstileToken = formData.get('cf-turnstile-response') as string

  if (!email || !password || !turnstileToken) {
    return { error: 'Toate câmpurile sunt obligatorii.' }
  }

  // 1. Verificare Turnstile (Bot protection)
  const isHuman = await verifyTurnstile(turnstileToken)
  if (!isHuman) {
    return { error: 'Validare bot eșuată. Reîncărcați pagina.' }
  }

  // 2. Verificare Lockout (Anti-brute force)
  const lockedOut = await isEmailLockedOut(email)
  if (lockedOut) {
    return { error: `Prea multe încercări eșuate. Contul este suspendat pentru ${LOCKOUT_DURATION_HOURS} ore.` }
  }

  const supabase = await createClient()

  // 3. Încercare autentificare Supabase (Email + Parolă)
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    await recordAttempt(email, false)
    return { error: 'Credențiale invalide.' }
  }

  // 4. Verificare 2FA (Factorul 2 - TOTP)
  const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors()
  
  if (factorsError) {
    await recordAttempt(email, false)
    return { error: 'Eroare la verificarea autentificării multifactor.' }
  }

  // Căutăm factorul TOTP verificat (Google Authenticator / Authy)
  const totpFactor = factors?.all.find(
    (factor) => factor.factor_type === 'totp' && factor.status === 'verified'
  )

  if (!totpFactor) {
    await recordAttempt(email, false)
    await supabase.auth.signOut()
    return { error: 'Autentificarea multifactor (2FA) nu este configurată pentru acest cont. Contactați administratorul.' }
  }

  // Creăm un challenge pentru factorul TOTP găsit
  const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
    factorId: totpFactor.id
  })

  if (challengeError) {
    await recordAttempt(email, false)
    return { error: 'Eroare la inițializarea verificării 2FA.' }
  }

  await recordAttempt(email, true)

  return { 
    success: true, 
    message: 'Introduceți codul din aplicația de autentificare (Google Authenticator / Authy).', 
    factorId: totpFactor.id,
    challengeId: challengeData.id,
    email: email
  }
}

export async function verifyOTP(prevState: any, formData: FormData) {
  const code = formData.get('code') as string
  const challengeId = formData.get('challengeId') as string
  const factorId = formData.get('factorId') as string

  if (!code || !challengeId || !factorId) {
    return { error: 'Codul și detaliile de sesiune sunt obligatorii.' }
  }

  const supabase = await createClient()

  // Verificăm codul introduse
  const { error } = await supabase.auth.mfa.verify({
    factorId: factorId,
    challengeId: challengeId,
    code: code
  })

  if (error) {
    return { error: 'Cod de verificare invalid sau expirat.' }
  }

  // Succes deplin! 2FA validat.
  return { success: true, redirectTo: '/admin' }
}