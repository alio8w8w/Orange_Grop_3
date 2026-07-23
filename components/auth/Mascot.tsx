'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type Direction = 'up' | 'down' | 'left' | 'right' | 'static'

const SPRITES: Record<Direction, string> = {
  up: '/mascot/up.png',
  down: '/mascot/down.png',
  left: '/mascot/left.png',
  right: '/mascot/right.png',
  static: '/mascot/static.png',
}

const SIZE = 96
const EASE = 0.25 // CRESCUT de la 0.08 la 0.25 pentru o mișcare mult mai rapidă!
const IDLE_THRESHOLD = 0.4

export default function Mascot() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [direction, setDirection] = useState<Direction>('static')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    let pos = { x: mouse.x, y: mouse.y }
    let rafId: number
    let lastDirection: Direction = 'static'

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    const tick = () => {
      const dx = mouse.x - pos.x
      const dy = mouse.y - pos.y

      pos.x += dx * EASE
      pos.y += dy * EASE

      const speed = Math.hypot(dx * EASE, dy * EASE)
      let nextDirection: Direction = lastDirection

      if (speed < IDLE_THRESHOLD) {
        nextDirection = 'static'
      } else if (Math.abs(dx) > Math.abs(dy)) {
        nextDirection = dx > 0 ? 'right' : 'left'
      } else {
        nextDirection = dy > 0 ? 'down' : 'up'
      }

      if (nextDirection !== lastDirection) {
        lastDirection = nextDirection
        setDirection(nextDirection)
      }

      if (wrapperRef.current) {
        wrapperRef.current.style.transform = `translate3d(${pos.x - SIZE / 2}px, ${pos.y - SIZE / 2}px, 0)`
      }

      rafId = requestAnimationFrame(tick)
    }

    if (!prefersReducedMotion) {
      rafId = requestAnimationFrame(tick)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none fixed left-0 top-0 z-10 select-none drop-shadow-[0_0_18px_rgba(255,138,43,0.45)] transition-opacity duration-300"
      style={{ width: SIZE, height: SIZE, willChange: 'transform' }}
    >
      <Image
        src={SPRITES[direction]}
        alt=""
        width={SIZE}
        height={SIZE}
        priority
        draggable={false}
      />
    </div>
  )
}