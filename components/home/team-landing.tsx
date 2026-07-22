'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { useTeam } from '@/components/team-context'

export function TeamLanding() {
  const { members, setActiveMemberId } = useTeam()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-brand-orange">
            2025 — 2027
          </p>
          <h1 className="mt-4 font-display text-5xl font-black uppercase leading-[0.95] tracking-tight text-balance text-brand-black sm:text-7xl">
            Creative
            <br />
            <span className="text-brand-orange">Portfolio</span>
          </h1>
          <p className="mt-6 max-w-md text-pretty leading-relaxed text-brand-black/70">
            We are Orange Group 3 — a six-person studio of designers, motion
            artists and photographers. Pick a member below and watch their home
            page transform to match their style.
          </p>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border-4 border-brand-black">
          <Image
            src="/images/team-photo.png"
            alt="The Orange Group 3 team together in their studio"
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
          <span className="absolute left-3 top-3 bg-brand-orange px-3 py-1 font-display text-xs font-bold uppercase tracking-wide text-brand-black">
            The Team
          </span>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-center gap-4">
          <h2 className="font-display text-lg font-extrabold uppercase tracking-wide text-brand-black">
            Meet the members
          </h2>
          <span className="h-px flex-1 bg-brand-black/15" />
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m, i) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => setActiveMemberId(m.id)}
                className="group flex w-full items-center gap-4 rounded-lg border-2 border-brand-black/10 bg-brand-cream p-4 text-left transition-colors hover:border-brand-orange"
              >
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 border-brand-black">
                  <Image
                    src={m.profilePicture || '/placeholder.svg'}
                    alt={`${m.firstName} ${m.lastName}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-xs font-bold uppercase tracking-wide text-brand-orange">
                    {String(i + 1).padStart(2, '0')} · {m.role}
                  </span>
                  <span className="mt-1 block truncate font-display text-lg font-extrabold text-brand-black">
                    {m.firstName} {m.lastName}
                  </span>
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-brand-black/40 transition-colors group-hover:text-brand-orange" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
