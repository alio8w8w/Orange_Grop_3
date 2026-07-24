'use client'

/**
 * WaveBackground
 * ----------------
 * Fundal animat cu valuri portocalii pe negru: 2 „glow"-uri difuze care
 * derivă lent în fundal + 2 valuri SVG care se leagănă orizontal peste ele,
 * plus un strat fin de grain. Fără canvas — doar SVG + CSS — ca să rămână
 * ușor și să nu încarce CPU-ul.
 *
 * Se pune o singură dată, în spatele panourilor de sticlă (login, admin,
 * pagina de alegere a limbii etc).
 *
 * Respectă `prefers-reduced-motion`: animațiile se opresc automat.
 *
 * Prop `speed`:
 *  - "calm"   (implicit) — ritm moderat, bun pt. login/admin.
 *  - "active" — tot ciclul e ~2.4x mai rapid și puțin mai intens,
 *               pt. pagina de alegere a limbii.
 */
export default function WaveBackground({ speed = 'calm' }: { speed?: 'calm' | 'active' }) {
  const scale = speed === 'active' ? 1 / 2.4 : 1
  const intense = speed === 'active'

  const durations = {
    glow1: `${20 * scale}s`,
    glow2: `${26 * scale}s`,
    waveA: `${14 * scale}s`,
    waveB: `${18 * scale}s`,
  }

  return (
    <div className="ogw-bg" aria-hidden="true">
      <div
        className="ogw-bg__glow ogw-bg__glow--1"
        style={{ animationDuration: durations.glow1, opacity: intense ? 0.95 : undefined }}
      />
      <div
        className="ogw-bg__glow ogw-bg__glow--2"
        style={{ animationDuration: durations.glow2, opacity: intense ? 0.85 : undefined }}
      />

      <svg
        className="ogw-bg__waves"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="ogwWave1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF7A1A" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#FF7A1A" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ogwWave2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFB347" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FFB347" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          className="ogw-wave ogw-wave--a"
          style={{ animationDuration: durations.waveA }}
          d="M-200,500 C 150,400 350,650 720,550 C 1090,450 1300,650 1640,500 L1640,900 L-200,900 Z"
          fill="url(#ogwWave1)"
        />
        <path
          className="ogw-wave ogw-wave--b"
          style={{ animationDuration: durations.waveB }}
          d="M-200,600 C 200,700 400,480 720,600 C 1040,720 1250,500 1640,620 L1640,900 L-200,900 Z"
          fill="url(#ogwWave2)"
        />
      </svg>

      <div className="ogw-bg__grain" />
      <div className="ogw-bg__vignette" />

      <style jsx>{`
        .ogw-bg {
          position: fixed;
          inset: 0;
          overflow: hidden;
          background: radial-gradient(120% 120% at 50% 10%, #170a04 0%, #0a0503 45%, #050302 100%);
          z-index: 0;
        }

        .ogw-bg__glow {
          position: absolute;
          width: 65vmax;
          height: 65vmax;
          border-radius: 50%;
          filter: blur(70px);
          mix-blend-mode: screen;
          opacity: 0.8;
          will-change: transform;
        }
        .ogw-bg__glow--1 {
          left: -15%;
          top: 5%;
          background: radial-gradient(circle at 40% 40%, #fff3d6 0%, #ff7a1a 40%, rgba(255, 122, 26, 0) 70%);
          animation: ogw-drift-1 20s ease-in-out infinite;
        }
        .ogw-bg__glow--2 {
          right: -20%;
          bottom: -15%;
          width: 55vmax;
          height: 55vmax;
          background: radial-gradient(circle at 60% 50%, #ffb347 0%, #b3230a 45%, rgba(179, 35, 10, 0) 70%);
          animation: ogw-drift-2 26s ease-in-out infinite;
        }

        @keyframes ogw-drift-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(7vw, 5vh) scale(1.08); }
          66% { transform: translate(-4vw, 9vh) scale(0.95); }
        }
        @keyframes ogw-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(-8vw, -6vh) scale(1.06); }
          70% { transform: translate(-2vw, 6vh) scale(0.94); }
        }

        .ogw-bg__waves {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .ogw-wave {
          transform-origin: center;
          will-change: transform;
        }
        .ogw-wave--a {
          animation: ogw-sway-a 14s ease-in-out infinite;
        }
        .ogw-wave--b {
          animation: ogw-sway-b 18s ease-in-out infinite;
        }

        @keyframes ogw-sway-a {
          0%, 100% { transform: translate(0, 0) scaleY(1); }
          50% { transform: translate(3.5%, -1.5%) scaleY(1.05); }
        }
        @keyframes ogw-sway-b {
          0%, 100% { transform: translate(0, 0) scaleY(1); }
          50% { transform: translate(-4%, 2%) scaleY(0.96); }
        }

        .ogw-bg__grain {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 3px 3px;
          opacity: 0.5;
        }

        .ogw-bg__vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(120% 100% at 50% 50%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.55) 100%);
        }

        @media (prefers-reduced-motion: reduce) {
          .ogw-bg__glow,
          .ogw-wave {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}