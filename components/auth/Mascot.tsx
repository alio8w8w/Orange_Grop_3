'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type Direction = 'up' | 'down' | 'left' | 'right' | 'static'

// ⚙️ Dimensiunile lățimii/înălțimii imaginii și offset-urile ajustate:
// Pentru 'left': mâinile sunt în dreapta imaginii, dar vrem ca mouse-ul să fie cu 30% mai la stânga față de centru,
// adică la 80% din lățime (lățime 110 -> offsetX = 88, adică 110 * 0.8).
// Pentru 'right': mâinile sunt în stânga imaginii, iar mouse-ul trebuie să fie cu 30% mai la dreapta față de centru,
// adică la 20% din lățime (110 * 0.2 = 22).
const CONFIG: Record<Direction, { src: string; width: number; height: number; offsetX: number; offsetY: number }> = {
  static: {
    src: '/mascot/static.png',
    width: 90,
    height: 100,
    offsetX: 45,
    offsetY: 15,
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
    offsetX: 88, // 80% din lățime (mută imaginea mai la dreapta față de mouse, deci mouse-ul pare că ține de mâini care sunt la stânga relativ la offset)
    offsetY: 42,
  },
  right: {
    src: '/mascot/right.png',
    width: 110,
    height: 85,
    offsetX: 22, // 20% din lățime (mută imaginea mai la stânga față de mouse, mâinile fiind în stânga imaginii)
    offsetY: 42,
  },
}

export default function Mascot() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [direction, setDirection] = useState<Direction>('static')
  
  const directionRef = useRef<Direction>('static')
  const mousePos = useRef({ x: 0, y: 0 })
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    let lastMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }

      const dx = e.clientX - lastMouse.x
      const dy = e.clientY - lastMouse.y
      const dist = Math.hypot(dx, dy)

      let nextDir: Direction = directionRef.current

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

      lastMouse = { x: e.clientX, y: e.clientY }
    }

    // Folosim un loop prin requestAnimationFrame pentru a rula poziționarea la 60/120fps fluid, 
    // complet decuplat de frecvența evenimentului de mousemove.
    const updatePosition = () => {
      const currentConfig = CONFIG[directionRef.current]
      if (wrapperRef.current) {
        const posX = mousePos.current.x - currentConfig.offsetX
        const posY = mousePos.current.y - currentConfig.offsetY
        wrapperRef.current.style.transform = `translate3d(${posX}px, ${posY}px, 0)`
      }
      rafId.current = requestAnimationFrame(updatePosition)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    rafId.current = requestAnimationFrame(updatePosition)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafId.current) cancelAnimationFrame(rafId.current)
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
        transform: 'translate3d(-9999px, -9999px, 0)', // Ascuns inițial până la prima mișcare
      }}
    >
      <Image
        ref={imgRef}
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