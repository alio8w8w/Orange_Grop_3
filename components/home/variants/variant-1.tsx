'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, GraduationCap, Code, Instagram, Linkedin, Github } from 'lucide-react'
import { useTeam } from '@/components/team-context'
import { supabase } from '@/lib/supabase/client'
// TODO: Importă hook-ul tău de i18n (ex: next-intl)
import { useTranslations } from 'next-intl' 

// Tipizare bazată pe structura tabelei cvs
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
  experienta: any[]
  educatie: any[]
  skills: string[]
  portofoliu: any[]
  social_links: {
    instagram?: string
    linkedin?: string
    github?: string
  }
}

export function Variant1() {
  const { setActiveMemberId } = useTeam()
  const [cvData, setCvData] = useState<SupabaseCV | null>(null)
  const [seIncarca, setSeIncarca] = useState(true)
  
  // Inițializăm funcția de traducere (indicând obiectul "Variant1" din JSON)
  const t = useTranslations('Variant1')

  // Extragem profilul exact pentru "Ilina" din Supabase
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
      <div className="flex min-h-screen items-center justify-center bg-[#F4EBE1]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#F26522] border-t-transparent"></div>
      </div>
    )
  }

  if (!cvData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F4EBE1] text-[#0B2B26]">
        <p className="text-2xl font-bold">{t('profileNotFound')}</p>
        <button onClick={() => setActiveMemberId(null)} className="mt-4 text-[#F26522] underline">
          {t('backToTeam')}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4EBE1] text-[#0B2B26] selection:bg-[#F26522] selection:text-white pb-20">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        
        {/* Buton Înapoi */}
        <button
          type="button"
          onClick={() => setActiveMemberId(null)}
          className="mb-8 inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-widest text-[#0B2B26]/60 transition-colors hover:text-[#F26522]"
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
              {/* Notă: Datele care vin din baza de date vor fi afișate în limba în care au fost salvate (probabil Română) */}
              <p className="mt-4 max-w-md text-lg leading-relaxed text-[#0B2B26]/80 font-medium">
                {cvData.biografie || cvData.descriere || t('defaultBio')}
              </p>
            </div>
          </div>

          {/* Poza din Supabase cu stilizare */}
          <div className="relative w-full max-w-md mx-auto lg:ml-auto">
            <div className="absolute -inset-4 z-0 rounded-full bg-[#F26522] blur-3xl opacity-20"></div>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] border-8 border-white shadow-2xl">
              <Image
                src={cvData.poza_url || '/placeholder.svg'}
                alt={`${cvData.nume} ${cvData.prenume}`}
                fill
                priority
                className="object-cover"
              />
              {/* Overlay Text pe poză */}
              <div className="absolute bottom-6 right-6 rotate-[-5deg]">
                <p className="font-display text-3xl font-black text-white drop-shadow-lg">
                  {t('overlay1')}<br/>{t('overlay2')}<br/>{t('overlay3')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BANDA ÎNCHISĂ PENTRU SKILLS */}
        <div className="mt-16 rounded-3xl bg-[#0B2B26] p-8 text-white shadow-xl sm:p-12">
          <div className="flex flex-wrap items-center justify-between gap-8 md:grid md:grid-cols-4 md:gap-4">
            {cvData.skills && cvData.skills.length > 0 ? (
              cvData.skills.slice(0, 4).map((skill, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F26522]">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-bold text-lg leading-tight">{skill.replace('[Soft] ', '').replace('[Hard] ', '')}</span>
                </div>
              ))
            ) : (
              <p className="text-white/60">{t('skillsMissing')}</p>
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
                  <div key={edu.id} className="rounded-2xl border-2 border-[#0B2B26]/10 bg-white p-6 shadow-sm">
                    <p className="text-sm font-bold text-[#F26522]">{edu.an_inceput} - {edu.an_sfarsit}</p>
                    <h4 className="mt-1 text-xl font-bold uppercase">{edu.institutie}</h4>
                    <p className="mt-2 text-[#0B2B26]/70">{edu.specialitate}</p>
                  </div>
                ))
              ) : (
                <p className="text-[#0B2B26]/60">{t('educationMissing')}</p>
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
                  <div key={exp.id} className="rounded-2xl bg-[#0B2B26] p-6 text-white shadow-md">
                    <p className="text-sm font-bold text-[#F26522]">{exp.perioada || t('present')}</p>
                    <h4 className="mt-1 text-xl font-bold uppercase">{exp.functie}</h4>
                    <p className="mt-2 text-white/70">{exp.companie}</p>
                  </div>
                ))
              ) : (
                <p className="text-[#0B2B26]/60">{t('experienceMissing')}</p>
              )}
            </div>
          </div>
        </div>

        {/* SECȚIUNEA CONTACT */}
        <div className="mt-20 overflow-hidden rounded-[2rem] bg-[#F26522] text-white">
          <div className="grid md:grid-cols-2">
            <div className="p-10 sm:p-14">
              <h2 className="font-display text-5xl font-black uppercase tracking-tighter">
                {t('letsWork')} <br /> {t('together')}
              </h2>
              <p className="mt-4 max-w-sm text-white/90">
                {t('contactDesc')}
              </p>
              
              {/* Linkuri Sociale din JSONB */}
              <div className="mt-8 flex gap-4">
                {cvData.social_links?.instagram && (
                  <a href={cvData.social_links.instagram} target="_blank" rel="noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#F26522] hover:scale-110 transition-transform">
                    <Instagram size={24} />
                  </a>
                )}
                {cvData.social_links?.linkedin && (
                  <a href={cvData.social_links.linkedin} target="_blank" rel="noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#F26522] hover:scale-110 transition-transform">
                    <Linkedin size={24} />
                  </a>
                )}
              </div>
            </div>
            
            <div className="bg-[#E05316] p-10 sm:p-14 flex flex-col justify-center gap-6">
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
    <div className="flex items-center gap-4 text-xl font-medium">
      <div className="text-white/70">{icon}</div>
      <span>{text}</span>
    </div>
  )
}