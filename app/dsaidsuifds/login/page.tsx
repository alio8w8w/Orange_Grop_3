'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useState, useEffect } from 'react'
import Turnstile, { useTurnstile } from 'react-turnstile'
import { signIn, verifyOTP } from './actions'
import { useRouter } from 'next/navigation'

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="...">
      {pending ? 'Se încarcă...' : label}
    </button>
  )
}

export default function LoginPage() {
  const [signInState, signInAction] = useFormState(signIn, null)
  const [otpState, otpAction] = useFormState(verifyOTP, null)
  const [showOTP, setShowOTP] = useState(false)
  const [email, setEmail] = useState('')
  const [challengeId, setChallengeId] = useState('')
  const turnstile = useTurnstile()
  const router = useRouter()

  // Gestionarea stării de logare inițială
  useEffect(() => {
    if (signInState?.success && signInState.challengeId) {
      setShowOTP(true)
      setEmail(signInState.email)
      setChallengeId(signInState.challengeId)
    } else if (signInState?.error) {
       turnstile.reset() // Resetăm Turnstile la eroare
    }
  }, [signInState, turnstile])

  // Gestionarea stării OTP
  useEffect(() => {
    if (otpState?.success && otpState.redirectTo) {
        router.push(otpState.redirectTo)
    }
  }, [otpState, router])

  return (
    <main className="...">
      <h1 className="...">Panou Administrare</h1>

      {!showOTP ? (
        // Formular Logare Inițial
        <form action={signInAction} className="...">
          <input type="email" name="email" placeholder="Email" required className="..." />
          <input type="password" name="password" placeholder="Parolă" required className="..." />
          
          {/* Cloudflare Turnstile widget */}
          <Turnstile
            sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            theme="light"
            className="..."
          />

          {signInState?.error && <p className="text-red-500 text-sm">{signInState.error}</p>}
          {signInState?.message && <p className="text-green-500 text-sm">{signInState.message}</p>}
          
          <SubmitButton label="Logare" />
        </form>
      ) : (
        // Formular Verificare OTP (2FA)
        <form action={otpAction} className="...">
          <p className="text-sm mb-4">Introduceți codul trimis pe {email}</p>
          <input type="text" name="code" placeholder="Cod OTP" required className="..." maxLength={6} />
          <input type="hidden" name="challengeId" value={challengeId} />
          <input type="hidden" name="email" value={email} />

          {otpState?.error && <p className="text-red-500 text-sm">{otpState.error}</p>}
          
          <SubmitButton label="Verifică Cod" />
        </form>
      )}
    </main>
  )
}