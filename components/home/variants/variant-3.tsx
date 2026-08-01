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
  Globe,
  FileText,
  GraduationCap,
  Briefcase,
  Layers,
  Languages,
  Zap 
} from 'lucide-react'
import { useTeam } from '@/components/team-context'
import { MemberSwitcher } from '@/components/home/member-switcher'

export function Variant3({ member }: { member: any }) {
  const { setActiveMemberId } = useTeam()

  if (!member) return null

  // --- Date de bază ---
  const firstName = member.prenume || member.firstName || ''
  const lastName = member.nume || member.lastName || ''
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
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Elemente decorative de fundal (Variant 3 Specifics) */}
      <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#F26522]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#F26522]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        
        {/* Buton Înapoi */}
        <button
          type="button"
          onClick={() => setActiveMemberId(null)}
          className="mb-8 inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wide text-neutral-400 hover:text-[#F26522] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Meet the team
        </button>

        {/* --- HEADER SECȚIUNE --- */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-stretch">
          <div className="flex flex-col justify-between">
            <div>
              {role && (
                <span className="inline-block bg-neutral-900 border border-neutral-800 px-3 py-1 font-display text-xs font-bold uppercase tracking-wide text-[#F26522] rounded-md shadow-sm">
                  {role}
                </span>
              )}
              <h1 className="mt-4 font-display text-6xl font-black uppercase leading-[0.88] tracking-tight text-white sm:text-8xl">
                {firstName} <br/> <span className="text-neutral-500">{lastName}</span>
              </h1>
              {tagline && (
                <p className="mt-6 max-w-md text-pretty text-lg font-medium leading-relaxed text-neutral-300">
                  {tagline}
                </p>
              )}
              {bio && (
                <p className="mt-3 max-w-md text-pretty leading-relaxed text-neutral-400">
                  {bio}
                </p>
              )}
              {coverLetter && (
                <div className="mt-6 rounded-r-lg border-l-4 border-[#F26522] bg-neutral-900/50 p-4">
                  <div className="mb-2 flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wide text-neutral-400">
                    <FileText className="h-4 w-4 text-[#F26522]" /> Scrisoare de intenție
                  </div>
                  <p className="text-sm italic text-neutral-300 leading-relaxed">
                    "{coverLetter}"
                  </p>
                </div>
              )}
            </div>

            {/* Date de Contact și Info Personale */}
            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              <ContactItem icon={<Mail className="h-4 w-4" />} value={email} />
              <ContactItem icon={<Phone className="h-4 w-4" />} value={phone} />
              <ContactItem icon={<MapPin className="h-4 w-4" />} value={location} />
              <ContactItem icon={<Calendar className="h-4 w-4" />} value={dateOfBirth} />
              <ContactItem icon={<Car className="h-4 w-4" />} value={drivingLicenses} />
              
              {/* Rețele Sociale */}
              {Object.entries(socialLinks).map(([platform, url]) => {
                if (!url) return null;
                const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
                const validUrl = (url as string).startsWith('http') ? (url as string) : `https://${url}`;
                
                return (
                  <ContactItem 
                    key={platform} 
                    icon={<LinkIcon className="h-4 w-4" />} 
                    value={platformName} 
                    href={validUrl}
                  />
                )
              })}
            </ul>
          </div>

          {/* Imagine Profil (Stil Variant 3) */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border-4 border-neutral-800 bg-neutral-900 shadow-2xl">
            <Image
              src={profilePic}
              alt={`${firstName} ${lastName}`}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <span className="absolute bottom-0 left-0 right-0 bg-neutral-950/90 backdrop-blur-md px-4 py-4 font-display text-sm font-black uppercase tracking-wide text-white border-t border-neutral-800 text-center">
              {firstName} {lastName}
            </span>
          </div>
        </div>

        {/* --- SECȚIUNEA SKILLS MANUALĂ --- */}
        {skills.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-8 flex items-center gap-3 font-display text-3xl font-black uppercase tracking-tight text-white">
              <Zap className="h-8 w-8 text-[#F26522]" />
              Abilități
            </h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill: string, index: number) => (
                <span key={index} className="inline-flex rounded-full border border-neutral-800 bg-neutral-900 px-5 py-2.5 text-sm font-bold text-neutral-200 shadow-sm transition-colors hover:border-[#F26522] hover:text-white">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* --- SECȚIUNEA EXPERIENȚĂ MANUALĂ --- */}
        {experienta.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-8 flex items-center gap-3 font-display text-3xl font-black uppercase tracking-tight text-white">
              <Briefcase className="h-8 w-8 text-[#F26522]" />
              Experiență Profesională
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {experienta.map((exp: any) => (
                <div key={exp.id} className="group flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 transition-all hover:border-[#F26522] hover:bg-neutral-900">
                  <div>
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                      <span className="inline-block rounded bg-[#F26522]/10 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-[#F26522]">
                        {exp.companie}
                      </span>
                      <span className="text-sm font-medium text-neutral-500 shrink-0">
                        {exp.data_inceput} {exp.data_sfarsit ? `- ${exp.data_sfarsit}` : '- Prezent'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold leading-tight text-white">
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
          <div className="mt-20">
            <h2 className="mb-8 flex items-center gap-3 font-display text-3xl font-black uppercase tracking-tight text-white">
              <GraduationCap className="h-8 w-8 text-[#F26522]" />
              Educație
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {educatie.map((edu: any) => (
                <div key={edu.id} className="flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 transition-all hover:border-[#F26522] hover:bg-neutral-900">
                  <div>
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                      <span className="inline-block rounded bg-[#F26522]/10 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-[#F26522]">
                        {edu.nivel}
                      </span>
                      {edu.data_inceput && (
                        <span className="text-sm font-medium text-neutral-500 shrink-0">
                          {edu.data_inceput}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold leading-tight text-white">
                      {edu.institutie || 'Instituție nespecificată'}
                    </h3>
                    <p className="mt-3 text-neutral-400">
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
          <div className="mt-20">
            <h2 className="mb-8 flex items-center gap-3 font-display text-3xl font-black uppercase tracking-tight text-white">
              <Languages className="h-8 w-8 text-[#F26522]" />
              Limbi Străine
            </h2>
            <div className="flex flex-wrap gap-4">
              {limbi.map((l: any) => (
                <div key={l.id} className="flex items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/50 px-6 py-4 transition-all hover:border-[#F26522] hover:bg-neutral-900">
                  <span className="text-lg font-bold text-white">{l.limba}</span>
                  <span className="rounded bg-[#F26522] px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-white">
                    {l.nivel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- SECȚIUNEA PORTOFOLIU MANUALĂ CU GALERIE (imagini_url) --- */}
        {portofoliu.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-8 flex items-center gap-3 font-display text-3xl font-black uppercase tracking-tight text-white">
              <Layers className="h-8 w-8 text-[#F26522]" />
              Portofoliu
            </h2>
            <div className="grid gap-8 lg:grid-cols-2">
              {portofoliu.map((item: any) => {
                const externalUrl = item.url 
                  ? (item.url.startsWith('http') ? item.url : `https://${item.url}`) 
                  : '#';
                
                // Extragem imaginile; fallback la un array gol dacă nu există
                const imagini = Array.isArray(item.imagini_url) ? item.imagini_url : [];

                return (
                  <div key={item.id} className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 transition-all hover:border-[#F26522]">
                    
                    {/* Galeria de imagini cu scroll orizontal (dacă există imagini) */}
                    {imagini.length > 0 && (
                      <div className="flex w-full snap-x snap-mandatory overflow-x-auto border-b border-neutral-800 pb-2 scrollbar-hide">
                        {imagini.map((imgUrl: string, idx: number) => (
                          <div key={idx} className="relative aspect-video w-full flex-none snap-center">
                            <img 
                              src={imgUrl} 
                              alt={`${item.titlu || 'Proiect'} - imagine ${idx + 1}`} 
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Dacă e o singură imagine salvată ca `imagine_url` (pentru compatibilitate cu date vechi) */}
                    {!imagini.length && item.imagine_url && (
                       <div className="relative aspect-video w-full overflow-hidden border-b border-neutral-800">
                         <img 
                           src={item.imagine_url} 
                           alt={item.titlu || 'Proiect portofoliu'} 
                           className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                         />
                       </div>
                    )}

                    <div className="flex flex-1 flex-col p-6 lg:p-8">
                      <h3 className="text-2xl font-bold text-white">
                        {item.titlu || 'Proiect Fără Titlu'}
                      </h3>
                      {item.descriere && (
                        <p className="mt-3 text-neutral-400 leading-relaxed">
                          {item.descriere}
                        </p>
                      )}
                      
                      {item.url && (
                        <div className="mt-auto pt-6">
                          <a 
                            href={externalUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-[#F26522] hover:text-white transition-colors"
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

        {/* Nu folosim ECVSections, l-am înlocuit complet */}

        <div className="mt-24 border-t-2 border-neutral-800 pt-8">
          <MemberSwitcher tone="onDark" />
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
      <span className="text-[#F26522]">{icon}</span>
      <span className="truncate">{value}</span>
    </>
  )

  if (href) {
    return (
      <li className="flex items-center gap-3 border-b border-neutral-800 py-3 text-sm font-medium text-neutral-300 transition-colors hover:border-[#F26522] hover:text-white">
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex w-full items-center gap-3"
        >
          {content}
        </a>
      </li>
    )
  }

  return (
    <li className="flex items-center gap-3 border-b border-neutral-800 py-3 text-sm font-medium text-neutral-300">
      {content}
    </li>
  )
}