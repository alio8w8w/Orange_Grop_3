"use client";

// components/ui/AnimatedWaveBackground.tsx
// Fundal animat cu valuri portocalii pe negru, viteza moderata, in bucla.
// Foloseste doar SVG + CSS (fara canvas) ca sa fie usor si sa nu incarce CPU-ul.
// Se pune o singura data, in layout-ul admin-ului, in spatele tuturor panourilor de sticla.

export default function AnimatedWaveBackground() {
  return (
    <div className="ogw-bg" aria-hidden="true">
      <div className="ogw-bg__glow ogw-bg__glow--1" />
      <div className="ogw-bg__glow ogw-bg__glow--2" />

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
          d="M-200,500 C 150,400 350,650 720,550 C 1090,450 1300,650 1640,500 L1640,900 L-200,900 Z"
          fill="url(#ogwWave1)"
        />
        <path
          className="ogw-wave ogw-wave--b"
          d="M-200,600 C 200,700 400,480 720,600 C 1040,720 1250,500 1640,620 L1640,900 L-200,900 Z"
          fill="url(#ogwWave2)"
        />
      </svg>

      <div className="ogw-bg__grain" />
    </div>
  );
}