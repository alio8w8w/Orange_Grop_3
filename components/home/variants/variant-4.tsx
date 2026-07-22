'use client'

import Image from 'next/image'
import { ArrowLeft, Mail, Phone, Globe, MapPin } from 'lucide-react'
import type { TeamMember } from '@/lib/team-data'
import { useTeam } from '@/components/team-context'
import { MemberSwitcher } from '@/components/home/member-switcher'

// Variant 4 — GEOMETRIC. Layout built from base-color shapes and blocks.
export function Variant4({ member }: { member: TeamMember }) {
  const { setActiveMemberId } = useTeam()

  const contacts = [
    { icon: <Mail className="h-4 w-4" />, value: member.contacts.email },
    { icon: <Phone className="h-4 w-4" />, value: member.contacts.phone },
    { icon: <Globe className="h-4 w-4" />, value: member.contacts.website },
    { icon: <MapPin className="h-4 w-4" />, value: member.contacts.location },
  ]

  return (
    <div className="bg-brand-cream text-brand-black">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <button
          type="button"
          onClick={() => setActiveMemberId(null)}
          className="mb-8 inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wide text-brand-black/60 hover:text-brand-orange"
        >
          <ArrowLeft className="h-4 w-4" /> Meet the team
        </button>

        <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-brand-orange">
          {member.role}
        </p>
        <h1 className="mt-3 font-display text-6xl font-black uppercase leading-[0.9] tracking-tight text-balance sm:text-7xl">
          {member.firstName} {member.lastName}
        </h1>

        {/* Geometric composition grid */}
        <div className="mt-8 grid auto-rows-[130px] grid-cols-2 gap-3 sm:grid-cols-4">
          {/* Portrait block spans 2x2 */}
          <div className="relative col-span-2 row-span-2 overflow-hidden rounded-lg border-4 border-brand-black">
            <Image
              src={member.profilePicture || '/placeholder.svg'}
              alt={`${member.firstName} ${member.lastName}`}
              fill
              priority
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          {/* Solid orange square */}
          <div className="rounded-lg bg-brand-orange" aria-hidden />

          {/* Circle on black */}
          <div className="flex items-center justify-center rounded-lg bg-brand-black" aria-hidden>
            <span className="h-14 w-14 rounded-full bg-brand-orange" />
          </div>

          {/* Triangle */}
          <div className="flex items-center justify-center rounded-lg bg-brand-white" aria-hidden>
            <span
              className="h-0 w-0"
              style={{
                borderLeft: '32px solid transparent',
                borderRight: '32px solid transparent',
                borderBottom: '56px solid var(--brand-black)',
              }}
            />
          </div>

          {/* Tagline block */}
          <div className="flex items-center rounded-lg bg-brand-black p-4">
            <p className="font-display text-sm font-bold uppercase leading-tight text-brand-white">
              {member.tagline}
            </p>
          </div>

          {/* Concentric squares */}
          <div className="flex items-center justify-center rounded-lg border-4 border-brand-orange bg-brand-white" aria-hidden>
            <span className="flex h-14 w-14 items-center justify-center bg-brand-black">
              <span className="h-6 w-6 bg-brand-orange" />
            </span>
          </div>

          {/* Half-circle */}
          <div className="flex items-end justify-center overflow-hidden rounded-lg bg-brand-orange" aria-hidden>
            <span className="h-14 w-28 rounded-t-full bg-brand-black" />
          </div>
        </div>

        <p className="mt-8 max-w-xl text-pretty leading-relaxed text-brand-black/70">
          {member.bio}
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-4">
          {contacts.map((c) => (
            <li
              key={c.value}
              className="flex items-center gap-2 rounded-lg border-2 border-brand-black/15 bg-brand-white px-3 py-2.5 text-sm text-brand-black/80"
            >
              <span className="text-brand-orange">{c.icon}</span>
              <span className="truncate">{c.value}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12 border-t-2 border-brand-black/15 pt-8">
          <MemberSwitcher tone="onLight" />
        </div>
      </div>
    </div>
  )
}
