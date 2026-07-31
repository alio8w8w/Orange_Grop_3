'use client'

import React, { useState, useEffect } from 'react'

interface BaseOrange {
  id: string
  xPercent: number
  size: number
  rotation: number
  offsetY: number
}

export default function ContactFooter() {
  const [bottomOranges, setBottomOranges] = useState<BaseOrange[]>([])

  useEffect(() => {
    const count = 35
    const base: BaseOrange[] = Array.from({ length: count }).map((_, i) => ({
      id: `base-${i}`,
      xPercent: (i / (count - 1)) * 96 + 2,
      size: Math.floor(Math.random() * 40 + 95), // Portocale mari la bază
      rotation: Math.random() * 360,
      offsetY: (i % 3) * 26 + (Math.sin(i * 1.5) * 8),
    }))
    setBottomOranges(base)
  }, [])

  return (
    <footer className="relative w-full pt-20 pb-16 bg-brand-black text-brand-white overflow-hidden">
      
      {/* 🍊 MORMANUL DE PORTOCALE FIXAT LA BAZA SECȚIUNII DE CONTACT (SUB TEXT ȘI IMAGINI - z-0) */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-0">
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

      {/* 📝 CONȚINUTUL SECȚIUNII DE CONTACT (DEASUPRA PORTOCALELOR - z-10) */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* Conținutul tău existent pentru Contact / Specialiști */}
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl font-black uppercase tracking-tight sm:text-3xl lg:text-4xl">
            Scrie unui specialist
          </h2>
          <p className="mt-3 text-sm sm:text-base text-brand-white/70">
            Echipa noastră este pregătită să te ajute. Alege un specialist și scrie-i direct prin email.
          </p>
        </div>
      </div>
    </footer>
  )
}