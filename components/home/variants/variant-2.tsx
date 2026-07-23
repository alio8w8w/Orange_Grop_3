'use client'

import Image from 'next/image'
import { ArrowLeft, Mail, Phone, Globe, MapPin } from 'lucide-react'
import type { TeamMember } from '@/lib/team-data'
import { useTeam } from '@/components/team-context'
import { MemberSwitcher } from '@/components/home/member-switcher'
import { ECVSections } from '@/components/home/ecv-sections'

// Variant 2 — Predominantly BLACK with white and orange accents. Bold, cinematic.
export function Variant2({ member }: { member: TeamMember }) {
  const { setActiveMemberId } = useTeam()

  const contacts = [
    { icon: <Mail className="h-4 w-4" />, value: member.contacts.email },
    { icon: <Phone className="h-4 w-4" />, value: member.contacts.phone },
    { icon: <Globe className="h-4 w-4" />, value: member.contacts.website },
    { icon: <MapPin className="h-4 w-4" />, value: member.contacts.location },
  ]

  return (
    <div className="bg-brand-black text-brand-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <button
          type="button"
          onClick={() => setActiveMemberId(null)}
          className="mb-8 inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wide text-brand-white/60 hover:text-brand-orange"
        >
          <ArrowLeft className="h-4 w-4" /> Meet the team
        </button>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-brand-orange">
              {member.role}
            </p>
            <h1 className="mt-3 font-display text-6xl font-black uppercase leading-[0.9] tracking-tight text-balance sm:text-8xl">
              <span className="text-brand-white">{member.firstName}</span>
              <br />
              <span className="text-brand-orange">{member.lastName}</span>
            </h1>
            <p className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-brand-white/80">
              {member.tagline}
            </p>
            <p className="mt-3 max-w-md text-pretty leading-relaxed text-brand-white/55">
              {member.bio}
            </p>

            <ul className="mt-7 flex flex-wrap gap-3">
              {contacts.map((c) => (
                <li
                  key={c.value}
                  className="flex items-center gap-2 rounded-full border border-brand-white/15 px-4 py-2 text-sm text-brand-white/80"
                >
                  <span className="text-brand-orange">{c.icon}</span>
                  {c.value}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <Image
                src={member.profilePicture || '/placeholder.svg'}
                alt={`${member.firstName} ${member.lastName}`}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover grayscale"
              />
              <span className="absolute inset-0 ring-1 ring-inset ring-brand-white/10" />
            </div>
            <span className="absolute -bottom-4 -left-4 bg-brand-orange px-4 py-2 font-display text-sm font-black uppercase tracking-wide text-brand-black">
              {member.contacts.location}
            </span>
          </div>
        </div>

        <ECVSections member={member} tone="dark" />

        <div className="mt-16 border-t border-brand-white/10 pt-8">
          <MemberSwitcher tone="onDark" />
        </div>
      </div>
    </div>
  )
}
