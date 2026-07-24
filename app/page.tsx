'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import WaveBackground from '@/components/general/Wavebackground'
import Mascot from '@/components/auth/Mascot'
import LocaleToggle from '@/components/general/Localetoggle'
import PortalTransition from '@/components/general/Portaltransition'

/**
 * app/page.tsx
 * ------------
 * Asta e pagina care lipsea — de-asta lua 404 pe domeniul gol.
 * `app/[locale]/page.tsx` NU se randează niciodată pentru "/" exact;
 * Next are nevoie de un `page.tsx` separat, direct în `app/`, ca să
 * știe ce afișează pe ruta rădăcină. Aici alegi limba, iar la confirmare
 * pornește tranziția de „portal" spre `/ro` sau `/en`.
 */
export default function LanguageGatePage() {
  const router = useRouter()
  const [locale, setLocale] = useState<'ro' | 'en'>('ro')
  const [transitioning, setTransitioning] = useState(false)

  const handleConfirm = () => setTransitioning(true)
  const handleNavigate = () => router.push(`/${locale}`)

  return (
    <main className="gate-shell">
      <WaveBackground speed="active" />
      <Mascot />

      {!transitioning && (
        <div className="gate-card">
          <div className="gate-card__seam" />

          <div className="gate-card__logo">
            <span className="gate-card__logo-mark">◆</span>
            <span className="gate-card__logo-word">ORANGE GROUP 3</span>
          </div>

          <h1 className="gate-card__title">Choose your language / Alege limba</h1>

          <div className="gate-card__toggle-row">
            <LocaleToggle value={locale} onChange={setLocale} />
          </div>

          <button type="button" onClick={handleConfirm} className="gate-card__submit-wrap">
            <FakeSubmit label={locale === 'ro' ? 'Continuă' : 'Continue'} />
          </button>
        </div>
      )}

      <PortalTransition active={transitioning} locale={locale} onNavigate={handleNavigate} />

      <style jsx>{`
        .gate-shell {
          position: relative;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: var(--font-sans, 'Inter', system-ui, sans-serif);
        }

        .gate-card {
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 24rem;
          padding: 2.5rem 2rem 2.25rem;
          border-radius: 1.5rem;
          text-align: center;
          background: rgba(12, 7, 5, 0.55);
          backdrop-filter: blur(22px) saturate(140%);
          -webkit-backdrop-filter: blur(22px) saturate(140%);
          border: 1px solid rgba(255, 179, 71, 0.18);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.02) inset;
        }

        .gate-card__seam {
          position: absolute;
          top: 0;
          left: 12%;
          right: 12%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #ff8a2b, transparent);
          opacity: 0.7;
        }

        .gate-card__logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          color: #ffe9d6;
        }
        .gate-card__logo-mark {
          color: #ff8a2b;
          font-size: 1.1rem;
        }
        .gate-card__logo-word {
          font-family: var(--font-display, 'Space Grotesk', sans-serif);
          font-weight: 700;
          letter-spacing: 0.14em;
          font-size: 0.8rem;
        }

        .gate-card__title {
          font-family: var(--font-display, 'Space Grotesk', sans-serif);
          font-size: 1.1rem;
          font-weight: 600;
          color: rgba(255, 233, 214, 0.85);
          margin: 0 0 1.5rem;
        }

        .gate-card__toggle-row {
          display: flex;
          justify-content: center;
          margin-bottom: 1.75rem;
        }

        .gate-card__submit-wrap {
          all: unset;
          display: block;
          width: 100%;
          cursor: pointer;
        }
      `}</style>
    </main>
  )
}

/**
 * Mic wrapper ca să reutilizăm stilul lui SubmitButton (care e gândit
 * pt. `<form>` + `useFormStatus`) într-un context fără formular real.
 */
function FakeSubmit({ label }: { label: string }) {
  return (
    <span className="fake-submit">
      {label}
      <style jsx>{`
        .fake-submit {
          display: block;
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: 0.01em;
          color: #150a04;
          background: linear-gradient(135deg, #ffe8c2 0%, #ff8a2b 55%, #b3230a 100%);
          box-shadow: 0 8px 24px rgba(255, 106, 26, 0.35);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .fake-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 28px rgba(255, 106, 26, 0.45);
        }
      `}</style>
    </span>
  )
}