'use client'


import { useFormStatus, useFormState } from 'react-dom'
import { useEffect, useState, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// Importuri acțiuni server (ajustează calea dacă ai mutat fisierul actions.ts)
import { signIn, verifyOTP } from '@/app/dsaidsuifds/login/actions'

// Importuri componente vizuale
import WaveBackground from '@/components/auth/WaveBackground'
import Mascot from '@/components/auth/Mascot'
import TurnstileWidget from '@/components/auth/TurnstileWidget'
import OtpInput from '@/components/auth/OtpInput'
import SubmitButton from '@/components/auth/SubmitButton'

type SignInState = {
  error?: string
  success?: boolean
  message?: string
  factorId?: string
  challengeId?: string
  email?: string
}

type VerifyState = {
  error?: string
  success?: boolean
  redirectTo?: string
}

const initialSignInState: SignInState = {}
const initialVerifyState: VerifyState = {}

export default function LoginForm() {
  const router = useRouter()
  
  const [signInState, signInAction] = useActionState(signIn, initialSignInState)
  const [verifyState, verifyAction] = useActionState(verifyOTP, initialVerifyState)
  const [turnstileToken, setTurnstileToken] = useState('')

  // Determinăm etapa: 'credentials' (Pasul 1) sau 'otp' (Pasul 2)
  const step: 'credentials' | 'otp' = signInState.success ? 'otp' : 'credentials'

  // Redirecționare după ce codul OTP a fost verificat cu succes
  useEffect(() => {
    if (verifyState.success && verifyState.redirectTo) {
      router.push(verifyState.redirectTo)
    }
  }, [verifyState, router])

  return (
    <main className="auth-shell">
      {/* Background animat și Mascotă */}
      <WaveBackground />
      <Mascot />

      <div className="auth-card">
        <div className="auth-card__seam" />

        {/* LOGO-UL REAL DIN public/images/logo.png */}
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

        {/* PASUL 1: EMAIL + PAROLĂ */}
        {step === 'credentials' && (
          <form action={signInAction} className="auth-form">
            <h1 className="auth-form__title">Autentificare</h1>
            <p className="auth-form__subtitle">
              Acces restricționat. Introdu datele contului tău.
            </p>

            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="nume@companie.ro"
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

            {/* Turnstile Widget - generează singur câmpul necesar pentru server */}
            <div className="auth-turnstile-container">
              <TurnstileWidget onVerify={setTurnstileToken} />
            </div>

            {signInState.error && (
              <p className="auth-form__error" role="alert">{signInState.error}</p>
            )}

            <SubmitButton>Continuă</SubmitButton>
          </form>
        )}

        {/* PASUL 2: VERIFICARE 2FA (OTP 6 CIFRE) */}
        {step === 'otp' && (
          <form action={verifyAction} className="auth-form">
            <h1 className="auth-form__title">Verificare în 2 pași</h1>
            <p className="auth-form__subtitle">
              {signInState.message ?? 'Introdu codul din aplicația de autentificare.'}
            </p>

            {/* Câmpuri ascunse trimise la server pentru validarea challenge-ului */}
            <input type="hidden" name="factorId" value={signInState.factorId || ''} />
            <input type="hidden" name="challengeId" value={signInState.challengeId || ''} />

            {/* Standard TOTP Supabase: 6 cifre */}
            <OtpInput name="code" length={6} />

            {verifyState.error && (
              <p className="auth-form__error" role="alert">{verifyState.error}</p>
            )}

            <SubmitButton>Confirmă codul</SubmitButton>
          </form>
        )}
      </div>

      <style jsx>{`
        .auth-shell {
          position: relative;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: var(--font-sans, 'Inter', system-ui, sans-serif);
        }

        .auth-card {
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 26rem;
          padding: 2.25rem 2rem 2rem;
          border-radius: 1.5rem;
          background: rgba(12, 7, 5, 0.55);
          backdrop-filter: blur(22px) saturate(140%);
          -webkit-backdrop-filter: blur(22px) saturate(140%);
          border: 1px solid rgba(255, 179, 71, 0.18);
          box-shadow:
            0 24px 60px rgba(0, 0, 0, 0.55),
            0 0 0 1px rgba(255, 255, 255, 0.02) inset;
        }

        .auth-card__seam {
          position: absolute;
          top: 0;
          left: 12%;
          right: 12%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #ff8a2b, transparent);
          opacity: 0.7;
        }

        .auth-card__logo {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.75rem;
        }

        .auth-card__logo-img {
          object-fit: contain;
          height: auto;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .auth-form__title {
          font-family: var(--font-display, 'Space Grotesk', sans-serif);
          font-size: 1.4rem;
          font-weight: 700;
          color: #ffe9d6;
          text-align: center;
          margin: 0;
        }

        .auth-form__subtitle {
          font-size: 0.85rem;
          color: rgba(255, 233, 214, 0.6);
          text-align: center;
          margin: -0.5rem 0 0.25rem;
        }

        .auth-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: rgba(255, 233, 214, 0.75);
        }

        .auth-field input {
          padding: 0.7rem 0.85rem;
          border-radius: 0.7rem;
          border: 1px solid rgba(255, 138, 43, 0.2);
          background: rgba(20, 10, 6, 0.5);
          color: #ffe9d6;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .auth-field input:focus {
          border-color: rgba(255, 179, 71, 0.8);
          box-shadow: 0 0 0 3px rgba(255, 138, 43, 0.18);
        }

        .auth-field input::placeholder {
          color: rgba(255, 233, 214, 0.3);
        }

        .auth-turnstile-container {
          display: flex;
          justify-content: center;
          margin: 0.25rem 0;
        }

        .auth-form__error {
          font-size: 0.82rem;
          color: #ffb4a0;
          background: rgba(179, 35, 10, 0.18);
          border: 1px solid rgba(255, 106, 26, 0.35);
          border-radius: 0.6rem;
          padding: 0.55rem 0.75rem;
          text-align: center;
          margin: 0;
        }
      `}</style>
    </main>
  )
}