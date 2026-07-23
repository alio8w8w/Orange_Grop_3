'use client'

import { useEffect, useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useTeam, type ViewKey } from '@/components/team-context'
import { cn } from '@/lib/utils'

export function Navbar() {
  const t = useTranslations('Navbar')
  const currentLocale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const { view, setView, setActiveMemberId, activeMember } = useTeam()
  const [scrolled, setScrolled] = useState(false)

  const LINKS: { key: ViewKey; label: string }[] = [
    { key: 'home', label: t('home') },
    { key: 'skills', label: t('skills') },
    { key: 'portfolio', label: t('portfolio') },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goHome = () => {
    setActiveMemberId(null)
    setView('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLink = (key: ViewKey) => {
    if (key === 'home') {
      goHome()
      return
    }
    setView(key)
  }

  // Schimbarea limbii prin cookie + refresh
  const toggleLanguage = (newLocale: string) => {
    if (newLocale === currentLocale) return
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled
          ? 'border-b border-brand-white/10 bg-brand-black/60 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* LOGO */}
        <button
          type="button"
          onClick={goHome}
          className="flex items-center gap-2 text-left"
        >
          {/* Dimensiuni mărite cu 20% (de la h-8 w-8 la h-[38.4px] w-[38.4px] și intrările Image de la 32 la 38) */}
          <div className="relative h-[38.4px] w-[38.4px] overflow-hidden rounded">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={38}
              height={38}
              className="object-contain"
              priority
            />
          </div>
          <span className="font-display text-base font-extrabold uppercase tracking-tight text-brand-white">
            Orange<span className="text-brand-orange">/</span>Group 3
          </span>
        </button>

        {/* NAVIGATION LINKS */}
        <ul className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((link) => {
            const isActive = view === link.key
            return (
              <li key={link.key}>
                <button
                  type="button"
                  onClick={() => handleLink(link.key)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'relative px-3 py-2 font-display text-sm font-bold uppercase tracking-wide transition-colors sm:px-4',
                    isActive
                      ? 'text-brand-white'
                      : 'text-brand-white/50 hover:text-brand-white',
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute inset-x-2 -bottom-px h-0.5 origin-left bg-brand-orange transition-transform sm:inset-x-3',
                      isActive ? 'scale-x-100' : 'scale-x-0',
                    )}
                  />
                </button>
              </li>
            )
          })}
        </ul>

        {/* RIGHT SECTION: MEMBER INFO + LANGUAGE SWITCHER */}
        <div className="flex items-center gap-4">
          <div className="hidden min-w-[7rem] justify-end sm:flex">
            {activeMember ? (
              <span className="truncate font-sans text-sm text-brand-white/60">
                {activeMember.firstName} {activeMember.lastName}
              </span>
            ) : (
              <span className="font-sans text-sm text-brand-white/25">
                {t('noMember')}
              </span>
            )}
          </div>

          {/* LANGUAGE SWITCHER BUTTONS */}
          <div className="flex items-center rounded-lg border border-brand-white/10 bg-brand-black/40 p-1 text-xs font-bold">
            <button
              type="button"
              disabled={isPending}
              onClick={() => toggleLanguage('ro')}
              className={cn(
                'rounded px-2 py-1 transition-colors',
                currentLocale === 'ro'
                  ? 'bg-brand-orange text-brand-black'
                  : 'text-brand-white/60 hover:text-brand-white',
              )}
            >
              RO
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => toggleLanguage('en')}
              className={cn(
                'rounded px-2 py-1 transition-colors',
                currentLocale === 'en'
                  ? 'bg-brand-orange text-brand-black'
                  : 'text-brand-white/60 hover:text-brand-white',
              )}
            >
              EN
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}