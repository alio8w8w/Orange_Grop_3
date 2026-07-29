'use client'

import { useEffect, useMemo, useState } from 'react'

const PHOTOS = ['/images/intro1.png', '/images/intro2.png', '/images/intro3.png']

// Timpii controlați pentru fiecare fază a animației (în milisecunde)
const TIMINGS = {
  rollScene1: 3500,     // Mutăm camera la poza 1
  rollScene2: 6000,     // Mutăm camera la poza 2
  rollScene3: 8500,     // Mutăm camera la poza 3
  startFall: 11000,     // Fundalul zboară în sus (intrăm în ecran negru)
  orangesDrop: 11500,   // Portocalele cad și ele de pe ecran în jos
  lightUp: 13500,       // Se face lumină treptat (după 2 secunde de negru)
  navigate: 15000       // Declanșăm navigarea
}

const COPY = {
  ro: 'EȘTI GATA SĂ FACI CUNOȘTINȚĂ CU ORANGE GROUP 3?',
  en: 'READY TO MEET ORANGE GROUP 3?',
}

export default function PortalTransition({
  active,
  locale,
  onNavigate,
}: {
  active: boolean
  locale: 'ro' | 'en'
  onNavigate: () => void
}) {
  const [panX, setPanX] = useState(0) // Controlăm mișcarea stânga-dreapta (0, 100, 200, 300)
  const [panY, setPanY] = useState(0) // Controlăm căderea (0, 100)
  const [orangesFallingOut, setOrangesFallingOut] = useState(false)
  const [lightUp, setLightUp] = useState(false)

  // Generăm 20 de portocale o singură dată folosind useMemo pentru a evita re-render-urile ciudate
  const oranges = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      // Punct de start random pe axa X (între 0 și 10vw)
      startX: Math.random() * 10,
      // Delay random pentru a nu cădea toate exact în aceeași milisecundă (0 - 600ms)
      delay: Math.random() * 600 
    }))
  }, [])

  useEffect(() => {
    if (!active) return

    // Resetăm state-ul (în caz că e refolosit)
    setPanX(0)
    setPanY(0)
    setOrangesFallingOut(false)
    setLightUp(false)

    // Programăm toată secvența cinematografică
    const t1 = setTimeout(() => setPanX(100), TIMINGS.rollScene1)
    const t2 = setTimeout(() => setPanX(200), TIMINGS.rollScene2)
    const t3 = setTimeout(() => setPanX(300), TIMINGS.rollScene3)
    const t4 = setTimeout(() => setPanY(100), TIMINGS.startFall)
    const t5 = setTimeout(() => setOrangesFallingOut(true), TIMINGS.orangesDrop)
    const t6 = setTimeout(() => setLightUp(true), TIMINGS.lightUp)
    const t7 = setTimeout(() => onNavigate(), TIMINGS.navigate)

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      clearTimeout(t4); clearTimeout(t5); clearTimeout(t6); clearTimeout(t7);
    }
  }, [active, onNavigate])

  if (!active) return null

  return (
    <div className="portal">
      
      {/* LAYER 1: Fundalurile care se mișcă (Panoramare X și Y) */}
      <div 
        className="portal__backgrounds" 
        style={{ transform: `translateX(-${panX}vw) translateY(-${panY}vh)` }}
      >
        <div className="scene-row-top">
          {/* Ecran 0: Gol (aici cad portocalele initial) */}
          <div className="scene scene--empty"></div>
          {/* Ecranele 1, 2, 3: Pozele intro */}
          {PHOTOS.map((src, i) => (
            <div key={src} className="scene">
              <img src={src} alt={`Intro ${i + 1}`} className="scene__img" />
            </div>
          ))}
        </div>
        {/* Rândul de jos: Totul negru (pentru efectul de cădere) */}
        <div className="scene-row-bottom"></div>
      </div>

      {/* LAYER 2: Portocalele. Urmăresc camera pe X, dar au propria cădere pe Y la final */}
      <div 
        className={`portal__oranges ${orangesFallingOut ? 'is-falling' : ''}`}
        style={{ transform: `translateX(-${panX}vw)` }}
      >
        {oranges.map((o) => (
          <div 
            key={o.id} 
            className="orange-pos" 
            style={{ '--start-x': o.startX, '--delay': o.delay } as React.CSSProperties}
          >
            <img 
              src="/images/portocala1.png" 
              alt="Portocala" 
              className="orange-spin" 
            />
          </div>
        ))}
      </div>

      {/* LAYER 3: Lumina de la final și Textul */}
      <div className={`portal__lightup ${lightUp ? 'is-active' : ''}`}>
        {lightUp && (
          <p className="portal__text">{COPY[locale]}</p>
        )}
      </div>

      <style jsx>{`
        .portal {
          position: fixed;
          inset: 0;
          z-index: 100;
          overflow: hidden;
          background: #050302;
        }

        /* --- FUNDALURI --- */
        .portal__backgrounds {
          position: absolute;
          top: 0; left: 0;
          width: 400vw;
          height: 200vh;
          /* Tranziție fină de tip ease-in-out pentru mișcarea camerei */
          transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .scene-row-top {
          display: flex;
          width: 400vw;
          height: 100vh;
        }
        .scene-row-bottom {
          width: 400vw;
          height: 100vh;
          background: #000; /* Bezna în care cădem */
        }
        .scene {
          width: 100vw;
          height: 100vh;
          position: relative;
        }
        .scene--empty {
          background: #050302;
        }
        .scene__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: sepia(0.2) saturate(1.5) brightness(0.8);
        }

        /* --- PORTOCALE --- */
        .portal__oranges {
          position: absolute;
          top: 0; left: 0;
          width: 400vw;
          height: 100vh;
          transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        /* Clasa aplicată când portocalele cad și ele în prăpastie */
        .portal__oranges.is-falling {
          transform: translateX(-300vw) translateY(120vh) !important;
          transition: transform 1.5s ease-in;
        }

        /* Poziționarea pe axa generală (Cădere -> Rostogolire lungă 400vw) */
        .orange-pos {
          position: absolute;
          width: 55px; /* Un pic mai mici de medii */
          height: 55px;
          animation: orange-pos-anim 11s linear forwards;
          animation-delay: calc(var(--delay) * 1ms);
        }
        @keyframes orange-pos-anim {
          0% { transform: translate(calc(var(--start-x) * 1vw), -20vh); }
          /* La 9% din timp (aprox 1 sec) aterizează jos */
          9% { transform: translate(calc(var(--start-x) * 1vw + 5vw), 85vh); } 
          /* Restul timpului se rostogolesc până la capătul lumii de 400vw */
          100% { transform: translate(calc(var(--start-x) * 1vw + 380vw), 85vh); }
        }

        /* Învârtirea propriu-zisă a imaginii (începe după ce aterizează) */
        .orange-spin {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          filter: drop-shadow(0px 8px 5px rgba(0,0,0,0.4));
          animation: orange-spin-anim 10s linear forwards;
          animation-delay: calc((var(--delay) + 900) * 1ms);
        }
        @keyframes orange-spin-anim {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(2500deg); }
        }

        /* --- FINAL LUMINOS --- */
        .portal__lightup {
          position: absolute;
          inset: 0;
          z-index: 50;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
        }
        .portal__lightup.is-active {
          animation: flash-white 1.5s ease-in forwards;
        }
        @keyframes flash-white {
          0% { opacity: 0; background: transparent; }
          40% { opacity: 1; background: #ffe8c2; } /* Se face treptat lumină caldă */
          100% { opacity: 1; background: #fff; } /* Pagina devine complet albă înainte de redirect */
        }

        .portal__text {
          color: #ff8a2b;
          font-family: var(--font-display, sans-serif);
          font-weight: 700;
          font-size: clamp(2rem, 7vw, 4.5rem);
          text-align: center;
          text-shadow: 0 0 20px rgba(0,0,0,0.5);
          animation: text-pop 500ms ease-out forwards;
        }
        @keyframes text-pop {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}