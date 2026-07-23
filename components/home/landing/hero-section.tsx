'use client'

import Image from 'next/image'
import { ArrowDown } from 'lucide-react'
import { OrbField } from '@/components/orb-field'

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex h-screen min-h-[640px] w-full items-center justify-center overflow-hidden"
    >
      {/* Full-screen background image */}
      <Image
        src="/images/team-photo.png"
        alt="Orange Group 3 team together in their studio"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Dark wash so the overlay text stays legible */}
      <div className="absolute inset-0 bg-brand-black/75" />
      <OrbField variant="warm" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="font-display text-xs font-bold uppercase tracking-[0.4em] text-brand-orange sm:text-sm">
          Orange · Group 3
        </p>
        <h1 className="mt-6 font-display text-5xl font-black uppercase leading-[0.95] tracking-tight text-balance text-brand-white sm:text-7xl md:text-8xl">
          The Best Choice
          <span className="mt-2 block text-brand-orange">Orange / Group 3</span>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-pretty text-base leading-relaxed text-brand-white/75 sm:text-lg">
          Team number 3 represents a group of highly performing candidates
          across various fields, consisting of dedicated professionals and
          experts.
        </p>

        <a
          href="#members"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-brand-black transition-transform hover:scale-105"
        >
          Meet the members
          <ArrowDown className="h-4 w-4" />
        </a>
      </div>
    </section>
  )
}
