'use client'

import Image from 'next/image'
import { ArrowLeft, Mail, Phone, Globe, MapPin } from 'lucide-react'
import type { TeamMember } from '@/lib/team-data'
import { useTeam } from '@/components/team-context'
import { MemberSwitcher } from '@/components/home/member-switcher'

// Variant 6 — BOLD TYPOGRAPHY with overlapping elements.
export function Variant6({ member }: { member: TeamMember }) {
  const { setActiveMemberId } = useTeam()

  const contacts = [
    { icon: <Mail className="h-4 w-4" />, value: member.contacts.email },
    { icon: <Phone className="h-4 w-4" />, value: member.contacts.phone },
    { icon: <Globe className="h-4 w-4" />, value: member.contacts.website },
    { icon: <MapPin className="h-4 w-4" />, value: member.contacts.location },
  ]

  return (
    <div className="overflow-hidden bg-brand-white text-brand-black">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <button
          type="button"
          onClick={() => setActiveMemberId(null)}
          className="mb-6 inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wide text-brand-black/60 hover:text-brand-orange"
        >
          <ArrowLeft className="h-4 w-4" /> Meet the team
        </button>

        {/* Overlapping oversized type */}
        <div className="relative">
          <h1
            aria-hidden
            className="select-none font-display text-[22vw] font-black uppercase leading-[0.8] tracking-tighter text-brand-black lg:text-[16rem]"
          >
            {member.firstName}
          </h1>
          <h1
            aria-hidden
            className="-mt-[4vw] select-none font-display text-[22vw] font-black uppercase leading-[0.8] tracking-tighter text-brand-orange lg:-mt-10 lg:text-[16rem]"
          >
            {member.lastName}
          </h1>
          <span className="sr-only">
            {member.firstName} {member.lastName}
          </span>

          {/* Overlapping portrait */}
          <div className="pointer-events-none absolute right-0 top-1/2 hidden h-64 w-52 -translate-y-1/2 overflow-hidden rounded-lg border-4 border-brand-black shadow-xl lg:block">
            <Image
              src={member.profilePicture || '/placeholder.svg'}
              alt={`${member.firstName} ${member.lastName}`}
              fill
              priority
              sizes="220px"
              className="object-cover"
            />
          </div>

          {/* Overlapping role tag */}
          <span className="absolute left-2 top-2 rotate-[-4deg] bg-brand-black px-3 py-1 font-display text-xs font-bold uppercase tracking-wide text-brand-orange">
            {member.role}
          </span>
        </div>

        <div className="relative mt-6 grid gap-8 lg:grid-cols-[1fr_1fr]">
          {/* Mobile portrait */}
          <div className="relative aspect-[5/4] w-full overflow-hidden rounded-lg border-4 border-brand-black lg:hidden">
            <Image
              src={member.profilePicture || '/placeholder.svg'}
              alt={`${member.firstName} ${member.lastName}`}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="max-w-md text-pretty font-display text-2xl font-extrabold uppercase leading-tight text-brand-black">
              {member.tagline}
            </p>
            <p className="mt-4 max-w-md text-pretty leading-relaxed text-brand-black/65">
              {member.bio}
            </p>
          </div>

          <ul className="grid gap-2 self-center">
            {contacts.map((c) => (
              <li
                key={c.value}
                className="flex items-center gap-3 border-l-4 border-brand-orange bg-brand-cream px-3 py-2 text-sm text-brand-black/80"
              >
                <span className="text-brand-orange">{c.icon}</span>
                <span className="truncate">{c.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 border-t-2 border-brand-black/15 pt-8">
          <MemberSwitcher tone="onLight" />
        </div>
      </div>
    </div>
  )
}
