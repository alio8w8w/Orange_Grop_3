'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { useTeam } from '@/components/team-context'

export function MembersGrid() {
  const { members, setActiveMemberId } = useTeam()

  return (
    <section id="members" className="relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-brand-orange">
              The Collective
            </p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase tracking-tight text-brand-white sm:text-5xl">
              Meet the members
            </h2>
          </div>
          <span className="hidden font-display text-6xl font-black text-brand-white/10 sm:block">
            06
          </span>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m, i) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => setActiveMemberId(m.id)}
                className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-brand-white/10 bg-brand-white/[0.03] text-left transition-colors hover:border-brand-orange/60"
              >
                <span className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={m.profilePicture || '/placeholder.svg'}
                    alt={`${m.firstName} ${m.lastName}`}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
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
                      {m.role}
                    </span>
                    <span className="mt-1 block truncate font-display text-xl font-extrabold text-brand-white">
                      {m.firstName} {m.lastName}
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
