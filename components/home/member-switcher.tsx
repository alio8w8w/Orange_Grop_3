'use client'

import Image from 'next/image'
import { useTeam } from '@/components/team-context'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { supabase } from '@/lib/supabase/client'

type Tone = 'onLight' | 'onDark' | 'onOrange'

const toneStyles: Record<
  Tone,
  { label: string; idle: string; active: string; ring: string }
> = {
  onLight: {
    label: 'text-brand-black/50',
    idle: 'border-brand-black/15 opacity-55 hover:opacity-100',
    active: 'border-brand-orange opacity-100',
    ring: 'ring-brand-black/10',
  },
  onDark: {
    label: 'text-brand-white/50',
    idle: 'border-brand-white/20 opacity-45 hover:opacity-100',
    active: 'border-brand-orange opacity-100',
    ring: 'ring-brand-white/10',
  },
  onOrange: {
    label: 'text-brand-black/60',
    idle: 'border-brand-black/20 opacity-60 hover:opacity-100',
    active: 'border-brand-black opacity-100',
    ring: 'ring-brand-black/10',
  },
}

export function MemberSwitcher({ tone = 'onLight' }: { tone?: Tone }) {
  const { members, activeMemberId, setActiveMemberId } = useTeam()
  const styles = toneStyles[tone]
  const t = useTranslations('MemberSwitcher')

  // Funcție de generare a URL-ului public din bucket-ul de storage Supabase (cv_poze)
  const getPublicImageUrl = (pathOrUrl: string) => {
    if (!pathOrUrl) return '/placeholder.svg'
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
      return pathOrUrl
    }
    const { data } = supabase.storage.from('cv_poze').getPublicUrl(pathOrUrl)
    return data.publicUrl || '/placeholder.svg'
  }

  return (
    <div className="flex flex-col gap-3">
      <span
        className={cn(
          'font-display text-xs font-bold uppercase tracking-[0.2em]',
          styles.label,
        )}
      >
        {t('switchMember')}
      </span>
      <div className="flex flex-wrap items-center gap-3">
        {members.map((m: any) => {
          const isActive = m.id === activeMemberId
          const firstName = m.firstName || m.prenume || ''
          const lastName = m.lastName || m.nume || ''
          const rawPic = m.profilePicture || m.poza_url || ''
          const profilePic = getPublicImageUrl(rawPic)

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveMemberId(m.id)}
              aria-label={`${t('view')} ${firstName} ${lastName}`}
              aria-pressed={isActive}
              className={cn(
                'relative h-12 w-12 overflow-hidden rounded-full border-2 transition-all shadow-md',
                isActive ? styles.active : styles.idle,
                isActive && 'scale-110',
              )}
            >
              <Image
                src={profilePic}
                alt={`${firstName} ${lastName}`}
                fill
                sizes="48px"
                className="object-cover"
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}