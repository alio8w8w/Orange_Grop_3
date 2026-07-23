'use client'

import { useFormStatus } from 'react-dom'

export default function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="submit-btn"
    >
      {pending ? 'Se verifică…' : children}

      <style jsx>{`
        .submit-btn {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: 0.01em;
          color: #150a04;
          background: linear-gradient(135deg, #ffe8c2 0%, #ff8a2b 55%, #b3230a 100%);
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(255, 106, 26, 0.35);
          transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 10px 28px rgba(255, 106, 26, 0.45);
        }
        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
      `}</style>
    </button>
  )
}