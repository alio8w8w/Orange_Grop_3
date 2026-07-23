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

  const textLine1 = t('titleLine1')
  const textLine2 = t('titleLine2')
  const [displayedText1, setDisplayedText1] = useState('')
  const [displayedText2, setDisplayedText2] = useState('')
  const [isTypingComplete, setIsTypingComplete] = useState(false)

  // Carusel fundal corectat
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % TEAM_IMAGES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Efect de typing lent (> 1.5 secunde total)
  useEffect(() => {
    let i = 0
    let j = 0
    let timer1: NodeJS.Timeout
    let timer2: NodeJS.Timeout

    setDisplayedText1('')
    setDisplayedText2('')
    setIsTypingComplete(false)

    const typeLine1 = () => {
      if (i < textLine1.length) {
        setDisplayedText1((prev) => prev + textLine1.charAt(i))
        i++
        timer1 = setTimeout(typeLine1, 80)
      } else {
        typeLine2()
      }
    }

    const typeLine2 = () => {
      if (j < textLine2.length) {
        setDisplayedText2((prev) => prev + textLine2.charAt(j))
        j++
        timer2 = setTimeout(typeLine2, 60)
      } else {
        setIsTypingComplete(true)
      }
    }

    const initialDelay = setTimeout(() => {
      typeLine1()
    }, 400)

    return () => {
      clearTimeout(initialDelay)
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [textLine1, textLine2])

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
        <p className="font-display text-xs font-bold uppercase tracking-[0.4em] text-brand-orange sm:text-sm transition-opacity duration-1000 ease-out">
          {t('tag')}
        </p>

        {/* Titlu cu efect de typing */}
        <h1 className="mt-6 font-display text-5xl font-black uppercase leading-[0.95] tracking-tight text-balance text-brand-white sm:text-7xl md:text-8xl min-h-[140px] sm:min-h-[220px]">
          <span>{displayedText1}</span>
          <span className="mt-2 block text-brand-orange relative inline-block">
            {displayedText2}
            {!isTypingComplete && (
              <span className="inline-block w-2 bg-brand-orange ml-1 animate-pulse h-[0.8em] align-middle" />
            )}
          </span>
        </h1>

        {/* Subtitlu cu linie de subliniere animată */}
        <div className="relative mx-auto mt-8 max-w-2xl">
          <p className="text-pretty text-base leading-relaxed text-brand-white/75 sm:text-lg">
            {t('description')}
          </p>
          <div className="mx-auto mt-4 h-[2px] w-full max-w-[200px] bg-gradient-to-r from-transparent via-brand-orange to-transparent transition-all duration-[1500ms] ease-out scale-x-100 opacity-90" />
        </div>

        {/* Buton cu tranziție lentă */}
        <div className="mt-10 transition-all duration-1000 ease-out delay-500">
          <a
            href="#members"
            className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-brand-black transition-all duration-700 ease-out hover:scale-105 hover:shadow-xl hover:shadow-brand-orange/25 active:scale-95"
          >
            {t('cta')}
            <ArrowDown className="h-4 w-4 transition-transform duration-700 ease-out hover:translate-y-1" />
          </a>
        </div>
      </div>
    </section>
  )
}