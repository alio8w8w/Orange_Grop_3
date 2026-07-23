'use client'

import Image from 'next/image'
import { ArrowLeft, Mail, Phone, Globe, MapPin } from 'lucide-react'
import type { TeamMember } from '@/lib/team-data'
import { useTeam } from '@/components/team-context'
import { MemberSwitcher } from '@/components/home/member-switcher'
import { ECVSections } from '@/components/home/ecv-sections'

// Variant 3 — Predominantly ORANGE with black and white accents. Punchy and warm.
export function Variant3({ member }: { member: TeamMember }) {
  const { setActiveMemberId } = useTeam()

  const contacts = [
    { icon: <Mail className="h-4 w-4" />, value: member.contacts.email },
    { icon: <Phone className="h-4 w-4" />, value: member.contacts.phone },
    { icon: <Globe className="h-4 w-4" />, value: member.contacts.website },
    { icon: <MapPin className="h-4 w-4" />, value: member.contacts.location },
  ]

  return (
    <div className="bg-brand-orange text-brand-black">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <button
          type="button"
          onClick={() => setActiveMemberId(null)}
          className="mb-8 inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wide text-brand-black/70 hover:text-brand-white"
        >
          <ArrowLeft className="h-4 w-4" /> Meet the team
        </button>

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-stretch">
          <div className="flex flex-col justify-between">
            <div>
              <span className="inline-block bg-brand-black px-3 py-1 font-display text-xs font-bold uppercase tracking-wide text-brand-orange">
                {member.role}
              </span>
              <h1 className="mt-4 font-display text-6xl font-black uppercase leading-[0.88] tracking-tight text-balance text-brand-black sm:text-8xl">
                {member.firstName} {member.lastName}
              </h1>
              <p className="mt-6 max-w-md text-pretty text-lg font-medium leading-relaxed text-brand-black/80">
                {member.tagline}
              </p>
              <p className="mt-3 max-w-md text-pretty leading-relaxed text-brand-black/70">
                {member.bio}
              </p>
            </div>

            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {contacts.map((c) => (
                <li
                  key={c.value}
                  className="flex items-center gap-2 border-b-2 border-brand-black/20 py-2 text-sm font-medium text-brand-black"
                >
                  <span>{c.icon}</span>
                  <span className="truncate">{c.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border-4 border-brand-black bg-brand-white">
            <Image
              src={member.profilePicture || '/placeholder.svg'}
              alt={`${member.firstName} ${member.lastName}`}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <span className="absolute bottom-0 left-0 right-0 bg-brand-white px-4 py-3 font-display text-sm font-black uppercase tracking-wide text-brand-black">
              {member.firstName} {member.lastName}
            </span>
          </div>
        </div>

        <ECVSections member={member} tone="orange" />

        <div className="mt-16 border-t-2 border-brand-black/20 pt-8">
          <MemberSwitcher tone="onOrange" />
        </div>
      </div>
    </div>
  )
}
