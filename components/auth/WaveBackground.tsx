'use client'

export default function WaveBackground({ speed = 'calm' }: { speed?: 'calm' | 'active' }) {
  const isInternalActive = speed === 'active'

  return (
    <div className={`ember-bg ${isInternalActive ? 'ember-bg--active' : ''}`} aria-hidden="true">
      <div className="ember-blob ember-blob--a" />
      <div className="ember-blob ember-blob--b" />
      <div className="ember-blob ember-blob--c" />
      <div className="ember-blob ember-blob--d" />
      <div className="ember-grain" />
      <div className="ember-vignette" />

      <style jsx>{`
        .ember-bg {
          position: fixed;
          inset: 0;
          overflow: hidden;
          background: radial-gradient(120% 120% at 50% 10%, #170a04 0%, #0a0503 45%, #050302 100%);
          z-index: 0;
          pointer-events: none;
          transform: translateZ(0);
        }

        .ember-blob {
          position: absolute;
          width: 55vmax;
          height: 55vmax;
          border-radius: 50%;
          /* Redus de la 60px la 35px pentru a elibera GPU-ul de randarea blur-ului masiv */
          filter: blur(35px);
          opacity: 0.75;
          will-change: transform;
          transform: translate3d(0, 0, 0);
        }

        .ember-blob--a {
          left: -15%;
          top: 10%;
          background: radial-gradient(circle at 40% 40%, #fff3d6 0%, #ff8a2b 40%, transparent 70%);
          animation: drift-a 26s ease-in-out infinite;
        }

        .ember-blob--b {
          right: -20%;
          top: 30%;
          width: 50vmax;
          height: 50vmax;
          background: radial-gradient(circle at 60% 50%, #ffb347 0%, #b3230a 50%, transparent 70%);
          animation: drift-b 32s ease-in-out infinite;
        }

        .ember-blob--c {
          left: 10%;
          bottom: -25%;
          width: 45vmax;
          height: 45vmax;
          background: radial-gradient(circle at 50% 50%, #ff6a1a 0%, #5c1400 50%, transparent 70%);
          animation: drift-c 22s ease-in-out infinite;
        }

        .ember-blob--d {
          right: 5%;
          bottom: -15%;
          width: 35vmax;
          height: 35vmax;
          background: radial-gradient(circle at 50% 50%, #ffe8c2 0%, #ff8a2b 40%, transparent 70%);
          opacity: 0.45;
          animation: drift-d 18s ease-in-out infinite;
        }

        /* Modul activ controlat prin clase CSS pur, evitând inline styles dinamice */
        .ember-bg--active .ember-blob--a { animation-duration: 10.8s; opacity: 0.85; }
        .ember-bg--active .ember-blob--b { animation-duration: 13.3s; opacity: 0.85; }
        .ember-bg--active .ember-blob--c { animation-duration: 9.1s; opacity: 0.85; }
        .ember-bg--active .ember-blob--d { animation-duration: 7.5s; opacity: 0.6; }

        @keyframes drift-a {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          33% { transform: translate3d(6vw, 5vh, 0) scale(1.05); }
          66% { transform: translate3d(-3vw, 8vh, 0) scale(0.97); }
        }
        @keyframes drift-b {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          40% { transform: translate3d(-8vw, -3vh, 0) scale(1.04); }
          70% { transform: translate3d(-2vw, 6vh, 0) scale(0.96); }
        }
        @keyframes drift-c {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(5vw, -8vh, 0) scale(1.06); }
        }
        @keyframes drift-d {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-6vw, -5vh, 0) scale(1.08); }
        }

        .ember-grain {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 4px 4px;
          opacity: 0.35;
          pointer-events: none;
        }

        .ember-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(120% 100% at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.5) 100%);
          pointer-events: none;
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