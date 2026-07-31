'use client'

import Image from 'next/image'
import { ArrowLeft, Mail, Phone, Globe, MapPin } from 'lucide-react'
import type { TeamMember } from '@/lib/team-data'
import { useTeam } from '@/components/team-context'
import { MemberSwitcher } from '@/components/home/member-switcher'
import { ECVSections } from '@/components/home/ecv-sections'

export function Variant3({ member }: { member: TeamMember }) {
  const { setActiveMemberId } = useTeam()
  const m = member as any

  const contacts = [
    { icon: <Mail className="h-4 w-4" />, value: m?.contacts?.email || m?.email },
    { icon: <Phone className="h-4 w-4" />, value: m?.contacts?.phone || m?.telefon },
    { icon: <Globe className="h-4 w-4" />, value: m?.contacts?.website },
    { icon: <MapPin className="h-4 w-4" />, value: m?.contacts?.location || m?.localitate },
  ].filter(c => c.value)

  const adaptedMember = {
    ...m,
    firstName: m.firstName || m.nume,
    lastName: m.lastName || m.prenume,
    role: m.role || m.functie,
    profilePicture: m.profilePicture || m.poza_url,
    tagline: m.tagline || m.biografie,
    bio: m.bio || m.descriere,
    experience: (m.experienta || []).map((exp: any) => ({
      ...exp,
      years: exp.data_inceput ? `${exp.data_inceput} - ${exp.data_sfarsit || 'Prezent'}` : exp.perioada,
      title: exp.functie || exp.title,
      company: exp.companie || exp.company,
      description: exp.descriere || exp.description,
    })),
    education: (m.educatie || []).map((edu: any) => ({
      ...edu,
      years: edu.data_inceput ? `${edu.data_inceput} - ${edu.data_sfarsit || 'Prezent'}` : `${edu.an_inceput} - ${edu.an_sfarsit}`,
      degree: edu.specializare || edu.specialitate || edu.degree,
      institution: edu.institutie || edu.institution,
      description: edu.descriere || edu.description,
    })),
    skills: m.skills || [],
    portfolio: m.portofoliu || m.portfolio || [],
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Elemente decorative de fundal (buline/textură grilă stil modern) */}
      <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#F26522]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#F26522]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <button
          type="button"
          onClick={() => setActiveMemberId(null)}
          className="mb-8 inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wide text-neutral-400 hover:text-[#F26522] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Meet the team
        </button>

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-stretch">
          <div className="flex flex-col justify-between">
            <div>
              <span className="inline-block bg-neutral-900 border border-neutral-800 px-3 py-1 font-display text-xs font-bold uppercase tracking-wide text-[#F26522] rounded-md shadow-sm">
                {adaptedMember.role}
              </span>
              <h1 className="mt-4 font-display text-6xl font-black uppercase leading-[0.88] tracking-tight text-white sm:text-8xl">
                {adaptedMember.firstName} {adaptedMember.lastName}
              </h1>
              <p className="mt-6 max-w-md text-pretty text-lg font-medium leading-relaxed text-neutral-300">
                {adaptedMember.tagline}
              </p>
              <p className="mt-3 max-w-md text-pretty leading-relaxed text-neutral-400">
                {adaptedMember.bio}
              </p>
            </div>

            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {contacts.map((c, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 border-b-2 border-neutral-800 py-2 text-sm font-medium text-neutral-300"
                >
                  <span className="text-[#F26522]">{c.icon}</span>
                  <span className="truncate">{c.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border-4 border-neutral-800 bg-neutral-900 shadow-2xl">
            <Image
              src={adaptedMember.profilePicture || '/placeholder.svg'}
              alt={`${adaptedMember.firstName} ${adaptedMember.lastName}`}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <span className="absolute bottom-0 left-0 right-0 bg-neutral-950/90 backdrop-blur-md px-4 py-3 font-display text-sm font-black uppercase tracking-wide text-white border-t border-neutral-800">
              {adaptedMember.firstName} {adaptedMember.lastName}
            </span>
          </div>
        </div>

        {/* Folosim tonul dark pentru ECVSections pentru a se potrivi perfect pe fundalul negru */}
        <ECVSections member={adaptedMember} tone="dark" />

        <div className="mt-16 border-t-2 border-neutral-800 pt-8">
          <MemberSwitcher tone="onDark" />
        </div>
      </div>
    </div>
  )
}