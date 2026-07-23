'use client'

import Script from 'next/script'
import { useEffect, useId, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId?: string) => void
    }
  }
}

/**
 * TurnstileWidget
 * ---------------
 * Randează widget-ul Cloudflare Turnstile cu tema „dark" ca să se
 * potrivească vizual cu cardul de sticlă. Rezultatul (token) e scris
 * automat într-un input ascuns `cf-turnstile-response`, exact numele
 * de câmp citit deja în action.ts (`signIn`).
 */
export default function TurnstileWidget({ onVerify }: { onVerify?: (token: string) => void }) {
  const containerId = useId().replace(/:/g, '')
  const widgetIdRef = useRef<string | null>(null)

  useEffect(() => {
    const tryRender = () => {
      if (!window.turnstile || widgetIdRef.current) return
      widgetIdRef.current = window.turnstile.render(`#${containerId}`, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
        theme: 'dark',
        callback: (token: string) => onVerify?.(token),
      })
    }

    // scriptul poate fi deja încărcat dintr-o navigare anterioară
    tryRender()
    const interval = setInterval(tryRender, 200)
    return () => clearInterval(interval)
  }, [containerId, onVerify])

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      <div className="turnstile-shell">
        <div id={containerId} />
        <style jsx>{`
          .turnstile-shell {
            display: flex;
            justify-content: center;
            border-radius: 0.75rem;
            overflow: hidden;
          }
        `}</style>
      </div>
    </>
  )
}