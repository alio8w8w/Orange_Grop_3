'use client'

import Image from 'next/image'
import { ArrowLeft, Mail, Phone, Globe, MapPin } from 'lucide-react'
import type { TeamMember } from '@/lib/team-data'
import { useTeam } from '@/components/team-context'
import { MemberSwitcher } from '@/components/home/member-switcher'

// Variant 1 — Predominantly WHITE with black and orange accents. Clean editorial.
export function Variant1({ member }: { member: TeamMember }) {
  const { setActiveMemberId } = useTeam()

  return (
    <div className="bg-brand-white text-brand-black">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <button
          type="button"
          onClick={() => setActiveMemberId(null)}
          className="mb-8 inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wide text-brand-black/60 hover:text-brand-orange"
        >
          <ArrowLeft className="h-4 w-4" /> Meet the team
        </button>

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative">
            <span className="absolute -left-3 -top-3 -z-0 h-full w-full rounded-lg border-4 border-brand-orange" />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border-4 border-brand-black">
              <Image
                src={member.profilePicture || '/placeholder.svg'}
                alt={`${member.firstName} ${member.lastName}`}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-brand-orange">
              {member.role}
            </p>
            <h1 className="mt-3 font-display text-6xl font-black uppercase leading-[0.9] tracking-tight text-balance sm:text-7xl">
              {member.firstName}
              <br />
              {member.lastName}
            </h1>
            <p className="mt-5 max-w-md text-pretty text-lg leading-relaxed text-brand-black/70">
              {member.tagline}
            </p>
            <p className="mt-3 max-w-md text-pretty leading-relaxed text-brand-black/60">
              {member.bio}
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              <ContactItem icon={<Mail className="h-4 w-4" />} value={member.contacts.email} />
              <ContactItem icon={<Phone className="h-4 w-4" />} value={member.contacts.phone} />
              <ContactItem icon={<Globe className="h-4 w-4" />} value={member.contacts.website} />
              <ContactItem icon={<MapPin className="h-4 w-4" />} value={member.contacts.location} />
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-brand-black/10 pt-8">
          <MemberSwitcher tone="onLight" />
        </div>
      </div>
    </div>
  )
}

function ContactItem({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <li className="flex items-center gap-3 rounded-md border border-brand-black/10 bg-brand-cream px-3 py-2.5">
      <span className="text-brand-orange">{icon}</span>
      <span className="truncate text-sm text-brand-black/80">{value}</span>
    </li>
  )
}
