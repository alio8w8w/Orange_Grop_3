'use client'

import { useEffect, useRef, useState } from 'react'

type Phase = 'idle' | 'swirl' | 'reveal' | 'flash' | 'done'

const PHOTOS = ['/images/intro1.png', '/images/intro2.png', '/images/intro3.png']

// Nume EXACTE așteptate în /public/images/. Dacă la tine sunt scrise altfel
// (ex. "introduct3.png" cu typo), redenumește fișierele ca să se potrivească,
// altfel imaginile pur și simplu nu vor apărea (fără eroare vizibilă).

const TIMINGS = {
  swirl: 750, // vortexul se adună + se accelerează
  reveal: 700, // textul pop + poze care pâlpâie rapid în spate
  flash: 260, // ecran alb-portocaliu → negru, chiar înainte de navigare
}

const COPY = {
  ro: 'EȘTI GATA SĂ FACI CUNOȘTINȚĂ CU ORANGE GROUP 3?',
  en: 'READY TO MEET ORANGE GROUP 3?',
}

/**
 * PortalTransition
 * ----------------
 * Se montează peste tot ecranul când `active` devine true și rulează
 * o secvență fixă: vortex care se strânge și accelerează → text mare
 * „pop" cu poze din echipă pâlpâind rapid în spate → flash → navigare.
 *
 * `onNavigate` e apelat exact în momentul flash-ului (ecranul e deja opac),
 * ca schimbarea de rută să fie complet ascunsă de tranziție.
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
  const [photoIndex, setPhotoIndex] = useState(0)
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([])
  const photoInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!active) return

    setPhase('swirl')

    timeouts.current.push(
      setTimeout(() => {
        setPhase('reveal')
        photoInterval.current = setInterval(() => {
          setPhotoIndex((i) => (i + 1) % PHOTOS.length)
        }, 130)
      }, TIMINGS.swirl)
    )

    timeouts.current.push(
      setTimeout(() => {
        setPhase('flash')
        if (photoInterval.current) clearInterval(photoInterval.current)
        onNavigate()
      }, TIMINGS.swirl + TIMINGS.reveal)
    )

    timeouts.current.push(
      setTimeout(() => {
        setPhase('done')
      }, TIMINGS.swirl + TIMINGS.reveal + TIMINGS.flash)
    )

    return () => {
      timeouts.current.forEach(clearTimeout)
      timeouts.current = []
      if (photoInterval.current) clearInterval(photoInterval.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  if (phase === 'idle') return null

  return (
    <div className={`portal portal--${phase}`} aria-hidden={phase === 'done'}>
      <div className="portal__rays">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="portal__ray" style={{ ['--i' as any]: i }} />
        ))}
      </div>

      <div className="portal__vortex" />

      {(phase === 'reveal' || phase === 'flash') && (
        <div className="portal__photos">
          {PHOTOS.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className={`portal__photo ${i === photoIndex ? 'is-visible' : ''}`}
            />
          ))}
          <div className="portal__photo-tint" />
        </div>
      )}

      {(phase === 'reveal' || phase === 'flash') && (
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

        .portal__vortex {
          position: absolute;
          width: 30vmax;
          height: 30vmax;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            #ffe8c2 0deg,
            #ff8a2b 60deg,
            #b3230a 140deg,
            #050302 200deg,
            #ff6a1a 280deg,
            #ffe8c2 360deg
          );
          filter: blur(18px);
          box-shadow: 0 0 120px rgba(255, 106, 26, 0.55);
          transform: scale(0.15) rotate(0deg);
          opacity: 0;
          animation: vortex-spin-slow 3s linear infinite;
        }

        .portal--swirl .portal__vortex {
          animation: vortex-grow ${TIMINGS.swirl}ms cubic-bezier(0.55, 0, 0.85, 0.35) forwards,
            vortex-spin-fast 900ms linear infinite;
        }
        .portal--reveal .portal__vortex,
        .portal--flash .portal__vortex {
          opacity: 0.35;
          transform: scale(1.8);
          animation: vortex-spin-fast 500ms linear infinite;
        }

        @keyframes vortex-grow {
          0% { opacity: 0; transform: scale(0.15); }
          60% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.6; transform: scale(1.6); }
        }
        @keyframes vortex-spin-slow {
          to { transform: rotate(360deg); }
        }
        @keyframes vortex-spin-fast {
          to { transform: scale(1.8) rotate(360deg); }
        }

        .portal__rays {
          position: absolute;
          inset: 0;
        }
        .portal__ray {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 140vmax;
          height: 6vmax;
          transform-origin: left center;
          transform: rotate(calc(var(--i) * 60deg)) translateX(-100%) scaleX(0);
          background: linear-gradient(90deg, transparent 0%, #ff8a2b 55%, #050302 100%);
          opacity: 0;
        }
        .portal--swirl .portal__ray {
          animation: ray-in ${TIMINGS.swirl}ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          animation-delay: calc(var(--i) * 40ms);
        }
        .portal--reveal .portal__ray,
        .portal--flash .portal__ray {
          opacity: 0.5;
          transform: rotate(calc(var(--i) * 60deg)) translateX(0%) scaleX(1);
        }
        @keyframes ray-in {
          0% { opacity: 0; transform: rotate(calc(var(--i) * 60deg)) translateX(-100%) scaleX(0.2); }
          100% { opacity: 0.9; transform: rotate(calc(var(--i) * 60deg)) translateX(0%) scaleX(1); }
        }

        .portal__photos {
          position: absolute;
          inset: 0;
        }
        .portal__photo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          filter: grayscale(0.4) sepia(0.5) saturate(2.2) hue-rotate(-12deg) brightness(0.75);
          transform: scale(1.06);
        }
        .portal__photo.is-visible {
          opacity: 0.55;
          animation: photo-pulse 260ms ease-out;
        }
        @keyframes photo-pulse {
          0% { opacity: 0; transform: scale(1.12); }
          100% { opacity: 0.55; transform: scale(1.06); }
        }
        .portal__photo-tint {
          position: absolute;
          inset: 0;
          background: radial-gradient(120% 100% at 50% 45%, rgba(5, 3, 2, 0.2) 0%, rgba(5, 3, 2, 0.85) 100%);
        }

        .portal__text {
          position: relative;
          z-index: 5;
          margin: 0;
          margin-top: 12vh;
          max-width: 90vw;
          text-align: center;
          font-family: var(--font-display, 'Space Grotesk', sans-serif);
          font-weight: 700;
          font-size: clamp(1.75rem, 6vw, 4rem);
          line-height: 1.1;
          color: #ffe9d6;
          text-shadow: 0 0 40px rgba(255, 138, 43, 0.7);
          opacity: 0;
          transform: scale(0.82);
          animation: text-pop 420ms cubic-bezier(0.2, 1.4, 0.4, 1) forwards;
        }
        @keyframes text-pop {
          0% { opacity: 0; transform: scale(0.82); }
          70% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }

        .portal__flashlayer {
          position: absolute;
          inset: 0;
          z-index: 10;
          background: #ffe8c2;
          opacity: 0;
          pointer-events: none;
        }
        .portal--flash .portal__flashlayer {
          animation: flash-out ${TIMINGS.flash}ms ease-in forwards;
        }
        @keyframes flash-out {
          0% { opacity: 0; background: #ffe8c2; }
          35% { opacity: 0.9; background: #ff8a2b; }
          100% { opacity: 1; background: #050302; }
        }
      `}</style>
    </div>
  )
}