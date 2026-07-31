'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, GraduationCap, Code, Globe, FileText, Award } from 'lucide-react'
import { useTeam } from '@/components/team-context'
import { supabase } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl' 

interface SupabaseCV {
  id: string
  nume: string
  prenume: string
  telefon: string
  email: string
  localitate: string
  poza_url: string
  data_nasterii: string
  functie: string
  biografie: string
  descriere: string
  scrisoare_intentie?: string
  permis_conducere?: string[]
  experienta: any[]
  educatie: any[]
  limbi: any[]
  skills: string[]
  portofoliu: any[]
  documente: any[]
  social_links: {
    facebook?: string
    instagram?: string
    linkedin?: string
    tiktok?: string
  }
}

export function Variant1() {
  const { setActiveMemberId } = useTeam()
  const [cvData, setCvData] = useState<SupabaseCV | null>(null)
  const [seIncarca, setSeIncarca] = useState(true)
  
  const t = useTranslations('Variant1')

  useEffect(() => {
    async function fetchIlinaProfile() {
      try {
        const { data, error } = await supabase
          .from('cvs')
          .select('*')
          .eq('nume', 'Ilina')
          .single()

        if (error) throw error
        setCvData(data)
      } catch (error) {
        console.error("Eroare la extragerea datelor pentru Ilina:", error)
      } finally {
        setSeIncarca(false)
      }
    }

    fetchIlinaProfile()
  }, [])

  if (seIncarca) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#F26522] border-t-transparent"></div>
      </div>
    )
  }

  if (!cvData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <p className="text-2xl font-bold">{t('profileNotFound')}</p>
        <button onClick={() => setActiveMemberId(null)} className="mt-4 text-[#F26522] underline">
          {t('backToTeam')}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#F26522] selection:text-white pb-20">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        
        {/* Buton Înapoi */}
        <button
          type="button"
          onClick={() => setActiveMemberId(null)}
          className="mb-8 inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-widest text-neutral-400 transition-colors hover:text-[#F26522]"
        >
          <ArrowLeft className="h-5 w-5" /> {t('backToTeam')}
        </button>

        {/* SECȚIUNEA HERO */}
        <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div className="relative z-10">
            <p className="font-display text-xl font-bold uppercase tracking-widest text-[#F26522]">
              {cvData.functie || t('defaultRole')}
            </p>
            <h1 className="mt-2 font-display text-7xl font-black uppercase leading-[0.85] tracking-tighter sm:text-[100px] xl:text-[120px]">
              {t('heroWord1')}<br />
              <span className="text-[#F26522]">{t('heroWord2')}</span><br />
              {t('heroWord3')}
            </h1>
            
            <div className="mt-8 border-l-4 border-[#F26522] pl-6">
              <h2 className="text-2xl font-bold uppercase tracking-wide">
                {t('im')} {cvData.nume} {cvData.prenume}
              </h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-neutral-300 font-medium">
                {cvData.biografie || cvData.descriere || t('defaultBio')}
              </p>
              {cvData.data_nasterii && (
                <p className="mt-2 text-sm text-neutral-400">
                  Data nașterii: <span className="text-white font-semibold">{cvData.data_nasterii}</span>
                </p>
              )}
            </div>
          </div>

          {/* Poza din Supabase cu stilizare */}
          <div className="relative w-full max-w-md mx-auto lg:ml-auto">
            <div className="absolute -inset-4 z-0 rounded-full bg-[#F26522] blur-3xl opacity-20"></div>
            <div className="relative aspect-3/4 w-full overflow-hidden rounded-[2rem] border-4 border-neutral-800 shadow-2xl bg-neutral-900">
              <Image
                src={cvData.poza_url || '/placeholder.svg'}
                alt={`${cvData.nume} ${cvData.prenume}`}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute bottom-6 right-6 rotate-[-5deg]">
                <p className="font-display text-3xl font-black text-[#F26522] drop-shadow-lg bg-black/80 px-3 py-1 rounded-lg">
                  {t('overlay1')}<br/>{t('overlay2')}<br/>{t('overlay3')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BANDA PENTRU SKILLS */}
        <div className="mt-16 rounded-3xl bg-neutral-900 border border-neutral-800 p-8 text-white shadow-xl sm:p-12">
          <h3 className="mb-6 font-display text-2xl font-black uppercase tracking-tight text-[#F26522]">
            Competențe / Skills
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {cvData.skills && cvData.skills.length > 0 ? (
              cvData.skills.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-neutral-800/50 p-4 rounded-xl border border-neutral-800">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F26522]">
                    <Code className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-sm leading-tight text-neutral-200">
                    {skill.replace('[Soft] ', '').replace('[Hard] ', '')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-neutral-500">{t('skillsMissing')}</p>
            )}
          </div>
        </div>

        {/* SECȚIUNEA EDUCAȚIE ȘI EXPERIENȚĂ */}
        <div className="mt-16 grid gap-10 md:grid-cols-2">
          {/* Educație */}
          <div>
            <h3 className="mb-6 flex items-center gap-3 font-display text-4xl font-black uppercase tracking-tight">
              <span className="text-[#F26522]"><GraduationCap size={40} /></span> {t('education')}
            </h3>
            <div className="space-y-6">
              {cvData.educatie && cvData.educatie.length > 0 ? (
                cvData.educatie.map((edu: any) => (
                  <div key={edu.id} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-sm">
                    <p className="text-sm font-bold text-[#F26522]">{edu.data_inceput} - {edu.data_sfarsit || 'Prezent'}</p>
                    <h4 className="mt-1 text-xl font-bold uppercase text-white">{edu.institutie}</h4>
                    <p className="mt-2 text-neutral-400">{edu.specializare || edu.specialitate}</p>
                    {edu.descriere && <p className="mt-2 text-sm text-neutral-500">{edu.descriere}</p>}
                  </div>
                ))
              ) : (
                <p className="text-neutral-500">{t('educationMissing')}</p>
              )}
            </div>
          </div>

          {/* Experiență */}
          <div>
            <h3 className="mb-6 flex items-center gap-3 font-display text-4xl font-black uppercase tracking-tight">
              <span className="text-[#F26522]"><Briefcase size={40} /></span> {t('experience')}
            </h3>
            <div className="space-y-6">
              {cvData.experienta && cvData.experienta.length > 0 ? (
                cvData.experienta.map((exp: any) => (
                  <div key={exp.id} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-md">
                    <p className="text-sm font-bold text-[#F26522]">{exp.data_inceput || exp.perioada} - {exp.data_sfarsit || 'Prezent'}</p>
                    <h4 className="mt-1 text-xl font-bold uppercase text-white">{exp.functie}</h4>
                    <p className="mt-2 text-neutral-400">{exp.companie}</p>
                    {exp.descriere && <p className="mt-2 text-sm text-neutral-500">{exp.descriere}</p>}
                  </div>
                ))
              ) : (
                <p className="text-neutral-500">{t('experienceMissing')}</p>
              )}
            </div>
          </div>
        </div>

        {/* SECȚIUNEA PORTOFOLIU & LIMBI */}
        <div className="mt-16 grid gap-10 md:grid-cols-2">
          {/* Portofoliu */}
          <div className="rounded-3xl bg-neutral-900 border border-neutral-800 p-8">
            <h3 className="mb-6 font-display text-3xl font-black uppercase tracking-tight text-[#F26522]">
              Portofoliu Proiecte
            </h3>
            <div className="space-y-4">
              {cvData.portofoliu && cvData.portofoliu.length > 0 ? (
                cvData.portofoliu.map((item: any) => (
                  <div key={item.id} className="p-4 rounded-xl bg-neutral-800/40 border border-neutral-800">
                    <h4 className="font-bold text-lg text-white">{item.titlu}</h4>
                    <p className="text-sm text-neutral-400 mt-1">{item.descriere}</p>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noreferrer" className="inline-block mt-3 text-xs text-[#F26522] underline font-semibold">
                        Vezi proiectul →
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-neutral-500">Niciun proiect adăugat.</p>
              )}
            </div>
          </div>

          {/* Limbi & Informații Suplimentare */}
          <div className="rounded-3xl bg-neutral-900 border border-neutral-800 p-8 flex flex-col justify-between">
            <div>
              <h3 className="mb-6 font-display text-3xl font-black uppercase tracking-tight text-[#F26522]">
                Limbi Străine
              </h3>
              <div className="space-y-3">
                {cvData.limbi && cvData.limbi.length > 0 ? (
                  cvData.limbi.map((l: any) => (
                    <div key={l.id} className="flex justify-between items-center p-3 rounded-lg bg-neutral-800/40 border border-neutral-800">
                      <span className="font-bold text-white flex items-center gap-2"><Globe size={16} className="text-[#F26522]" />{l.limba}</span>
                      <span className="text-xs font-semibold bg-[#F26522] text-white px-2.5 py-1 rounded-full">{l.nivel}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-neutral-500">Nicio limbă specificată.</p>
                )}
              </div>

              {cvData.permis_conducere && cvData.permis_conducere.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-bold uppercase text-neutral-400 mb-2">Permis de conducere</h4>
                  <div className="flex gap-2">
                    {cvData.permis_conducere.map((cat, idx) => (
                      <span key={idx} className="px-3 py-1 bg-neutral-800 text-white rounded-md text-xs font-bold border border-neutral-700">
                        Cat. {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {cvData.scrisoare_intentie && (
              <div className="mt-8 pt-6 border-t border-neutral-800">
                <h4 className="text-sm font-bold uppercase text-[#F26522] mb-2 flex items-center gap-2">
                  <FileText size={16} /> Scrisoare de intenție
                </h4>
                <p className="text-xs text-neutral-400 line-clamp-3">{cvData.scrisoare_intentie}</p>
              </div>
            )}
          </div>
        </div>

        {/* SECȚIUNEA CONTACT */}
        <div className="mt-20 overflow-hidden rounded-[2rem] bg-neutral-900 border border-neutral-800 text-white">
          <div className="grid md:grid-cols-2">
            <div className="p-10 sm:p-14">
              <h2 className="font-display text-5xl font-black uppercase tracking-tighter">
                {t('letsWork')} <br /> <span className="text-[#F26522]">{t('together')}</span>
              </h2>
              <p className="mt-4 max-w-sm text-neutral-400">
                {t('contactDesc')}
              </p>
              
              {/* Linkuri Sociale */}
              <div className="mt-8 flex gap-4">
                {cvData.social_links?.instagram && (
                  <a href={cvData.social_links.instagram} target="_blank" rel="noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 text-[#F26522] hover:scale-110 transition-transform border border-neutral-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                )}
                {cvData.social_links?.linkedin && (
                  <a href={cvData.social_links.linkedin} target="_blank" rel="noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 text-[#F26522] hover:scale-110 transition-transform border border-neutral-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                )}
                {cvData.social_links?.facebook && (
                  <a href={cvData.social_links.facebook} target="_blank" rel="noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 text-[#F26522] hover:scale-110 transition-transform border border-neutral-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </a>
                )}
                {cvData.social_links?.tiktok && (
                  <a href={cvData.social_links.tiktok} target="_blank" rel="noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 text-[#F26522] hover:scale-110 transition-transform border border-neutral-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                  </a>
                )}
              </div>
            </div>
            
            <div className="bg-neutral-950 p-10 sm:p-14 flex flex-col justify-center gap-6 border-t md:border-t-0 md:border-l border-neutral-800">
              <ContactRow icon={<Phone />} text={cvData.telefon} />
              <ContactRow icon={<Mail />} text={cvData.email} />
              <ContactRow icon={<MapPin />} text={cvData.localitate} />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function ContactRow({ icon, text }: { icon: React.ReactNode, text: string }) {
  if (!text) return null;
  return (
    <div className="flex items-center gap-4 text-xl font-medium text-neutral-300">
      <div className="text-[#F26522]">{icon}</div>
      <span>{text}</span>
    </div>
  )
}