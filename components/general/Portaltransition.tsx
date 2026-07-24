'use client'

import { useEffect, useRef, useState } from 'react'

type Phase = 'idle' | 'swirl-in' | 'showcase' | 'swirl-out' | 'flash' | 'done'

const PHOTOS = ['/images/intro1.png', '/images/intro2.png', '/images/intro3.png']

// Timpii au fost ajustați pentru a se potrivi cu noul flux rapid
const TIMINGS = {
  swirlIn: 600,  // Vortexul inițial care se adună
  showcase: 60,  // 3 poze * 20ms fiecare (prezentare statică)
  swirlOut: 800, // Vârtejul final care se accelerează și se estompează
  flash: 260,    // Flash-ul final înainte de navigare
}

const COPY = {
  ro: 'EȘTI GATA SĂ FACI CUNOȘTINȚĂ CU ORANGE GROUP 3?',
  en: 'READY TO MEET ORANGE GROUP 3?',
}

/**
 * PortalTransition
 * ----------------
 * Secvența modificată:
 * 1. swirl-in: Vortexul se strânge (negru).
 * 2. showcase: Se afișează cele 3 poze succesiv (câte 20ms).
 * 3. swirl-out: Pozele intră într-un efect de vârtej stilizat (ca în imagine).
 * 4. flash: Ecran alb-portocaliu → negru.
 * 5. done: Navigare și ascundere.
 */
export default function PortalTransition({
  active,
  locale,
  onNavigate,
}: {
  active: boolean
  locale: 'ro' | 'en'
  onNavigate: () => void
}) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [showcaseIndex, setShowcaseIndex] = useState(0)
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([])
  const showcaseInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!active) return

    setPhase('swirl-in')

    // 1. Faza de adunare a vortexului (swirl-in)
    timeouts.current.push(
      setTimeout(() => {
        setPhase('showcase')
        // 2. Faza de prezentare statică rapidă (3 poze x 20ms)
        let currentPhoto = 0
        showcaseInterval.current = setInterval(() => {
          currentPhoto++
          setShowcaseIndex(currentPhoto)
          if (currentPhoto >= PHOTOS.length - 1) {
            if (showcaseInterval.current) clearInterval(showcaseInterval.current)
          }
        }, 20)
      }, TIMINGS.swirlIn)
    )

    // 3. Tranziția spre vârtejul final (swirl-out)
    const swirlOutStart = TIMINGS.swirlIn + TIMINGS.showcase
    timeouts.current.push(
      setTimeout(() => {
        setPhase('swirl-out')
      }, swirlOutStart)
    )

    // 4. Flash-ul final și navigarea
    const flashStart = swirlOutStart + TIMINGS.swirlOut
    timeouts.current.push(
      setTimeout(() => {
        setPhase('flash')
        onNavigate() // Navigarea are loc exact când începe flash-ul negru
      }, flashStart)
    )

    // 5. Finalizarea tranziției
    const doneStart = flashStart + TIMINGS.flash
    timeouts.current.push(
      setTimeout(() => {
        setPhase('done')
      }, doneStart)
    )

    return () => {
      timeouts.current.forEach(clearTimeout)
      timeouts.current = []
      if (showcaseInterval.current) clearInterval(showcaseInterval.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  if (phase === 'idle' || phase === 'done') return null

  const isSwirling = phase === 'swirl-in' || phase === 'swirl-out'
  const isShowingPhotos = phase === 'showcase' || phase === 'swirl-out'

  return (
    <div className={`portal portal--${phase}`}>
      {isSwirling && (
        <>
          <div className="portal__rays">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="portal__ray" style={{ ['--i' as any]: i }} />
            ))}
          </div>
          <div className="portal__vortex-core" />
        </>
      )}

      {isShowingPhotos && (
        <div className="portal__photos-container">
          {PHOTOS.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className={`portal__photo ${i === showcaseIndex ? 'is-visible' : ''}`}
            />
          ))}
          {/* Acest element creează efectul de vârtej peste poze în 'swirl-out' */}
          <div className={`portal__vortex-overlay ${phase === 'swirl-out' ? 'is-active' : ''}`} />
        </div>
      )}

      {(phase === 'flash') && (
        <p className="portal__text">{COPY[locale]}</p>
      )}

      <div className="portal__flashlayer" />

      <style jsx>{`
        .portal {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #050302;
        }

        /* --- Vortex Rays & Core (swirl-in) --- */
        .portal__vortex-core {
          position: absolute;
          width: 40vmax;
          height: 40vmax;
          border-radius: 50%;
          background: conic-gradient(from 0deg, #ffe8c2 0deg, #ff8a2b 60deg, #b3230a 140deg, #050302 200deg, #ff6a1a 280deg, #ffe8c2 360deg);
          filter: blur(25px);
          opacity: 0;
          animation: vortex-core-in ${TIMINGS.swirlIn}ms ease-in forwards, vortex-spin-slow 4s linear infinite;
        }
        @keyframes vortex-core-in {
          0% { opacity: 0; transform: scale(0.1); }
          100% { opacity: 0.7; transform: scale(1); }
        }
        @keyframes vortex-spin-slow { to { transform: rotate(360deg); } }

        .portal__rays { position: absolute; inset: 0; }
        .portal__ray {
          position: absolute; top: 50%; left: 50%;
          width: 150vmax; height: 4vmax;
          transform-origin: left center;
          transform: rotate(calc(var(--i) * 60deg)) translateX(-100%) scaleX(0);
          background: linear-gradient(90deg, transparent 0%, #ff8a2b 55%, #050302 100%);
          opacity: 0;
        }
        .portal--swirl-in .portal__ray {
          animation: ray-in ${TIMINGS.swirlIn}ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          animation-delay: calc(var(--i) * 30ms);
        }
        @keyframes ray-in {
          0% { opacity: 0; transform: rotate(calc(var(--i) * 60deg)) translateX(-100%) scaleX(0.2); }
          100% { opacity: 0.6; transform: rotate(calc(var(--i) * 60deg)) translateX(0%) scaleX(1); }
        }

        /* --- Photos Showcase (showcase & swirl-out) --- */
        .portal__photos-container {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
        }
        .portal__photo {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 15ms ease-in-out; /* Tranziție super rapidă între poze */
          /* Aplicăm stilistica din imagine: ton cald, portocaliu-vibrant */
          filter: sepia(0.4) saturate(2.5) hue-rotate(-15deg) brightness(0.8);
        }
        .portal__photo.is-visible {
          opacity: 0.8;
        }

        /* --- Vortex Effect Over Photos (swirl-out) --- */
        .portal__vortex-overlay {
          position: absolute; inset: 0;
          background: radial-gradient(circle at center, transparent 0%, #050302 90%);
          mix-blend-mode: multiply;
          opacity: 0;
          pointer-events: none;
          transition: opacity ${TIMINGS.swirlOut}ms ease-in;
        }
        .portal__vortex-overlay.is-active {
          opacity: 1;
          /* Adăugăm un efect de radiație tipic stilisticii din poză, combinat cu un gradient conic */
          background:
            /* Razele de lumină stilistica din poză (exagerate circular) */
            repeating-conic-gradient(from 0deg, rgba(255,122,26,0.1) 0deg 10deg, transparent 10deg 20deg),
            /* Gaura neagră centrală care se extinde */
            radial-gradient(circle at center, #050302 0%, #050302 20%, rgba(5,3,2,0) 80%);
          animation: vortex-spin-fast ${TIMINGS.swirlOut}ms linear forwards;
        }
        @keyframes vortex-spin-fast {
          0% { transform: scale(1) rotate(0deg); opacity: 0; }
          100% { transform: scale(2) rotate(720deg); opacity: 0.9; }
        }

        /* --- Text Pop (flash) --- */
        .portal__text {
          position: relative; z-index: 20;
          margin-top: 15vh; max-width: 90vw;
          text-align: center; font-family: var(--font-display, sans-serif);
          font-weight: 700; font-size: clamp(2rem, 7vw, 4.5rem);
          color: #ffe9d6;
          text-shadow: 0 0 30px #ff8a2b, 0 0 60px #b3230a;
          animation: text-pop-final 300ms ease-out forwards;
        }
        @keyframes text-pop-final {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }

        /* --- Final Flash Layer --- */
        .portal__flashlayer {
          position: absolute; inset: 0;
          z-index: 30;
          opacity: 0; pointer-events: none;
        }
        .portal--flash .portal__flashlayer {
          animation: flash-out-portal ${TIMINGS.flash}ms ease-in forwards;
        }
        @keyframes flash-out-portal {
          0% { opacity: 1; background: #ffe8c2; } /* Flash Alb-Galbui */
          40% { opacity: 1; background: #ff7a1a; } /* Portocaliu Intens */
          100% { opacity: 1; background: #050302; } /* Negru Final */
        }
      `}</style>
    </div>
  )
}