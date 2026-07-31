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

interface Variant1Props {
  member?: any
}

export function Variant1({ member }: Variant1Props) {
  const { setActiveMemberId } = useTeam()
  const [cvData, setCvData] = useState<SupabaseCV | null>(member || null)
  const [seIncarca, setSeIncarca] = useState(!member)
  
  const t = useTranslations('Variant1')

  useEffect(() => {
    if (member) {
      setCvData(member)
      setSeIncarca(false)
      return
    }

    async function fetchIlinaProfile() {
      try {
        const { data, error } = await supabase
          .from('cvs')
          .select('*')
          .ilike('nume', '%ilina%')
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
  }, [member])

  if (seIncarca) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#E44FOA] border-t-transparent"></div>
      </div>
    )
  }

  if (!cvData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <p className="text-2xl font-bold">{t('profileNotFound')}</p>
        <button onClick={() => setActiveMemberId(null)} className="mt-4 text-[#E44FOA] underline">
          {t('backToTeam')}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-[#FCF5AF] selection:bg-[#E44FOA] selection:text-white pb-20 overflow-x-hidden">
      
      {/* HERO SECTION CU POZA DE FUNDAL ȘI SPAȚIU PENTRU BARA DE NAVIGARE */}
      <div className="relative w-full min-h-[600px] flex flex-col justify-between pt-32 pb-16 px-6 sm:px-12 bg-cover bg-center border-b border-[#0B4B8B]/40" style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.95)), url('/images/varianta1.png')` }}>
        
        <div className="mx-auto max-w-6xl w-full">
          {/* Buton Înapoi */}
          <button
            type="button"
            onClick={() => setActiveMemberId(null)}
            className="mb-8 inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-widest text-[#FCF5AF]/70 transition-colors hover:text-[#E44FOA]"
          >
            <ArrowLeft className="h-5 w-5" /> {t('backToTeam')}
          </button>

          {/* PORTFOLIO TITLU CU ANIMAȚIE DE COBORÂRE ȘI SCHIMBARE DE CULOARE DIN PALETĂ */}
          <div className="text-center my-12 animate-fadeInDown">
            <h1 className="font-display text-6xl sm:text-8xl lg:text-9xl font-black uppercase tracking-wider transition-colors duration-700 animate-pulse text-[#FOA533]">
              PORTFOLIO
            </h1>
          </div>
        </div>
      </div>

      {/* CONTINUT PRINCIPAL */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 transition-all duration-500 ease-in-out">
        
        {/* SECȚIUNEA PROFIL & CALL ME ILINA */}
        <div className="relative rounded-[3rem] bg-[#FCF5AF] text-[#000000] p-8 sm:p-14 shadow-2xl border-4 border-[#0B4B8B]">
          
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            
            {/* FRAME CU POZA DIN SUPABASE ȘI ETICHETĂ "THAT'S ME!" */}
            <div className="relative flex justify-center">
              <div className="absolute -top-6 -left-6 z-10 rotate-[-12deg] bg-[#BA011A] text-white px-4 py-2 rounded-2xl font-bold shadow-lg animate-bounce">
                THAT&apos;S ME!
              </div>
              <div className="relative h-[380px] w-[380px] sm:h-[420px] sm:w-[420px] rounded-full overflow-hidden border-8 border-white shadow-2xl bg-[#0B4B8B]">
                <Image
                  src={cvData.poza_url || '/placeholder.svg'}
                  alt={`${cvData.nume} ${cvData.prenume}`}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>

            {/* DESCRIERE ȘI TITLU STILIZAT "CALL ME ILINA" */}
            <div className="flex flex-col justify-center">
              <div className="relative inline-block mb-6">
                <h2 className="font-display text-5xl sm:text-6xl font-black uppercase tracking-tight text-[#BA011A] transform rotate-[-2deg]">
                  Call me {cvData.nume}!
                </h2>
                <div className="text-2xl sm:text-3xl font-bold text-[#0B4B8B] mt-2 font-serif italic">
                  Hi!
                </div>
              </div>

              <p className="text-lg sm:text-xl font-medium leading-relaxed text-neutral-800 bg-white/70 p-6 rounded-2xl border border-[#0B4B8B]/20 shadow-inner">
                {cvData.descriere || cvData.biografie || t('defaultBio')}
              </p>

              {cvData.data_nasterii && (
                <div className="mt-4 text-sm font-bold text-[#E44FOA]">
                  Data nașterii: <span className="text-neutral-900">{cvData.data_nasterii}</span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* BANDA PENTRU SKILLS DIN BAZA DE DATE */}
        <div className="mt-16 rounded-[2.5rem] bg-[#111111] border-2 border-[#E44FOA] p-8 sm:p-12 shadow-2xl text-white">
          <h3 className="mb-8 font-display text-3xl font-black uppercase tracking-tight text-[#FOA533] flex items-center gap-3">
            <Award className="text-[#BA011A]" /> Competențe / Skills
          </h3>
          
          <div className="flex flex-wrap gap-4">
            {cvData.skills && cvData.skills.length > 0 ? (
              cvData.skills.map((skill, idx) => {
                const colors = ['bg-[#FCF5AF] text-black', 'bg-[#FOA533] text-black', 'bg-[#E44FOA] text-white', 'bg-[#0B4B8B] text-white', 'bg-[#BA011A] text-white'];
                const badgeColor = colors[idx % colors.length];

                return (
                  <div key={idx} className={`px-6 py-3 rounded-full font-bold text-base shadow-lg border border-white/25 transition-transform hover:scale-105 ${badgeColor}`}>
                    {typeof skill === 'string' ? skill.replace('[Soft] ', '').replace('[Hard] ', '') : JSON.stringify(skill)}
                  </div>
                )
              })
            ) : (
              <p className="text-neutral-400">{t('skillsMissing')}</p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}