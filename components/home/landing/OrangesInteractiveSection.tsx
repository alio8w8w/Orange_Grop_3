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
  xPercent: number
  size: number
  rotation: number
  duration: number
}

interface OrangesInteractiveSectionProps {
  children: (props: { triggerOranges: () => void }) => React.ReactNode
}

export function OrangesInteractiveSection({ children }: OrangesInteractiveSectionProps) {
  // Portocalele care cad de sus până jos
  const [fallingOranges, setFallingOranges] = useState<FallingOrange[]>([])
  
  // Portocalele statice acumulate la baza paginii (în footer)
  const [bottomOranges, setBottomOranges] = useState<BaseOrange[]>([])

  // Generăm mormanul de jos la inițializare
  useEffect(() => {
    const count = 30
    const base: BaseOrange[] = Array.from({ length: count }).map((_, i) => ({
      id: `base-${i}`,
      xPercent: (i / (count - 1)) * 96 + 2,
      size: Math.floor((Math.random() * 25 + 50) * 1.3),
      rotation: Math.random() * 360,
      offsetY: (i % 3) * 22 + (Math.sin(i * 1.5) * 6),
    }))
    setBottomOranges(base)
  }, [])

  // Funcție declanșată la hover pe cardurile de proiecte
  const triggerOranges = () => {
    const newOranges: FallingOrange[] = Array.from({ length: 10 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      xPercent: Math.random() * 90 + 5, // Poziție aleatorie pe orizontală (în %)
      size: Math.floor((Math.random() * 30 + 45) * 1.3),
      rotation: Math.random() * 360,
      duration: Math.random() * 0.8 + 1.8, // Cădere fluidă
    }))

    setFallingOranges((prev) => [...prev, ...newOranges])

    // Curățăm portocalele după ce au căzut și adăugăm câteva în mormanul de jos
    setTimeout(() => {
      setFallingOranges((prev) => prev.filter((o) => !newOranges.includes(o)))
      
      const addedToBase: BaseOrange[] = newOranges.slice(0, 3).map((o) => ({
        id: `dropped-${o.id}`,
        xPercent: o.xPercent,
        size: o.size,
        rotation: o.rotation,
        offsetY: Math.random() * 25,
      }))
      
      setBottomOranges((prev) => [...prev.slice(addedToBase.length), ...addedToBase])
    }, 2600)
  }

  return (
    <div className="relative w-full bg-transparent">
      
      {/* 🍊 1. STRATUL GLOBAL DE CĂDERE (FIXED PE ECRAN SAU ABSOLUTE PE DOCUMENT) */}
      {/* Folosim pointer-events-none ca să nu blocheze click-urile pe site */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {fallingOranges.map((orange) => (
            <motion.img
              key={orange.id}
              src="/images/portocala1.png"
              alt="Portocală"
              initial={{ 
                top: '-10vh', 
                left: `${orange.xPercent}vw`, 
                opacity: 0, 
                rotate: 0 
              }}
              animate={{
                top: '105vh', // Cade complet dincolo de marginea de jos a ecranului
                opacity: [0, 1, 1, 0.9],
                rotate: orange.rotation + 360,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: orange.duration,
                ease: [0.25, 1, 0.5, 1], // Efect gravitațional natural (ease-out lin)
              }}
              style={{
                position: 'absolute',
                width: `${orange.size}px`,
                height: `${orange.size}px`,
                objectFit: 'contain',
                filter: 'brightness(0.85) contrast(1.05) saturate(1.10) drop-shadow(0 10px 18px rgba(0,0,0,0.5))',
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* 🍊 2. PORTOCALELE FIXATE LA BAZA ULTIMEI SECȚIUNI (FOOTER) */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-20 overflow-hidden">
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
              filter: 'brightness(0.85) contrast(1.05) saturate(1.10) drop-shadow(0 10px 18px rgba(0,0,0,0.5))',
            }}
          />
        ))}
      </div>

      {/* 📝 3. CONȚINUTUL NORMAL AL PAGINII (PROJECTS & FOOTER) */}
      <div className="relative z-10">
        {children({ triggerOranges })}
      </div>
    </div>
  )
}