'use client'

import Image from 'next/image'
import { useTeam } from '@/components/team-context'
import { MemberSwitcher } from '@/components/home/member-switcher'
import type { Skill } from '@/lib/team-data'

export function SkillsView() {
  const { activeMember, members } = useTeam()
  const member = activeMember ?? members[0]

  // Group skills by category so the consistent layout stays organized.
  const grouped = member.skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    ;(acc[skill.category] ??= []).push(skill)
    return acc
  }, {})

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      {!activeMember && (
        <p className="mb-6 rounded-md border border-brand-orange/40 bg-brand-orange/10 px-4 py-2 text-sm text-brand-white/70">
          Showing the first team member by default. Pick anyone below to see
          their skills.
        </p>
      )}

      <div className="flex flex-col gap-6 border-b border-brand-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 border-brand-white/20">
            <Image
              src={member.profilePicture || '/placeholder.svg'}
              alt={`${member.firstName} ${member.lastName}`}
              fill
              sizes="64px"
              className="object-cover"
            />
          </span>
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
              Personal Skills
            </p>
            <h1 className="font-display text-3xl font-black uppercase tracking-tight text-brand-white sm:text-4xl">
              {member.firstName} {member.lastName}
            </h1>
            <p className="text-sm text-brand-white/60">{member.role}</p>
          </div>
        </div>
        <MemberSwitcher tone="onDark" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {Object.entries(grouped).map(([category, skills]) => (
          <section key={category}>
            <h2 className="mb-4 flex items-center gap-3 font-display text-sm font-extrabold uppercase tracking-wide text-brand-white">
              <span className="h-2 w-2 rotate-45 bg-brand-orange" />
              {category}
            </h2>
            <ul className="space-y-5">
              {skills.map((skill) => (
                <li key={skill.name}>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <span className="font-medium text-brand-white">
                      {skill.name}
                    </span>
                    <span className="font-display text-sm font-bold text-brand-white/50">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-brand-white/10">
                    <div
                      className="h-full rounded-full bg-brand-orange transition-all"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
