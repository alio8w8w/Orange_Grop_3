'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ArrowDown } from 'lucide-react'
import { OrbField } from '@/components/orb-field'
import { useTranslations } from 'next-intl'

const TEAM_IMAGES = [
  '/images/team-photo.png',
  '/images/team-photo2.png',
  '/images/team-photo3.png',
]

export function HeroSection() {
  const t = useTranslations('Hero')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Carusel imagini fundal
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % TEAM_IMAGES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      id="hero"
      className="relative flex h-screen min-h-[640px] w-full items-center justify-center overflow-hidden"
    >
      {/* Carusel imagini fundal */}
      {TEAM_IMAGES.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={src}
            alt={`Orange Group 3 team photo ${index + 1}`}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-brand-black/75 z-10" />
      <OrbField variant="warm" />

      <div className="relative z-20 mx-auto max-w-4xl px-6 text-center">
        {/* Tag superior */}
        <p className="font-display text-xs font-bold uppercase tracking-[0.4em] text-brand-orange sm:text-sm">
          {t('tag')}
        </p>

        {/* Titlu static */}
        <h1 className="mt-6 font-display text-5xl font-black uppercase leading-[0.95] tracking-tight text-balance text-brand-white sm:text-7xl md:text-8xl">
          <span>{t('titleLine1')}</span>
          <span className="mt-2 block text-brand-orange">
            {t('titleLine2')}
          </span>
        </h1>

        {/* Descriere */}
        <p className="mx-auto mt-8 max-w-2xl text-pretty text-base leading-relaxed text-brand-white/75 sm:text-lg">
          {t('description')}
        </p>

        {/* Buton */}
        <div className="mt-10">
          <a
            href="#members"
            className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-brand-black transition-transform hover:scale-105 active:scale-95"
          >
            {t('cta')}
            <ArrowDown className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}