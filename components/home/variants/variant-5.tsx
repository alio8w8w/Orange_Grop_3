'use client'

import Image from 'next/image'
import { ArrowLeft, Mail, Phone, Globe, MapPin } from 'lucide-react'
import type { TeamMember } from '@/lib/team-data'
import { useTeam } from '@/components/team-context'
import { MemberSwitcher } from '@/components/home/member-switcher'
import { ECVSections } from '@/components/home/ecv-sections'

// Variant 5 — MINIMALIST split-screen contrasting black and white, orange accent.
export function Variant5({ member }: { member: TeamMember }) {
  const { setActiveMemberId } = useTeam()

  const contacts = [
    { icon: <Mail className="h-4 w-4" />, value: member.contacts.email },
    { icon: <Phone className="h-4 w-4" />, value: member.contacts.phone },
    { icon: <Globe className="h-4 w-4" />, value: member.contacts.website },
    { icon: <MapPin className="h-4 w-4" />, value: member.contacts.location },
  ]

  return (
    <div className="bg-brand-black text-brand-white">
      <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-2">
        {/* Left — white half */}
        <div className="flex flex-col justify-between bg-brand-white px-4 py-10 text-brand-black sm:px-10">
          <button
            type="button"
            onClick={() => setActiveMemberId(null)}
            className="inline-flex items-center gap-2 self-start font-display text-xs font-bold uppercase tracking-wide text-brand-black/60 hover:text-brand-orange"
          >
            <ArrowLeft className="h-4 w-4" /> Meet the team
          </button>

          <div className="py-10">
            <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-brand-orange">
              {member.role}
            </p>
            <h1 className="mt-3 font-display text-5xl font-black uppercase leading-[0.9] tracking-tight text-balance sm:text-6xl">
              {member.firstName}
              <br />
              {member.lastName}
            </h1>
            <div className="mt-6 h-1 w-16 bg-brand-orange" />
            <p className="mt-6 max-w-sm text-pretty leading-relaxed text-brand-black/65">
              {member.bio}
            </p>
          </div>

          <ul className="grid gap-2">
            {contacts.map((c) => (
              <li
                key={c.value}
                className="flex items-center gap-3 text-sm text-brand-black/70"
              >
                <span className="text-brand-orange">{c.icon}</span>
                <span className="truncate">{c.value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — black half */}
        <div className="relative flex flex-col justify-between bg-brand-black px-4 py-10 text-brand-white sm:px-10">
          <p className="self-end font-display text-xs font-bold uppercase tracking-[0.3em] text-brand-white/40">
            Orange / Group 3
          </p>

          <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-lg">
            <Image
              src={member.profilePicture || '/placeholder.svg'}
              alt={`${member.firstName} ${member.lastName}`}
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="mt-8">
            <p className="max-w-sm text-pretty font-display text-lg font-bold uppercase leading-tight text-brand-white">
              {member.tagline}
            </p>
            <div className="mt-6 border-t border-brand-white/10 pt-6">
              <MemberSwitcher tone="onDark" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-10">
        <ECVSections member={member} tone="dark" />
      </div>
    </div>
  )
}
