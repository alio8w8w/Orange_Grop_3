'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { supabase, STORAGE_BUCKETS } from '../../../lib/supabase'

interface Member {
  id: string | number
  name?: string
  nume?: string
  titlu?: string
  email?: string
  poza_url?: string
  image?: string
  poza?: string
  avatar_url?: string
  img?: string
  photo?: string
}

export default function ContactSection() {
  const t = useTranslations('Contact')
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMembers() {
      try {
        const { data, error } = await supabase.from('cvs').select('*')
        if (error) {
          setFetchError(error.message)
        } else if (data) {
          setMembers(data)
        }
      } catch (err: any) {
        setFetchError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchMembers()
  }, [])

  // Preia corect poza din coloana 'poza_url' sau alte variante posibile
  const getAvatarUrl = (member: Member): string | null => {
    const rawPath = member.poza_url || member.poza || member.image || member.avatar_url || member.img || member.photo
    if (!rawPath) return null

    if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
      return rawPath
    }

    const cleanPath = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath
    const { data } = supabase.storage
      .from(STORAGE_BUCKETS.poze)
      .getPublicUrl(cleanPath)

    return data.publicUrl
  }

  return (
    <section id="contact" className="relative py-20 sm:py-28 lg:py-32 bg-transparent overflow-visible">
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glowPulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        .animate-glow-1 { animation: glowPulse 5s ease-in-out infinite; }
        .animate-glow-2 { animation: glowPulse 7s ease-in-out infinite 1.5s; }
        .animate-glow-3 { animation: glowPulse 6s ease-in-out infinite 3s; }
      `}} />

      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-12 left-8 w-80 h-80 sm:w-[450px] sm:h-[450px] bg-brand-orange/25 rounded-full blur-[120px] animate-glow-1" />
        <div className="absolute top-1/2 -translate-y-1/2 right-10 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-brand-orange/20 rounded-full blur-[140px] animate-glow-2" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 sm:w-[400px] sm:h-[400px] bg-brand-orange/15 rounded-full blur-[110px] animate-glow-3" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12">
          
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-brand-white">
              <span className="text-brand-white">Scrie unui </span>
              <span className="text-brand-orange drop-shadow-[0_0_25px_rgba(255,107,0,0.5)]">
                specialist
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-brand-white/70 max-w-xl leading-relaxed">
              {t('descriere')}
            </p>
          </div>

          <div className="w-full lg:w-1/2">
            {loading ? (
              <div className="text-center text-brand-white/60 text-base py-8">{t('seIncarca')}</div>
            ) : fetchError ? (
              <div className="text-center text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                {t('eroare')}: {fetchError}
              </div>
            ) : members.length === 0 ? (
              <p className="text-center text-brand-white/60 text-base py-8">{t('niciunSpecialist')}</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full">
                {members.map((member, index) => {
                  const name = member.name || member.nume || member.titlu || `Specialist ${index + 1}`
                  const email = member.email || 'contact@example.com'
                  const avatarUrl = getAvatarUrl(member)

                  return (
                    <a
                      key={member.id || index}
                      href={`mailto:${email}`}
                      className="group flex flex-col items-center text-center p-4 rounded-2xl bg-brand-white/[0.04] border border-brand-white/10 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-brand-orange hover:bg-brand-white/[0.06] hover:shadow-[0_0_25px_rgba(255,107,0,0.5)] cursor-pointer"
                    >
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-brand-orange/50 group-hover:border-brand-orange transition-all duration-300 shadow-md bg-brand-white/10 flex items-center justify-center">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <span className="text-[10px] text-brand-white/50 text-center px-1">Fără poză</span>
                        )}
                      </div>

                      <span className="mt-3 font-display text-xs sm:text-sm font-bold uppercase text-brand-white group-hover:text-brand-orange transition-colors line-clamp-1">
                        {name}
                      </span>

                      <span className="text-[10px] sm:text-xs text-brand-white/60 truncate w-full mt-0.5">
                        {email}
                      </span>
                    </a>
                  )
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  )
}