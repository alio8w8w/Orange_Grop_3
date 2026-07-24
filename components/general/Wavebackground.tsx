'use client'

/**
 * WaveBackground
 * ----------------
 * Un fundal animat care recreează efectul din poza de referință: valuri
 * incandescente de portocaliu care se mișcă lent pe un fond aproape negru.
 * Este construit doar din CSS (gradient-uri radiale + blur + keyframes),
 * fără canvas, ca să rămână ușor și fluid pe orice dispozitiv.
 *
 * Respectă `prefers-reduced-motion`: animația se oprește automat.
 *
 * Prop `speed`:
 *  - "calm"   (implicit) — ritmul original, bun pt. pagina de login/admin.
 *  - "active" — tot ciclul de mișcare e ~2.4x mai rapid și puțin mai intens,
 *               pt. pagina de alegere a limbii, unde vrei un fundal mai viu.
 */
export default function WaveBackground({ speed = 'calm' }: { speed?: 'calm' | 'active' }) {
  const scale = speed === 'active' ? 1 / 2.4 : 1
  const durations = {
    a: `${26 * scale}s`,
    b: `${32 * scale}s`,
    c: `${22 * scale}s`,
    d: `${18 * scale}s`,
  }
  const intense = speed === 'active'

  return (
    <div className="ember-bg" aria-hidden="true">
      <div
        className="ember-blob ember-blob--a"
        style={{ animationDuration: durations.a, opacity: intense ? 0.95 : undefined }}
      />
      <div
        className="ember-blob ember-blob--b"
        style={{ animationDuration: durations.b, opacity: intense ? 0.95 : undefined }}
      />
      <div
        className="ember-blob ember-blob--c"
        style={{ animationDuration: durations.c, opacity: intense ? 0.95 : undefined }}
      />
      <div
        className="ember-blob ember-blob--d"
        style={{ animationDuration: durations.d, opacity: intense ? 0.7 : undefined }}
      />
      <div className="ember-grain" />
      <div className="ember-vignette" />

      <style jsx>{`
        .ember-bg {
          position: fixed;
          inset: 0;
          overflow: hidden;
          background: radial-gradient(120% 120% at 50% 10%, #170a04 0%, #0a0503 45%, #050302 100%);
          z-index: 0;
        }

        .ember-blob {
          position: absolute;
          width: 70vmax;
          height: 70vmax;
          border-radius: 50%;
          filter: blur(60px);
          mix-blend-mode: screen;
          opacity: 0.85;
          will-change: transform;
        }

        .ember-blob--a {
          left: -20%;
          top: 10%;
          background: radial-gradient(circle at 40% 40%, #fff3d6 0%, #ff8a2b 35%, rgba(179, 35, 10, 0) 70%);
          animation: drift-a 26s ease-in-out infinite;
        }

        .ember-blob--b {
          right: -25%;
          top: 30%;
          width: 60vmax;
          height: 60vmax;
          background: radial-gradient(circle at 60% 50%, #ffb347 0%, #b3230a 40%, rgba(179, 35, 10, 0) 70%);
          animation: drift-b 32s ease-in-out infinite;
        }

        .ember-blob--c {
          left: 10%;
          bottom: -30%;
          width: 55vmax;
          height: 55vmax;
          background: radial-gradient(circle at 50% 50%, #ff6a1a 0%, #5c1400 45%, rgba(0, 0, 0, 0) 70%);
          animation: drift-c 22s ease-in-out infinite;
        }

        .ember-blob--d {
          right: 5%;
          bottom: -20%;
          width: 40vmax;
          height: 40vmax;
          background: radial-gradient(circle at 50% 50%, #ffe8c2 0%, #ff8a2b 35%, rgba(0, 0, 0, 0) 70%);
          opacity: 0.5;
          animation: drift-d 18s ease-in-out infinite;
        }

        @keyframes drift-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(8vw, 6vh) scale(1.08); }
          66% { transform: translate(-4vw, 10vh) scale(0.96); }
        }
        @keyframes drift-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(-10vw, -4vh) scale(1.05); }
          70% { transform: translate(-2vw, 8vh) scale(0.94); }
        }
        @keyframes drift-c {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(6vw, -10vh) scale(1.1); }
        }
        @keyframes drift-d {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-8vw, -6vh) scale(1.12); }
        }

        .ember-grain {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 3px 3px;
          opacity: 0.5;
        }

        .ember-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(120% 100% at 50% 50%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.55) 100%);
        }

        @media (prefers-reduced-motion: reduce) {
          .ember-blob {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}