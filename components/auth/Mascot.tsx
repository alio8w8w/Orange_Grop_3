'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type Direction = 'up' | 'down' | 'left' | 'right' | 'static'

// ⚙️ CONFIGURARE DEDICATĂ PENTRU FIECARE STARE A MASCOTEI
// Dacă un sprite (ex: left/right) ți se pare prea mic, mărește 'width' și 'height' pentru el!
const CONFIG: Record<Direction, { src: string; width: number; height: number; offsetX: number; offsetY: number }> = {
  static: {
    src: '/mascot/static.png',
    width: 96,
    height: 110,
    offsetX: 48, // Mâinile sunt la jumătatea lățimii (96 / 2)
    offsetY: 8,  // Mâinile sunt sus
  },
  up: {
    src: '/mascot/up.png',
    width: 96,
    height: 110,
    offsetX: 48,
    offsetY: 8,
  },
  down: {
    src: '/mascot/down.png',
    width: 96,
    height: 110,
    offsetX: 48,
    offsetY: 8,
  },
  // Mărim dimensiunile pentru stânga/dreapta ca să nu mai pară mici!
  left: {
    src: '/mascot/left.png',
    width: 120,  // Dimensiune mărită
    height: 90,
    offsetX: 100, // Mâinile sunt în partea dreaptă a imaginii rotite
    offsetY: 15,
  },
  right: {
    src: '/mascot/right.png',
    width: 120,  // Dimensiune mărită
    height: 90,
    offsetX: 20,  // Mâinile sunt în partea stângă a imaginii rotite
    offsetY: 15,
  },
}

export default function Mascot() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [direction, setDirection] = useState<Direction>('static')

  useEffect(() => {
    if (typeof window === 'undefined') return

    let lastMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    let lastDirection: Direction = 'static'

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastMouse.x
      const dy = e.clientY - lastMouse.y
      const dist = Math.hypot(dx, dy)

      let nextDir: Direction = lastDirection

      // Detecție direcție
      if (dist < 4) {
        nextDir = 'static'
      } else if (Math.abs(dx) > Math.abs(dy)) {
        nextDir = dx > 0 ? 'right' : 'left'
      } else {
        nextDir = dy > 0 ? 'down' : 'up'
      }

      if (nextDir !== lastDirection) {
        lastDirection = nextDir
        setDirection(nextDir)
      }

      // ⚡ ACTUALIZARE INSTANTANEE (Fără lag, lipit 100% de cursor)
      const currentConfig = CONFIG[nextDir]
      if (wrapperRef.current) {
        const posX = e.clientX - currentConfig.offsetX
        const posY = e.clientY - currentConfig.offsetY
        wrapperRef.current.style.transform = `translate3d(${posX}px, ${posY}px, 0)`
      }

      lastMouse = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const current = CONFIG[direction]

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none fixed left-0 top-0 z-50 select-none drop-shadow-[0_0_18px_rgba(255,138,43,0.45)]"
      style={{
        width: current.width,
        height: current.height,
        willChange: 'transform',
      }}
    >
      <Image
        src={current.src}
        alt=""
        width={current.width}
        height={current.height}
        priority
        draggable={false}
        style={{ objectFit: 'contain' }}
      />
    </div>
  )
}