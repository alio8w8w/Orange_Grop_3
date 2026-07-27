'use client'

import { useCallback, useRef, useState } from 'react'

/**
 * OtpInput
 * --------
 * Câmp segmentat pentru codul TOTP. Fiecare cifră e un „cărbune" care se
 * aprinde (glow portocaliu) când e completată — ecou vizual al fundalului.
 */
export default function OtpInput({
  length = 8,
  name,
  onComplete,
}: {
  length?: number
  name: string
  onComplete?: (code: string) => void
}) {
  const [digits, setDigits] = useState<string[]>(() => Array(length).fill(''))
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const emitIfComplete = useCallback(
    (next: string[]) => {
      const code = next.join('')
      if (code.length === length && !next.includes('')) {
        onComplete?.(code)
      }
    },
    [length, onComplete]
  )

  const handleChange = useCallback(
    (index: number, value: string) => {
      const clean = value.replace(/[^0-9]/g, '').slice(-1)
      setDigits((prev) => {
        const next = [...prev]
        next[index] = clean
        emitIfComplete(next)
        return next
      })

      if (clean && index < length - 1) {
        inputsRef.current[index + 1]?.focus()
      }
    },
    [length, emitIfComplete]
  )

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && index > 0) {
      setDigits((prev) => {
        if (!prev[index]) {
          inputsRef.current[index - 1]?.focus()
        }
        return prev
      })
    }
  }, [])

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length)
      if (!pasted) return
      e.preventDefault()

      const next = Array(length).fill('')
      pasted.split('').forEach((char, i) => {
        next[i] = char
      })

      setDigits(next)
      const lastFilled = Math.min(pasted.length, length) - 1
      inputsRef.current[Math.max(lastFilled, 0)]?.focus()
      emitIfComplete(next)
    },
    [length, emitIfComplete]
  )

  return (
    <div className="flex justify-center gap-2" role="group" aria-label="Cod de verificare">
      <input type="hidden" name={name} value={digits.join('')} />
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={`otp-cell ${digit ? 'otp-cell--lit' : ''}`}
          aria-label={`Cifra ${i + 1} din ${length}`}
        />
      ))}

      <style jsx>{`
        .otp-cell {
          width: 2.5rem;
          height: 3rem;
          text-align: center;
          font-family: var(--font-mono, 'JetBrains Mono', monospace);
          font-size: 1.25rem;
          font-weight: 600;
          color: #ffe9d6;
          background: rgba(20, 10, 6, 0.55);
          border: 1px solid rgba(255, 138, 43, 0.25);
          border-radius: 0.6rem;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          transform: translate3d(0, 0, 0);
          will-change: border-color, box-shadow, background;
        }
        .otp-cell:focus {
          border-color: rgba(255, 179, 71, 0.8);
          box-shadow: 0 0 0 3px rgba(255, 138, 43, 0.2);
        }
        .otp-cell--lit {
          border-color: #ff8a2b;
          background: rgba(255, 138, 43, 0.12);
          box-shadow: 0 0 14px rgba(255, 138, 43, 0.55), 0 0 2px rgba(255, 232, 194, 0.8) inset;
        }
      `}</style>
    </div>
  )
}