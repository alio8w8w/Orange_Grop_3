'use client'

import React from 'react'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Car, 
  Link as LinkIcon, 
  FileText,
  GraduationCap,
  Briefcase,
  Layers,
  Languages,
  Zap // Iconiță pentru Skills
} from 'lucide-react'
import { useTeam } from '@/components/team-context'
import { MemberSwitcher } from '@/components/home/member-switcher'

export function Variant1({ member }: { member: any }) {
  const { setActiveMemberId } = useTeam()

  if (!member) return null

  // --- Date de bază ---
  const firstName = member.prenume || member.firstName || ''
  const lastName = member.nume || member.lastName || ''
  
  // Aici preluăm "CÂMPUL FUNCȚIE" general (ex: Frontend Developer) pentru antet
  const role = member.functie || member.role || ''
  const profilePic = member.poza_url || member.profilePicture || '/placeholder.svg'
  
  const tagline = member.descriere || member.tagline || ''
  const bio = member.biografie || member.bio || ''
  const coverLetter = member.scrisoare_intentie || ''

  const email = member.email || member.contacts?.email || ''
  const phone = member.telefon || member.contacts?.phone || ''
  const location = member.localitate || member.contacts?.location || ''
  const dateOfBirth = member.data_nasterii || ''
  
  const drivingLicenses = Array.isArray(member.permis_conducere) ? member.permis_conducere.join(', ') : ''
  const socialLinks = member.social_links || {}

  // --- Array-uri JSON pentru Toate Secțiunile ---
  const experienta = Array.isArray(member.experienta) ? member.experienta : []
  const educatie = Array.isArray(member.educatie) ? member.educatie : []
  const portofoliu = Array.isArray(member.portofoliu) ? member.portofoliu : []
  const limbi = Array.isArray(member.limbi) ? member.limbi : []
  const skills = Array.isArray(member.skills) ? member.skills : []

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

            {coverLetter && (
              <div className="mt-6 rounded-r-lg border-l-4 border-brand-orange bg-brand-black/5 p-4">
                <div className="mb-2 flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wide text-brand-black/60">
                  <FileText className="h-4 w-4" /> Scrisoare de intenție
                </div>
                <p className="text-sm italic text-brand-black/80 leading-relaxed">
                  "{coverLetter}"
                </p>
              </div>
            )}

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              <ContactItem icon={<Mail className="h-4 w-4" />} value={email} />
              <ContactItem icon={<Phone className="h-4 w-4" />} value={phone} />
              <ContactItem icon={<MapPin className="h-4 w-4" />} value={location} />
              <ContactItem icon={<Calendar className="h-4 w-4" />} value={dateOfBirth} />
              <ContactItem icon={<Car className="h-4 w-4" />} value={drivingLicenses} />
              
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

        {/* --- SECȚIUNEA SKILLS MANUALĂ --- */}
        {skills.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 flex items-center gap-3 font-display text-3xl font-black uppercase tracking-tight text-brand-black">
              <Zap className="h-8 w-8 text-brand-orange" />
              Abilități
            </h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill: string, index: number) => (
                <span key={index} className="inline-flex rounded-full border-2 border-brand-black/10 bg-brand-cream px-4 py-2 text-sm font-bold text-brand-black transition-colors hover:border-brand-orange/50">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* --- SECȚIUNEA EXPERIENȚĂ MANUALĂ --- */}
        {experienta.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 flex items-center gap-3 font-display text-3xl font-black uppercase tracking-tight text-brand-black">
              <Briefcase className="h-8 w-8 text-brand-orange" />
              Experiență Profesională
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {experienta.map((exp: any) => (
                <div key={exp.id} className="flex flex-col justify-between rounded-lg border-2 border-brand-black/10 bg-brand-cream p-5 transition-colors hover:border-brand-orange/50">
                  <div>
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
                      <span className="inline-block rounded bg-brand-orange/10 px-2 py-1 font-display text-xs font-bold uppercase tracking-wider text-brand-orange">
                        {exp.companie}
                      </span>
                      <span className="text-sm font-medium text-brand-black/60 shrink-0">
                        {exp.data_inceput} {exp.data_sfarsit ? `- ${exp.data_sfarsit}` : '- Prezent'}
                      </span>
                    </div>
                    {/* Aici se randează FUNCȚIA din experiență */}
                    <h3 className="text-xl font-bold leading-tight text-brand-black">
                      {exp.functie}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- SECȚIUNEA EDUCAȚIE MANUALĂ --- */}
        {educatie.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 flex items-center gap-3 font-display text-3xl font-black uppercase tracking-tight text-brand-black">
              <GraduationCap className="h-8 w-8 text-brand-orange" />
              Educație
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {educatie.map((edu: any) => (
                <div key={edu.id} className="flex flex-col justify-between rounded-lg border-2 border-brand-black/10 bg-brand-cream p-5 transition-colors hover:border-brand-orange/50">
                  <div>
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <span className="inline-block rounded bg-brand-orange/10 px-2 py-1 font-display text-xs font-bold uppercase tracking-wider text-brand-orange">
                        {edu.nivel}
                      </span>
                      {edu.data_inceput && (
                        <span className="text-sm font-medium text-brand-black/60 shrink-0">
                          {edu.data_inceput}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold leading-tight text-brand-black">
                      {edu.institutie || 'Instituție nespecificată'}
                    </h3>
                    <p className="mt-2 text-brand-black/80">
                      {edu.specializare}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- SECȚIUNEA LIMBI STRĂINE MANUALĂ --- */}
        {limbi.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 flex items-center gap-3 font-display text-3xl font-black uppercase tracking-tight text-brand-black">
              <Languages className="h-8 w-8 text-brand-orange" />
              Limbi Străine
            </h2>
            <div className="flex flex-wrap gap-4">
              {limbi.map((l: any) => (
                <div key={l.id} className="flex items-center gap-4 rounded-lg border-2 border-brand-black/10 bg-brand-cream px-5 py-3 transition-colors hover:border-brand-orange/50">
                  <span className="text-lg font-bold text-brand-black">{l.limba}</span>
                  <span className="rounded bg-brand-orange px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-brand-white">
                    {l.nivel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- SECȚIUNEA PORTOFOLIU MANUALĂ CU IMAGINI --- */}
        {portofoliu.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 flex items-center gap-3 font-display text-3xl font-black uppercase tracking-tight text-brand-black">
              <Layers className="h-8 w-8 text-brand-orange" />
              Portofoliu
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {portofoliu.map((item: any) => {
                const externalUrl = item.url 
                  ? (item.url.startsWith('http') ? item.url : `https://${item.url}`) 
                  : '#';

                return (
                  <div key={item.id} className="group flex flex-col overflow-hidden rounded-lg border-2 border-brand-black/10 bg-brand-cream transition-colors hover:border-brand-orange">
                    {item.imagine_url && (
                      <div className="relative aspect-video w-full overflow-hidden border-b-2 border-brand-black/10">
                        <img 
                          src={item.imagine_url} 
                          alt={item.titlu || 'Proiect portofoliu'} 
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-bold text-brand-black">
                        {item.titlu || 'Proiect'}
                      </h3>
                      {item.descriere && (
                        <p className="mt-2 text-sm text-brand-black/70">
                          {item.descriere}
                        </p>
                      )}
                      {item.url && (
                        <div className="mt-auto pt-4">
                          <a 
                            href={externalUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 text-sm font-bold text-brand-orange hover:underline"
                          >
                            Vezi proiectul <ArrowLeft className="h-4 w-4 rotate-[135deg]" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Am eliminat complet <ECVSections /> pentru a scăpa de dubluri */}

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