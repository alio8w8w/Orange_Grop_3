'use client'

import Script from 'next/script'
import { useCallback, useId, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string
      reset: (widgetId?: string) => void
      remove: (widgetId: string) => void
    }
  }
}

export default function TurnstileWidget({ onVerify }: { onVerify?: (token: string) => void }) {
  const containerId = useId().replace(/:/g, '')
  const widgetIdRef = useRef<string | null>(null)

  const renderWidget = useCallback(() => {
    if (!window.turnstile || widgetIdRef.current) return

    const container = document.getElementById(containerId)
    if (!container) return

    widgetIdRef.current = window.turnstile.render(container, {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      theme: 'dark',
      callback: (token: string) => onVerify?.(token),
    })
  }, [containerId, onVerify])

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={renderWidget}
      />
      <div className="turnstile-shell">
        <div id={containerId} />
        <style jsx>{`
          .turnstile-shell {
            display: flex;
            justify-content: center;
            border-radius: 0.75rem;
            overflow: hidden;
            transform: translateZ(0);
          }
        `}</style>
      </div>
    </>
  )
}