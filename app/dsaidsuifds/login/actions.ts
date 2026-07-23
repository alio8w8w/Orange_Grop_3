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
  await supabaseAdmin.from('login_attempts').insert({ email, is_successful: isSuccessful })
}

// ETAPA 1: Autentificare Email + Parolă + Inițializare 2FA
export async function signIn(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const turnstileToken = formData.get('cf-turnstile-response') as string

  if (!email || !password) {
    return { error: 'Toate câmpurile sunt obligatorii.' }
  }

  // 1. Verificare Turnstile
  const isHuman = await verifyTurnstile(turnstileToken)
  if (!isHuman) {
    return { error: 'Validare bot eșuată. Reîncărcați pagina.' }
  }

  // 2. Verificare Lockout
  const lockedOut = await isEmailLockedOut(email)
  if (lockedOut) {
    return { error: `Prea multe încercări eșuate. Contul este suspendat temporar (${LOCKOUT_DURATION_HOURS} ore).` }
  }

  const supabase = await createClient()

  // 3. Autentificare Supabase Auth
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    await recordAttempt(email, false)
    return { error: 'Credențiale invalide.' }
  }

  // 4. Verificare 2FA (Factor TOTP)
  const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors()
  
  if (factorsError) {
    await recordAttempt(email, false)
    return { error: 'Eroare la verificarea factorilor de securitate 2FA.' }
  }

  const totpFactor = factors?.all.find(
    (factor) => factor.factor_type === 'totp' && factor.status === 'verified'
  )

  if (!totpFactor) {
    await recordAttempt(email, false)
    await supabase.auth.signOut()
    return { error: 'Autentificarea 2FA nu este configurată pentru acest cont admin.' }
  }

  // Inițializare provocare 2FA
  const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
    factorId: totpFactor.id
  })

  if (challengeError) {
    await recordAttempt(email, false)
    return { error: 'Eroare la generarea sesiunii 2FA.' }
  }

  await recordAttempt(email, true)

  return { 
    success: true, 
    message: 'Introduceți codul din aplicația dvs. de autentificare.', 
    factorId: totpFactor.id,
    challengeId: challengeData.id,
    email: email
  }
}

// ETAPA 2: Verificare cod OTP (6 cifre)
export async function verifyOTP(prevState: any, formData: FormData) {
  const code = formData.get('code') as string
  const challengeId = formData.get('challengeId') as string
  const factorId = formData.get('factorId') as string

  if (!code || code.length !== 6 || !challengeId || !factorId) {
    return { error: 'Introduceți un cod de verificare valid de 6 cifre.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.mfa.verify({
    factorId: factorId,
    challengeId: challengeId,
    code: code
  })

  if (error) {
    return { error: 'Cod 2FA invalid sau expirat.' }
  }

  return { success: true, redirectTo: '/admin' }
}