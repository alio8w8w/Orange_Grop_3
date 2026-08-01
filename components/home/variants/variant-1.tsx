'use client'

import React from 'react'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Calendar, 
  Car, 
  Link as LinkIcon, 
  FileText 
} from 'lucide-react'
import { useTeam } from '@/components/team-context'
import { MemberSwitcher } from '@/components/home/member-switcher'
import { ECVSections } from '@/components/home/ecv-sections'

// Variant 1 — Predominantly WHITE with black and orange accents. Clean editorial.
export function Variant1({ member }: { member: any }) {
  const { setActiveMemberId } = useTeam()

  if (!member) return null

  // --- Maparea câmpurilor din baza de date ---
  const firstName = member.prenume || member.firstName || ''
  const lastName = member.nume || member.lastName || ''
  const role = member.functie || member.role || ''
  const profilePic = member.poza_url || member.profilePicture || '/placeholder.svg'
  
  // Texte principale
  const tagline = member.descriere || member.tagline || ''
  const bio = member.biografie || member.bio || ''
  const coverLetter = member.scrisoare_intentie || ''

  // Date de contact și informații personale
  const email = member.email || member.contacts?.email || ''
  const phone = member.telefon || member.contacts?.phone || ''
  const location = member.localitate || member.contacts?.location || ''
  const dateOfBirth = member.data_nasterii || ''
  
  // Arrays & JSONs
  const drivingLicenses = Array.isArray(member.permis_conducere) ? member.permis_conducere.join(', ') : ''
  const socialLinks = member.social_links || {}

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

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          {/* Imagine Profil */}
          <div className="relative sticky top-8">
            <span className="absolute -left-3 -top-3 h-full w-full rounded-lg border-4 border-brand-orange" />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg border-4 border-brand-black bg-brand-cream">
              <Image
                src={profilePic}
                alt={`${firstName} ${lastName}`}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Detalii Principale */}
          <div>
            {role && (
              <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-brand-orange">
                {role}
              </p>
            )}
            
            <h1 className="mt-3 font-display text-6xl font-black uppercase leading-[0.9] tracking-tight text-balance sm:text-7xl">
              {firstName}
              <br />
              {lastName}
            </h1>
            
            {tagline && (
              <p className="mt-5 max-w-md text-pretty text-lg font-medium leading-relaxed text-brand-black/90">
                {tagline}
              </p>
            )}
            
            {bio && (
              <p className="mt-3 max-w-md text-pretty leading-relaxed text-brand-black/70">
                {bio}
              </p>
            )}

            {/* Scrisoare de intenție */}
            {coverLetter && (
              <div className="mt-6 rounded-r-lg border-l-4 border-brand-orange bg-brand-black/5 p-4">
                <div className="mb-2 flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wide text-brand-black/60">
                  <FileText className="h-4 w-4" /> Cover Letter / Scrisoare de intenție
                </div>
                <p className="text-sm italic text-brand-black/80 leading-relaxed">
                  "{coverLetter}"
                </p>
              </div>
            )}

            {/* Informații Contact & Personale */}
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              <ContactItem icon={<Mail className="h-4 w-4" />} value={email} />
              <ContactItem icon={<Phone className="h-4 w-4" />} value={phone} />
              <ContactItem icon={<MapPin className="h-4 w-4" />} value={location} />
              <ContactItem icon={<Calendar className="h-4 w-4" />} value={dateOfBirth} />
              <ContactItem icon={<Car className="h-4 w-4" />} value={drivingLicenses} />
              
              {/* Afișare linkuri sociale din JSON (ex: Instagram, TikTok, LinkedIn) */}
              {Object.entries(socialLinks).map(([platform, url]) => (
                <ContactItem 
                  key={platform} 
                  icon={<LinkIcon className="h-4 w-4" />} 
                  value={platform.charAt(0).toUpperCase() + platform.slice(1)} 
                  href={url as string}
                />
              ))}
            </ul>
          </div>
        </div>

        {/* 
          ECVSections va prelua automat restul câmpurilor complexe din `member`:
          experienta, educatie, limbi, skills, portofoliu, documente
        */}
        <div className="mt-16">
          <ECVSections member={member} tone="light" />
        </div>

        <div className="mt-16 border-t border-brand-black/10 pt-8">
          <MemberSwitcher tone="onLight" />
        </div>
      </div>
    </div>
  )
}

function ContactItem({ 
  icon, 
  value,
  href 
}: { 
  icon: React.ReactNode; 
  value: string;
  href?: string;
}) {
  if (!value) return null

  const content = (
    <>
      <span className="text-brand-orange shrink-0">{icon}</span>
      <span className="truncate text-sm font-medium text-brand-black/80">{value}</span>
    </>
  )

  if (href) {
    return (
      <li className="flex items-center">
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex w-full items-center gap-3 rounded-md border border-brand-black/10 bg-brand-cream px-3 py-2.5 transition-colors hover:border-brand-orange hover:bg-brand-orange/5"
        >
          {content}
        </a>
      </li>
    )
  }

  return (
    <li className="flex items-center gap-3 rounded-md border border-brand-black/10 bg-brand-cream px-3 py-2.5">
      {content}
    </li>
  )
}