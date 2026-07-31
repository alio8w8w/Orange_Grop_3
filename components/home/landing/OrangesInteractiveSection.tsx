'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BaseOrange {
  id: string
  xPercent: number
  size: number
  rotation: number
  offsetY: number
}

interface FallingOrange {
  id: number
  startX: number
  startY: number
  xOffset: number
  size: number
  rotation: number
  duration: number
}

interface OrangesInteractiveSectionProps {
  children: (props: { triggerOranges: (coords?: { x: number; y: number }) => void }) => React.ReactNode
}

export function OrangesInteractiveSection({ children }: OrangesInteractiveSectionProps) {
  const [fallingOranges, setFallingOranges] = useState<FallingOrange[]>([])
  const [bottomOranges, setBottomOranges] = useState<BaseOrange[]>([])

  // Generăm mormanul stabil de la baza paginii în footer
  useEffect(() => {
    const count = 35
    const base: BaseOrange[] = Array.from({ length: count }).map((_, i) => ({
      id: `base-${i}`,
      xPercent: (i / (count - 1)) * 96 + 2,
      size: Math.floor(Math.random() * 40 + 95), // Portocale foarte mari la bază
      rotation: Math.random() * 360,
      offsetY: (i % 3) * 26 + (Math.sin(i * 1.5) * 8),
    }))
    setBottomOranges(base)
  }, [])

  // Funcție declanșată la hover pe carduri
  const triggerOranges = (coords?: { x: number; y: number }) => {
    const startX = coords?.x || window.innerWidth / 2
    const startY = coords?.y || 300

    const newOranges: FallingOrange[] = Array.from({ length: 9 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      startX,
      startY,
      // Distribuție în formă de evantaj / piramidă plecând din centru
      xOffset: (Math.random() - 0.5) * 600,
      size: Math.floor(Math.random() * 45 + 100), // Portocale masive și extrem de vizibile (100px - 145px)
      rotation: Math.random() * 360,
      duration: Math.random() * 0.8 + 1.8,
    }))

    setFallingOranges((prev) => [...prev, ...newOranges])

    setTimeout(() => {
      setFallingOranges((prev) => prev.filter((o) => !newOranges.includes(o)))
      
      const addedToBase: BaseOrange[] = newOranges.slice(0, 3).map((o) => ({
        id: `dropped-${o.id}`,
        xPercent: Math.min(Math.max(((o.startX + o.xOffset) / window.innerWidth) * 100, 2), 96),
        size: o.size,
        rotation: o.rotation,
        offsetY: Math.random() * 30,
      }))
      
      setBottomOranges((prev) => [...prev.slice(addedToBase.length), ...addedToBase])
    }, 2600)
  }

  return (
    <div className="relative w-full bg-transparent">
      
      {/* 🍊 1. STRATUL GLOBAL DE FUNDAL (FIXED PE ECRAN, DAR SUB ORICE ELEMENT - z-0) */}
      {/* pointer-events-none garantează că poți da click pe orice text, imagine sau link */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        
        {/* Animația portocalelor în cădere */}
        <AnimatePresence>
          {fallingOranges.map((orange) => (
            <motion.img
              key={orange.id}
              src="/images/portocala1.png"
              alt="Portocală"
              initial={{ 
                position: 'fixed',
                left: orange.startX,
                top: orange.startY,
                x: '-50% ',
                y: 0,
                scale: 0.2, 
                opacity: 0, 
                rotate: 0 
              }}
              animate={{
                x: `calc(-50% + ${orange.xOffset}px)`,
                y: window.innerHeight + 150, // Cad de sus până jos de tot dincolo de ecran
                scale: 1,
                opacity: [0, 1, 1, 0.95],
                rotate: orange.rotation + 360,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: orange.duration,
                ease: [0.25, 1, 0.5, 1],
              }}
              style={{
                width: `${orange.size}px`,
                height: `${orange.size}px`,
                objectFit: 'contain',
                filter: 'brightness(0.85) contrast(1.05) saturate(1.10) drop-shadow(0 14px 22px rgba(0,0,0,0.7))',
              }}
            />
          ))}
        </AnimatePresence>

        {/* 🍊 2. MORMANUL DE PORTOCALE FIXAT LA BAZA PAGINII (FOOTER) */}
        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none">
          {bottomOranges.map((orange) => (
            <img
              key={orange.id}
              src="/images/portocala1.png"
              alt="Portocala jos"
              style={{
                position: 'absolute',
                left: `${orange.xPercent}%`,
                bottom: `${orange.offsetY}px`,
                width: `${orange.size}px`,
                height: `${orange.size}px`,
                transform: `rotate(${orange.rotation}deg)`,
                objectFit: 'contain',
                zIndex: Math.floor(orange.offsetY),
                filter: 'brightness(0.85) contrast(1.05) saturate(1.10) drop-shadow(0 14px 22px rgba(0,0,0,0.7))',
              }}
            />
          ))}
        </div>
      </div>

      {/* 📝 3. CONȚINUTUL PAGINII (PROJECTS & FOOTER) - PLASAT PE UN STRAT SUPERIOR (z-10) */}
      <div className="relative z-10">
        {children({ triggerOranges })}
      </div>
    </div>
  )
}