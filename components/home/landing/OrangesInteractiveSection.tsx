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
  xOffset: number // Offset din centrul secțiunii (în pixeli)
  size: number
  rotation: number
  duration: number
}

interface OrangesInteractiveSectionProps {
  children: (props: { triggerOranges: () => void }) => React.ReactNode
}

export function OrangesInteractiveSection({ children }: OrangesInteractiveSectionProps) {
  const [fallingOranges, setFallingOranges] = useState<FallingOrange[]>([])
  const [bottomOranges, setBottomOranges] = useState<BaseOrange[]>([])

  // Generăm mormanul stabil de la baza paginii
  useEffect(() => {
    const count = 32
    const base: BaseOrange[] = Array.from({ length: count }).map((_, i) => ({
      id: `base-${i}`,
      xPercent: (i / (count - 1)) * 96 + 2,
      size: Math.floor(Math.random() * 35 + 85), // Portocale mari la bază (85px - 120px)
      rotation: Math.random() * 360,
      offsetY: (i % 3) * 25 + (Math.sin(i * 1.5) * 8),
    }))
    setBottomOranges(base)
  }, [])

  // Funcție declanșată la hover pe carduri: portocalele pornesc din centru-sus (sub "Projects")
  const triggerOranges = () => {
    const newOranges: FallingOrange[] = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      // Răspândire sub formă de piramidă/evantaj plecând din centru (de sub frame)
      xOffset: (Math.random() - 0.5) * 550, 
      size: Math.floor(Math.random() * 40 + 90), // Portocale foarte mari și vizibile (90px - 130px)
      rotation: Math.random() * 360,
      duration: Math.random() * 0.7 + 1.6,
    }))

    setFallingOranges((prev) => [...prev, ...newOranges])

    setTimeout(() => {
      setFallingOranges((prev) => prev.filter((o) => !newOranges.includes(o)))
      
      // Adăugăm o parte din ele la mormanul de jos
      const addedToBase: BaseOrange[] = newOranges.slice(0, 3).map((o) => ({
        id: `dropped-${o.id}`,
        xPercent: 50 + (o.xOffset / window.innerWidth) * 100,
        size: o.size,
        rotation: o.rotation,
        offsetY: Math.random() * 30,
      }))
      
      setBottomOranges((prev) => [...prev.slice(addedToBase.length), ...addedToBase])
    }, 2400)
  }

  return (
    <div className="relative w-full bg-transparent">
      
      {/* 🍊 1. FUNDALUL GLOBAL: PORTOCALELE ÎN CĂDERE (PLASATE STRICT SUB ORICE ELEMENT - z-0) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        
        {/* Container poziționat exact sub titlul secțiunii de proiecte / în centrul paginii */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-0 h-0">
          <AnimatePresence>
            {fallingOranges.map((orange) => (
              <motion.img
                key={orange.id}
                src="/images/portocala1.png"
                alt="Portocală"
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 0.3, 
                  opacity: 0, 
                  rotate: 0 
                }}
                animate={{
                  x: orange.xOffset, // Se deschid în evantaj / piramidă pe măsură ce cad
                  y: window.innerHeight * 0.85, // Cad până jos în pagină
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
                  position: 'absolute',
                  width: `${orange.size}px`,
                  height: `${orange.size}px`,
                  objectFit: 'contain',
                  filter: 'brightness(0.85) contrast(1.05) saturate(1.10) drop-shadow(0 12px 20px rgba(0,0,0,0.6))',
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* 🍊 2. PORTOCALELE FIXATE LA BAZĂ (Mormanul de jos, tot în stratul de fundal) */}
        <div className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none">
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
                filter: 'brightness(0.85) contrast(1.05) saturate(1.10) drop-shadow(0 12px 20px rgba(0,0,0,0.6))',
              }}
            />
          ))}
        </div>
      </div>

      {/* 📝 3. CONȚINUTUL PAGINII (CARDURI, TEXT, IMAGINI) - SETat PE UN STRAT SUPERIOR (z-10) */}
      <div className="relative z-10">
        {children({ triggerOranges })}
      </div>
    </div>
  )
}