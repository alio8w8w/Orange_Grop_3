'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type Direction = 'up' | 'down' | 'left' | 'right' | 'static'

// ⚙️ Coordonate exacte (offsetX și offsetY) astfel încât punctul unde se întâlnesc mâinile să fie fix pe cursor
const CONFIG: Record<Direction, { src: string; width: number; height: number; offsetX: number; offsetY: number }> = {
  static: {
    src: '/mascot/static.png',
    width: 90,
    height: 100,
    offsetX: 45, // Mijlocul lățimii (unde se unesc mâinile sus)
    offsetY: 15, // Partea de sus a mâinilor
  },
  up: {
    src: '/mascot/up.png',
    width: 90,
    height: 100,
    offsetX: 45,
    offsetY: 15,
  },
  down: {
    src: '/mascot/down.png',
    width: 90,
    height: 100,
    offsetX: 45,
    offsetY: 15,
  },
  left: {
    src: '/mascot/left.png',
    width: 110,
    height: 85,
    offsetX: 95, // Mâinile sunt în partea dreaptă a imaginii când se uită la stânga
    offsetY: 42, // La mijlocul înălțimii
  },
  right: {
    src: '/mascot/right.png',
    width: 110,
    height: 85,
    offsetX: 15, // Mâinile sunt în partea stângă a imaginii când se uită la dreapta
    offsetY: 42, // La mijlocul înălțimii
  },
}

export default function Mascot() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [direction, setDirection] = useState<Direction>('static')
  const directionRef = useRef<Direction>('static')

  useEffect(() => {
    if (typeof window === 'undefined') return

    let lastMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastMouse.x
      const dy = e.clientY - lastMouse.y
      const dist = Math.hypot(dx, dy)

      let nextDir: Direction = directionRef.current

      // Prag mic pentru a schimba direcția fin și rapid
      if (dist < 2) {
        nextDir = 'static'
      } else if (Math.abs(dx) > Math.abs(dy)) {
        nextDir = dx > 0 ? 'right' : 'left'
      } else {
        nextDir = dy > 0 ? 'down' : 'up'
      }

      if (nextDir !== directionRef.current) {
        directionRef.current = nextDir
        setDirection(nextDir)
      }

      // Poziționare instantanee bazată pe offset-ul mâinilor
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
      className="pointer-events-none fixed left-0 top-0 z-50 select-none drop-shadow-[0_0_12px_rgba(255,138,43,0.4)]"
      style={{
        width: current.width,
        height: current.height,
        willChange: 'transform',
      }}
    >
      <Image
        src={current.src}
        alt="Mascot"
        width={current.width}
        height={current.height}
        priority
        draggable={false}
        style={{ objectFit: 'contain', width: '100%', height: '100%' }}
      />
    </div>
  )
}