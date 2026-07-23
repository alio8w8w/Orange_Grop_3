'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

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
    console.error('Error checking lockout:', error)
    return false // În caz de eroare, permitem încercarea, dar logăm eroarea
  }

  return (count || 0) >= MAX_ATTEMPTS
}

// Funcție pentru înregistrarea unei încercări
async function recordAttempt(email: string, isSuccessful: boolean) {
  const supabaseAdmin = await createAdminClient()
  // În producție, ar trebui să preluăm IP-ul din request headers
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

  // 3. Încercare autentificare Supabase (Prima etapă: Email + Parolă)
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    await recordAttempt(email, false)
    // Supabase Auth returnează "Invalid login credentials" pentru securitate
    return { error: 'Credențiale invalide.' }
  }

  // 4. Verificare 2FA (Factorul 2)
  // Dacă utilizatorul a trecut de parolă, Supabase va verifica dacă 2FA e configurat.
  // Notă: Trebuie să configurezi Supabase 2FA via Email în Dashboard.
  
  const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors()
  
  if (factorsError) {
    await recordAttempt(email, false)
    return { error: 'Eroare la verificarea autentificării multifactor.' }
  }

  // Căutăm factorul verificat de tip email
  const emailFactor = factors?.all.find(
    (factor) => factor.factor_type === 'email' && factor.status === 'verified'
  )

  if (!emailFactor) {
    // Dacă utilizatorul nu are 2FA configurat, dar este unul din cei 4, 
    // ar trebui să-l obligi să-l configureze la prima logare. 
    // Pentru acest exemplu, presupunem că este deja configurat.
    await recordAttempt(email, false)
     // Ne logăm afară pentru că nu permitem acces fără 2FA
    await supabase.auth.signOut()
    return { error: 'Autentificarea multifactor (2FA) nu este configurată pentru acest cont. Contactați administratorul.' }
  }

  // Provocăm factorul 2 (trimite codul pe email)
  const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
    factorId: emailFactor.id
  })

  if (challengeError) {
    await recordAttempt(email, false)
    return { error: 'Eroare la trimiterea codului de verificare 2FA.' }
  }

  await recordAttempt(email, true)

  // Logarea inițială e ok, acum avem nevoie de codul OTP.
  // Returnăm challengeId pentru a-l folosi pe frontend
  return { 
    success: true, 
    message: 'Un cod de verificare a fost trimis pe email.', 
    challengeId: challengeData.id,
    email: email // Păstrăm email-ul pentru etapa următoare
  }
}

export async function verifyOTP(prevState: any, formData: FormData) {
    const code = formData.get('code') as string
    const challengeId = formData.get('challengeId') as string
    const email = formData.get('email') as string

    if (!code || !challengeId) {
        return { error: 'Codul este obligatoriu.' }
    }

    const supabase = await createClient()

    // Verificăm codul OTP
    const { error } = await supabase.auth.mfa.verify({
        factorId: challengeId, // Folosim challengeId primit anterior
        challengeId: challengeId,
        code: code
    })

    if (error) {
        return { error: 'Cod de verificare invalid sau expirat.' }
    }

    // Succes deplin! 2FA validat.
    return { success: true, redirectTo: '/admin' }
}