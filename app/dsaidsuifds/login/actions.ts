'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'

// Verificare Cloudflare Turnstile
async function verifyTurnstile(token: string) {
  if (!process.env.TURNSTILE_SECRET_KEY && process.env.NODE_ENV === 'development') {
    return true
  }

  if (!token) {
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
    return outcome.success
  } catch (error) {
    console.error('Eroare rețea/server la verificarea Turnstile:', error)
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

// Autentificare clasică cu Email și Parolă
export async function signIn(prevState: any, formData: FormData) {
  const rawEmail = formData.get('email') as string
  const rawPassword = formData.get('password') as string
  const turnstileToken = formData.get('cf-turnstile-response') as string

  if (!rawEmail || !rawPassword) {
    return { error: 'Emailul și parola sunt obligatorii.' }
  }

  const email = rawEmail.trim().toLowerCase()
  const password = rawPassword.trim()

  const isHuman = await verifyTurnstile(turnstileToken)
  if (!isHuman) {
    return { error: 'Validare bot eșuată. Reîncărcați pagina.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    await recordAttempt(email, false)
    return { error: 'Email sau parolă incorectă.' }
  }

  const supabaseAdmin = await createAdminClient()
  const { data: adminRecord, error: adminError } = await supabaseAdmin
    .from('admin_profiles')
    .select('email')
    .eq('email', email)
    .maybeSingle()

  if (adminError || !adminRecord) {
    await recordAttempt(email, false)
    await supabase.auth.signOut()
    return { error: 'Acces neautorizat. Această adresă de email nu are permisiuni de administrator.' }
  }

  await recordAttempt(email, true)

  return {
    success: true,
    redirectTo: '/dsaidsuifds/dashbord'
  }
}