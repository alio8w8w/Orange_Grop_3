'use client'

import Image from 'next/image'
import { useTeam } from '@/components/team-context'
import { MemberSwitcher } from '@/components/home/member-switcher'

export function PortfolioView() {
  const { activeMember, members } = useTeam()
  const member = activeMember ?? members[0]

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      {!activeMember && (
        <p className="mb-6 rounded-md border border-brand-orange/40 bg-brand-orange/10 px-4 py-2 text-sm text-brand-white/70">
          Showing the first team member by default. Pick anyone below to see
          their portfolio.
        </p>
      )}

      <div className="flex flex-col gap-6 border-b border-brand-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
            Project Portfolio
          </p>
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-brand-white sm:text-5xl">
            {member.firstName} {member.lastName}
          </h1>
          <p className="mt-1 text-sm text-brand-white/60">
            {member.role} · {member.portfolioWorks.length} selected works
          </p>
        </div>
        <MemberSwitcher tone="onDark" />
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {member.portfolioWorks.map((work, i) => (
          <article
            key={work.id}
            className="group flex flex-col overflow-hidden rounded-lg border border-brand-white/10 bg-brand-white/[0.03] transition-colors hover:border-brand-orange"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={work.image || '/placeholder.svg'}
                alt={work.title}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 bg-brand-black px-2 py-1 font-display text-xs font-bold text-brand-orange">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-xs font-bold uppercase tracking-wide text-brand-orange">
                  {work.category}
                </span>
                <span className="text-xs text-brand-white/50">{work.year}</span>
              </div>
              <h2 className="mt-2 font-display text-xl font-extrabold text-brand-white">
                {work.title}
              </h2>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-brand-white/65">
                {work.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
