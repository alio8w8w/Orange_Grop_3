'use client'

/**
 * LocaleToggle
 * ------------
 * Un „tumbler" (switch) cu 2 poziții — RO / EN — nu un dropdown.
 * Complet controlat din afară (value + onChange), ca să poți combina
 * ușor selecția cu butonul de confirmare din pagina de limbă.
 */
export default function LocaleToggle({
  value,
  onChange,
}: {
  value: 'ro' | 'en'
  onChange: (locale: 'ro' | 'en') => void
}) {
  return (
    <div className="locale-toggle" role="radiogroup" aria-label="Alege limba">
      <button
        type="button"
        role="radio"
        aria-checked={value === 'ro'}
        className={`locale-toggle__option ${value === 'ro' ? 'is-active' : ''}`}
        onClick={() => onChange('ro')}
      >
        RO
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={value === 'en'}
        className={`locale-toggle__option ${value === 'en' ? 'is-active' : ''}`}
        onClick={() => onChange('en')}
      >
        EN
      </button>

      <div className={`locale-toggle__knob ${value === 'en' ? 'locale-toggle__knob--right' : ''}`} />

      <style jsx>{`
        .locale-toggle {
          position: relative;
          display: inline-grid;
          grid-template-columns: 1fr 1fr;
          width: 11rem;
          padding: 0.3rem;
          border-radius: 999px;
          background: rgba(20, 10, 6, 0.55);
          border: 1px solid rgba(255, 138, 43, 0.25);
        }

        .locale-toggle__option {
          position: relative;
          z-index: 2;
          border: none;
          background: transparent;
          padding: 0.5rem 0;
          font-family: var(--font-display, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.08em;
          color: rgba(255, 233, 214, 0.55);
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .locale-toggle__option.is-active {
          color: #150a04;
        }

        .locale-toggle__knob {
          position: absolute;
          top: 0.3rem;
          left: 0.3rem;
          width: calc(50% - 0.3rem);
          height: calc(100% - 0.6rem);
          border-radius: 999px;
          background: linear-gradient(135deg, #ffe8c2 0%, #ff8a2b 55%, #b3230a 100%);
          box-shadow: 0 4px 16px rgba(255, 106, 26, 0.45);
          transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 1;
        }
        .locale-toggle__knob--right {
          transform: translateX(100%);
        }
      `}</style>
    </div>
  )
}