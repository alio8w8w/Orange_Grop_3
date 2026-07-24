'use client'

import { useEffect, useState, useActionState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { signIn } from '@/app/dsaidsuifds/login/actions' // Folosim cale relativă directă dacă actions.ts e în același folder

import WaveBackground from '@/components/auth/WaveBackground'
import Mascot from '@/components/auth/Mascot'
import TurnstileWidget from '@/components/auth/TurnstileWidget'
import SubmitButton from '@/components/auth/SubmitButton'

type SignInState = {
  error?: string
  success?: boolean
  redirectTo?: string
}

const initialSignInState: SignInState = {}

export default function LoginForm() {
  const router = useRouter()
  const [signInState, signInAction] = useActionState(signIn, initialSignInState)
  const [turnstileToken, setTurnstileToken] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  // Resetăm token-ul la eroare
  useEffect(() => {
    if (signInState.error) {
      setTurnstileToken('')
    }
  }, [signInState])

  // Redirecționare la succes
  useEffect(() => {
    if (signInState.success && signInState.redirectTo) {
      router.push(signInState.redirectTo)
    }
  }, [signInState, router])

  return (
    <main className="auth-shell">
      <WaveBackground />
      <Mascot />

      <div className="auth-card">
        <div className="auth-card__seam" />

        <div className="auth-card__logo">
          <Image
            src="/images/logo.png"
            alt="Logo Admin"
            width={160}
            height={48}
            priority
            className="auth-card__logo-img"
          />
        </div>

        <form ref={formRef} action={signInAction} className="auth-form">
          <h1 className="auth-form__title">Autentificare Admin</h1>
          <p className="auth-form__subtitle">
            Acces restricționat. Introdu credențialele.
          </p>

          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="nume@gmail.com"
            />
          </label>

          <label className="auth-field">
            <span>Parolă</span>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </label>

          <div className="auth-turnstile-container">
            <TurnstileWidget onVerify={setTurnstileToken} />
            <input
              type="hidden"
              name="cf-turnstile-response"
              value={turnstileToken}
            />
          </div>

          {signInState.error && (
            <p className="auth-form__error" role="alert">
              {signInState.error}
            </p>
          )}

          <SubmitButton>
            Conectare
          </SubmitButton>
        </form>
      </div>

      <style jsx global>{`
        .auth-shell { position: relative; min-height: 100dvh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; font-family: var(--font-sans, 'Inter', system-ui, sans-serif); background-color: #0c0705; }
        .auth-card { position: relative; z-index: 5; width: 100%; max-width: 26rem; padding: 2.25rem 2rem 2rem; border-radius: 1.5rem; background: rgba(12, 7, 5, 0.75); backdrop-filter: blur(22px) saturate(140%); -webkit-backdrop-filter: blur(22px) saturate(140%); border: 1px solid rgba(255, 179, 71, 0.18); box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55); }
        .auth-card__seam { position: absolute; top: 0; left: 12%; right: 12%; height: 1px; background: linear-gradient(90deg, transparent, #ff8a2b, transparent); opacity: 0.7; }
        .auth-card__logo { display: flex; align-items: center; justify-content: center; margin-bottom: 1.75rem; }
        .auth-card__logo-img { object-fit: contain; height: auto; }
        .auth-form { display: flex; flex-direction: column; gap: 1rem; }
        .auth-form__title { font-family: var(--font-display, 'Space Grotesk', sans-serif); font-size: 1.4rem; font-weight: 700; color: #ffe9d6; text-align: center; margin: 0; }
        .auth-form__subtitle { font-size: 0.85rem; color: rgba(255, 233, 214, 0.6); text-align: center; margin: -0.5rem 0 0.25rem; }
        .auth-field { display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.8rem; color: rgba(255, 233, 214, 0.75); }
        .auth-field input { padding: 0.7rem 0.85rem; border-radius: 0.7rem; border: 1px solid rgba(255, 138, 43, 0.2); background: rgba(20, 10, 6, 0.5); color: #ffe9d6; font-size: 0.95rem; outline: none; }
        .auth-field input:focus { border-color: rgba(255, 179, 71, 0.8); box-shadow: 0 0 0 3px rgba(255, 138, 43, 0.18); }
        .auth-turnstile-container { display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0.25rem 0; min-height: 65px; }
        .auth-form__error { font-size: 0.82rem; color: #ffb4a0; background: rgba(179, 35, 10, 0.18); border: 1px solid rgba(255, 106, 26, 0.35); border-radius: 0.6rem; padding: 0.55rem 0.75rem; text-align: center; margin: 0; }
      `}</style>
    </main>
  )
}