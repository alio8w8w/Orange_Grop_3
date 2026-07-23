'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ArrowDown } from 'lucide-react'
import { OrbField } from '@/components/orb-field'
import { useTranslations } from 'next-intl'

// Lista imaginilor pentru caruselul de fundal
const TEAM_IMAGES = [
  '/images/team-photo.png',
  '/images/team-photo-2.png', // Asigură-te că adaugi imaginile în folderul public/images sau redenumește-le conform proiectului tău
  '/images/team-photo-3.png',
]

export function HeroSection() {
  const t = useTranslations('Hero')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Efect pentru schimbarea automată a imaginilor la fiecare 5 secunde
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % TEAM_IMAGES.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section
      id="hero"
      className="relative flex h-screen min-h-[640px] w-full items-center justify-center overflow-hidden"
    >
      {/* Carusel imagini de fundal cu tranziție fade */}
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

      {/* Dark wash pentru a menține textul vizibil */}
      <div className="absolute inset-0 bg-brand-black/75 z-10" />
      <OrbField variant="warm" />

      <div className="relative z-20 mx-auto max-w-4xl px-6 text-center">
        {/* Animație intrare tag */}
        <p className="font-display text-xs font-bold uppercase tracking-[0.4em] text-brand-orange sm:text-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
          {t('tag')}
        </p>

        {/* Animație intrare titlu principal */}
        <h1 className="mt-6 font-display text-5xl font-black uppercase leading-[0.95] tracking-tight text-balance text-brand-white sm:text-7xl md:text-8xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
          {t('titleLine1')}
          <span className="mt-2 block text-brand-orange">{t('titleLine2')}</span>
        </h1>

        {/* Animație intrare descriere */}
        <p className="mx-auto mt-8 max-w-2xl text-pretty text-base leading-relaxed text-brand-white/75 sm:text-lg animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          {t('description')}
        </p>

        {/* Buton cu tranziție lentă, fină și efect de hover/active rafinat */}
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
          <a
            href="#members"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-brand-black transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg hover:shadow-brand-orange/20 active:scale-95"
          >
            {t('cta')}
            <ArrowDown className="h-4 w-4 transition-transform duration-500 ease-out" />
          </a>
        </div>
      </div>
    </section>
  )
}