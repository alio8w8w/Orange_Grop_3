'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type Direction = 'up' | 'down' | 'left' | 'right' | 'static'

interface MascotProps {
  marime?: number         // ex: 72, 96 (dimensiune de bază în px)
  vitezaUrmarire?: number // păstrat pentru compatibilitate
}

const BASE_SIZE = 96 // Mărimea de referință pentru calculul de scalare

const CONFIG: Record<Direction, { src: string; width: number; height: number; offsetX: number; offsetY: number }> = {
  static: {
    src: '/mascot/static.png',
    width: 96,
    height: 110,
    offsetX: 48,
    offsetY: 8,
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
  left: {
    src: '/mascot/left.png',
    width: 120,
    height: 90,
    offsetX: 100,
    offsetY: 15,
  },
  right: {
    src: '/mascot/right.png',
    width: 120,
    height: 90,
    offsetX: 20,
    offsetY: 15,
  },
}

export default function Mascot({ marime = 96 }: MascotProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [direction, setDirection] = useState<Direction>('static')

  // Calculăm factorul de scalare dacă se trece o mărime diferită în AdminLayout
  const scale = marime / BASE_SIZE

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

      // Actualizare poziție cu ajustare pentru scala stabilită
      const currentConfig = CONFIG[nextDir]
      if (wrapperRef.current) {
        const posX = e.clientX - currentConfig.offsetX * scale
        const posY = e.clientY - currentConfig.offsetY * scale
        wrapperRef.current.style.transform = `translate3d(${posX}px, ${posY}px, 0) scale(${scale})`
      }

      lastMouse = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [scale])

  const current = CONFIG[direction]

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none fixed left-0 top-0 z-50 select-none origin-top-left drop-shadow-[0_0_18px_rgba(255,138,43,0.45)]"
      style={{
        width: current.width,
        height: current.height,
        willChange: 'transform',
      }}
    >
      <Image
        src={current.src}
        alt="Mascota Admin"
        width={current.width}
        height={current.height}
        priority
        draggable={false}
        style={{ objectFit: 'contain' }}
      />
    </div>
  )
}