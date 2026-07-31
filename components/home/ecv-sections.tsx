'use client'

import Image from 'next/image'
import { GraduationCap } from 'lucide-react'
import type { TeamMember } from '@/lib/team-data'
import { cn } from '@/lib/utils'

export type ECVTone = 'light' | 'dark' | 'orange'

interface ToneStyles {
  heading: string
  eyebrow: string
  sub: string
  card: string
  cardText: string
  muted: string
  line: string
  track: string
  dot: string
}

const TONES: Record<ECVTone, ToneStyles> = {
  light: {
    heading: 'text-brand-black',
    eyebrow: 'text-brand-orange',
    sub: 'text-brand-black/60',
    card: 'border-brand-black/10 bg-brand-cream',
    cardText: 'text-brand-black',
    muted: 'text-brand-black/60',
    line: 'bg-brand-black/15',
    track: 'bg-brand-black/10',
    dot: 'bg-brand-orange',
  },
  dark: {
    heading: 'text-brand-white',
    eyebrow: 'text-brand-orange',
    sub: 'text-brand-white/60',
    card: 'border-brand-white/10 bg-brand-white/[0.04]',
    cardText: 'text-brand-white',
    muted: 'text-brand-white/60',
    line: 'bg-brand-white/15',
    track: 'bg-brand-white/10',
    dot: 'bg-brand-orange',
  },
  orange: {
    heading: 'text-brand-black',
    eyebrow: 'text-brand-black',
    sub: 'text-brand-black/70',
    card: 'border-brand-black/20 bg-brand-black',
    cardText: 'text-brand-white',
    muted: 'text-brand-white/70',
    line: 'bg-brand-black/25',
    track: 'bg-brand-black/25',
    dot: 'bg-brand-black',
  },
}

function SectionTitle({
  index,
  label,
  t,
}: {
  index: string
  label: string
  t: ToneStyles
}) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <span className={cn('font-display text-sm font-bold', t.eyebrow)}>
        {index}
      </span>
      <h2
        className={cn(
          'font-display text-2xl font-black uppercase tracking-tight sm:text-3xl',
          t.heading,
        )}
      >
        {label}
      </h2>
      <span className={cn('h-px flex-1', t.line)} />
    </div>
  )
}

export function ECVSections({
  member,
  tone,
}: {
  member: TeamMember
  tone: ECVTone
}) {
  const t = TONES[tone]
  const m = member as any

  // Setăm valori implicite pentru statistici pentru a preveni erorile de tip "undefined"
  const stats = m.experienceStats || { years: '2', projects: '10', clients: '5', awards: '0' }

  const statCards = [
    { value: `${stats.years}+`, label: 'Years Experience' },
    { value: `${stats.projects}+`, label: 'Projects Delivered' },
    { value: `${stats.clients}+`, label: 'Happy Clients' },
    { value: `${stats.awards}`, label: 'Awards Won' },
  ]

  const educationList = m.education || []
  const skillsList = m.skills || []
  const portfolioList = m.portfolioWorks || m.portfolio || []

  return (
    <div className="mt-16 space-y-20">
      {/* Experience — Bento box statistics */}
      <section>
        <SectionTitle index="01" label="Experience" t={t} />
        <div className="grid grid-cols-2 gap-4 sm:auto-rows-[150px] sm:grid-cols-4">
          <div
            className={cn(
              'col-span-2 flex flex-col justify-between rounded-3xl border p-6 sm:row-span-2',
              t.card,
            )}
          >
            <span className={cn('font-display text-xs font-bold uppercase tracking-wide', t.eyebrow)}>
              {statCards[0].label}
            </span>
            <span className={cn('font-display text-6xl font-black leading-none sm:text-8xl', t.cardText)}>
              {statCards[0].value}
            </span>
          </div>
          <div
            className={cn(
              'col-span-2 flex flex-col justify-between rounded-3xl border p-6',
              t.card,
            )}
          >
            <span className={cn('font-display text-xs font-bold uppercase tracking-wide', t.eyebrow)}>
              {statCards[1].label}
            </span>
            <span className={cn('font-display text-5xl font-black leading-none', t.cardText)}>
              {statCards[1].value}
            </span>
          </div>
          {statCards.slice(2).map((s) => (
            <div
              key={s.label}
              className={cn(
                'flex flex-col justify-between rounded-3xl border p-6',
                t.card,
              )}
            >
              <span className={cn('font-display text-[0.65rem] font-bold uppercase tracking-wide', t.eyebrow)}>
                {s.label}
              </span>
              <span className={cn('font-display text-4xl font-black leading-none', t.cardText)}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Education — Timeline */}
      <section>
        <SectionTitle index="02" label="Education" t={t} />
        <ol className="relative ml-2 space-y-8 border-l-2 pl-8" style={{ borderColor: 'transparent' }}>
          <span className={cn('absolute left-0 top-1 h-full w-0.5', t.line)} aria-hidden />
          {educationList.length > 0 ? (
            educationList.map((edu: any, index: number) => (
              <li key={edu.id || edu.school || index} className="relative">
                <span
                  className={cn(
                    'absolute -left-[2.6rem] top-1 flex h-6 w-6 items-center justify-center rounded-full',
                    t.dot,
                  )}
                  aria-hidden
                >
                  <GraduationCap
                    className={cn(
                      'h-3.5 w-3.5',
                      tone === 'orange' ? 'text-brand-orange' : 'text-brand-black',
                    )}
                  />
                </span>
                <span className={cn('font-display text-xs font-bold uppercase tracking-wide', t.eyebrow)}>
                  {edu.period || edu.years}
                </span>
                <h3 className={cn('mt-1 font-display text-xl font-extrabold', t.heading)}>
                  {edu.school || edu.institutie}
                </h3>
                <p className={cn('font-medium', t.cardText)}>{edu.degree}</p>
                <p className={cn('mt-1 text-sm leading-relaxed', t.sub)}>
                  {edu.detail || edu.description}
                </p>
              </li>
            ))
          ) : (
            <p className={cn('text-sm', t.sub)}>Nicio informație despre educație adăugată.</p>
          )}
        </ol>
      </section>

      {/* Skills — progress bars */}
      <section>
        <SectionTitle index="03" label="Skills" t={t} />
        <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {skillsList.length > 0 ? (
            skillsList.map((skill: any, idx: number) => {
              const skillName = typeof skill === 'string' ? skill : (skill.name || skill)
              const skillLevel = typeof skill === 'object' && skill.level ? skill.level : 85
              return (
                <div key={idx}>
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className={cn('font-medium', t.cardText)}>{skillName}</span>
                    <span className={cn('font-display text-sm font-bold', t.sub)}>
                      {skillLevel}%
                    </span>
                  </div>
                  <div className={cn('h-2.5 w-full overflow-hidden rounded-full', t.track)}>
                    <div
                      className="h-full rounded-full bg-brand-orange transition-all duration-700"
                      style={{ width: `${skillLevel}%` }}
                    />
                  </div>
                </div>
              )
            })
          ) : (
            <p className={cn('text-sm', t.sub)}>Niciun skill adăugat.</p>
          )}
        </div>
      </section>

      {/* Portfolio — editorial grid */}
      <section>
        <SectionTitle index="04" label="Portfolio" t={t} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioList.length > 0 ? (
            portfolioList.map((work: any, i: number) => (
              <article
                key={work.id || i}
                className={cn(
                  'group flex flex-col overflow-hidden rounded-2xl border transition-colors hover:border-brand-orange',
                  t.card,
                )}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={work.image || work.url || '/placeholder.svg'}
                    alt={work.title || 'Proiect'}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 bg-brand-black px-2 py-1 font-display text-xs font-bold text-brand-orange">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-xs font-bold uppercase tracking-wide text-brand-orange">
                      {work.category || 'Web Design'}
                    </span>
                    <span className={cn('text-xs', t.sub)}>{work.year || '2026'}</span>
                  </div>
                  <h3 className={cn('mt-2 font-display text-xl font-extrabold', t.cardText)}>
                    {work.title}
                  </h3>
                  <p className={cn('mt-2 text-pretty text-sm leading-relaxed', t.muted)}>
                    {work.description}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <p className={cn('text-sm', t.sub)}>Niciun proiect în portofoliu.</p>
          )}
        </div>
      </section>
    </div>
  )
}