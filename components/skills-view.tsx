'use client'

import Image from 'next/image'
import { useTeam } from '@/components/team-context'
import { MemberSwitcher } from '@/components/home/member-switcher'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase/client'

interface SkillItem {
  name: string
  category: string
  level: number
}

export function SkillsView() {
  const { activeMember, members } = useTeam()
  const member = activeMember ?? members[0]
  const t = useTranslations('SkillsView')

  if (!member) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-brand-white/60">
        {t('loading')}
      </div>
    )
  }

  // Funcție pentru generarea URL-ului public din Supabase Storage (bucket-ul cv_poze)
  const getPublicImageUrl = (pathOrUrl: string) => {
    if (!pathOrUrl) return '/placeholder.svg'
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
      return pathOrUrl
    }
    const { data } = supabase.storage.from('cv_poze').getPublicUrl(pathOrUrl)
    return data.publicUrl || '/placeholder.svg'
  }

  // Preluăm datele membrului în siguranță (indiferent dacă sunt în RO sau EN)
  const firstName = member.firstName || member.nume || ''
  const lastName = member.lastName || member.prenume || ''
  const role = member.role || member.functie || ''
  const rawPic = member.profilePicture || member.poza_url || ''
  const profilePic = getPublicImageUrl(rawPic)

  // Extragem skills-urile din baza de date cu tipizare sigură
  const rawSkills = (member.skills || []) as any[]
  
  // Transformăm skills-urile în format standardizat { name, category, level }
  const skillsList: SkillItem[] = rawSkills.map((skill: any, index: number) => {
    if (typeof skill === 'string') {
      const cleanName = skill.replace('[Soft] ', '').replace('[Hard] ', '')
      const category = skill.includes('[Soft]') ? t('softSkills') : t('hardSkills')
      return {
        name: cleanName,
        category: category,
        level: 85 + (index % 15)
      }
    }
    return {
      name: skill.name || skill.nume || `Skill ${index + 1}`,
      category: skill.category || t('generalSkills'),
      level: skill.level || 80
    }
  })

  // Grupăm competențele după categorie cu tipuri explicite
  const grouped = skillsList.reduce((acc: Record<string, SkillItem[]>, skill: SkillItem) => {
    ;(acc[skill.category] ??= []).push(skill)
    return acc
  }, {})

  return (
    <div className="mx-auto max-w-6xl px-4 pt-28 pb-10 sm:px-6 sm:pt-32 sm:py-14">
      {!activeMember && (
        <p className="mb-6 rounded-md border border-brand-orange/40 bg-brand-orange/10 px-4 py-2 text-sm text-brand-white/70">
          {t('defaultNotice')}
        </p>
      )}

      <div className="flex flex-col gap-6 border-b border-brand-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 border-brand-white/20">
            <Image
              src={profilePic}
              alt={`${firstName} ${lastName}`}
              fill
              sizes="64px"
              className="object-cover"
            />
          </span>
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">
              {t('personalSkills')}
            </p>
            <h1 className="font-display text-3xl font-black uppercase tracking-tight text-brand-white sm:text-4xl">
              {firstName} {lastName}
            </h1>
            <p className="text-sm text-brand-white/60">{role}</p>
          </div>
        </div>
        <MemberSwitcher tone="onDark" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {Object.entries(grouped).map(([category, skills]) => (
          <section key={category}>
            <h2 className="mb-4 flex items-center gap-3 font-display text-sm font-extrabold uppercase tracking-wide text-brand-white">
              <span className="h-2 w-2 rotate-45 bg-brand-orange" />
              {category}
            </h2>
            <ul className="space-y-5">
              {skills.map((skill: SkillItem, idx: number) => (
                <li key={`${skill.name}-${idx}`}>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <span className="font-medium text-brand-white">
                      {skill.name}
                    </span>
                    <span className="font-display text-sm font-bold text-brand-white/50">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-brand-white/10">
                    <div
                      className="h-full rounded-full bg-brand-orange transition-all"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}