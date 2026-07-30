'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { useTeam } from '@/components/team-context'
import { useTranslations } from 'next-intl'

export function MembersGrid() {
  const { members, setActiveMemberId } = useTeam()
  const t = useTranslations('Team')

  const totalCount = String(members.length).padStart(2, '0')

  return (
    <section id="members" className="relative z-10 py-20 sm:py-28 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-brand-orange">
              {t('subtitle')}
            </p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase tracking-tight text-brand-white sm:text-5xl">
              {t('title')}
            </h2>
          </div>
          <span className="hidden font-display text-6xl font-black text-brand-white/10 sm:block">
            {totalCount}
          </span>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((m, i) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => setActiveMemberId(m.id)}
                className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-brand-white/10 bg-brand-white/[0.03] backdrop-blur-sm text-left transition-colors hover:border-brand-orange/60"
              >
                <span className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={m.poza_url || '/placeholder.svg'}
                    alt={`${m.nume || ''} ${m.prenume || ''}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/20 to-transparent" />
                  <span className="absolute left-4 top-4 font-display text-sm font-bold text-brand-orange">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </span>
                <span className="flex items-center justify-between gap-3 p-5">
                  <span className="min-w-0">
                    <span className="block font-display text-xs font-bold uppercase tracking-wide text-brand-orange">
                      {m.role || m.functie || 'Member'}
                    </span>
                    <span className="mt-1 block truncate font-display text-lg font-extrabold text-brand-white">
                      {m.nume} {m.prenume}
                    </span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-brand-white/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-orange" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}