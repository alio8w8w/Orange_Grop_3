'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ArrowDown, Sparkles } from 'lucide-react'
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

  // Preluare texte pentru animația de tastare
  const line1Full = t('titleLine1')
  const line2Full = t('titleLine2')

  const [line1Typed, setLine1Typed] = useState('')
  const [line2Typed, setLine2Typed] = useState('')
  const [isLine1Finished, setIsLine1Finished] = useState(false)

  // Carusel imagini de fundal
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % TEAM_IMAGES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Animație Typewriter (Scriere efectivă a titlului)
  useEffect(() => {
    setLine1Typed('')
    setLine2Typed('')
    setIsLine1Finished(false)

    let index1 = 0
    const timer1 = setInterval(() => {
      if (index1 < line1Full.length) {
        setLine1Typed(line1Full.slice(0, index1 + 1))
        index1++
      } else {
        clearInterval(timer1)
        setIsLine1Finished(true)
      }
    }, 45) // Viteza de tastare prima linie

    return () => clearInterval(timer1)
  }, [line1Full])

  useEffect(() => {
    if (!isLine1Finished) return

    let index2 = 0
    const timer2 = setInterval(() => {
      if (index2 < line2Full.length) {
        setLine2Typed(line2Full.slice(0, index2 + 1))
        index2++
      } else {
        clearInterval(timer2)
      }
    }, 45) // Viteza de tastare a doua linie

    return () => clearInterval(timer2)
  }, [isLine1Finished, line2Full])

  return (
    <section
      id="hero"
      className="relative flex min-h-[120vh] w-full flex-col justify-between overflow-hidden pt-44 sm:pt-52 md:pt-60 pb-24 md:pb-32"
    >
      {/* Carusel imagini fundal (Imagini clare, neblurate) */}
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

      {/* Overlay întunecat fără blur pentru claritate maximă + Orb-uri */}
      <div className="absolute inset-0 bg-brand-black/60 z-10" />
      <OrbField variant="warm" />

      {/* Conținut Central */}
      <div className="relative z-20 mx-auto my-auto max-w-5xl px-4 sm:px-6 text-center">
        
        {/* Tag Superior / Subtitlu Mic */}
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-black/40 px-4 py-1.5 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-brand-orange animate-pulse" />
          <p className="font-display text-xs font-bold uppercase tracking-[0.25em] sm:tracking-[0.4em] text-brand-orange">
            {t('tag')}
          </p>
        </div>

        {/* Titlu Principal cu Animație de Tastare */}
        <h1 className="mt-8 font-display text-3xl font-black uppercase leading-[1.05] tracking-tight text-brand-white sm:text-6xl md:text-7xl lg:text-8xl min-h-[120px] sm:min-h-[160px] md:min-h-[200px] flex flex-col justify-center items-center">
          <span>
            {line1Typed}
            {!isLine1Finished && (
              <span className="inline-block w-1.5 h-7 sm:h-12 md:h-16 ml-1 bg-brand-orange animate-pulse align-middle" />
            )}
          </span>
          <span className="mt-1 sm:mt-2 block text-brand-orange drop-shadow-[0_0_25px_rgba(249,115,22,0.4)]">
            {line2Typed}
            {isLine1Finished && line2Typed.length < line2Full.length && (
              <span className="inline-block w-1.5 h-7 sm:h-12 md:h-16 ml-1 bg-brand-white animate-pulse align-middle" />
            )}
          </span>
        </h1>

        {/* Descriere */}
        <p className="mx-auto mt-6 sm:mt-8 max-w-2xl text-pretty text-sm sm:text-base md:text-lg leading-relaxed text-brand-white/90 font-medium">
          {t('description')}
        </p>

        {/* Buton CTA Animat */}
        <div className="mt-10 sm:mt-14 flex justify-center">
          <a
            href="#members"
            className="group relative inline-flex items-center gap-3 rounded-full bg-brand-orange px-8 sm:px-10 py-4 sm:py-4.5 font-display text-xs sm:text-sm font-extrabold uppercase tracking-wider text-brand-black transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_45px_rgba(249,115,22,0.8)]"
          >
            {/* Aureolă pulsantă de lumină pe fundalul butonului */}
            <span className="absolute -inset-1 rounded-full bg-brand-orange/50 blur-lg transition duration-500 group-hover:bg-brand-orange/80 animate-pulse -z-10" />

            <span className="relative z-10">{t('cta')}</span>
            
            {/* Săgeată animată */}
            <ArrowDown className="relative z-10 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-y-1 animate-bounce" />
          </a>
        </div>
      </div>

      {/* Indicator subtil de derulare jos (Scroll Indicator) */}
      <div className="relative z-20 flex justify-center text-brand-white/50 text-xs font-mono tracking-widest uppercase">
        <span className="animate-pulse">Scroll Down</span>
      </div>
    </section>
  )
}