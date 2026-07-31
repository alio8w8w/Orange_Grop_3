// components/navbar.tsx (sau calea unde ai componenta Navbar)
'use client'

import { useEffect, useState, useTransition, useRef } from 'react'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useTeam, type ViewKey } from '@/components/team-context'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const t = useTranslations('Navbar')
  const currentLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const { view, setView, setActiveMemberId, activeMember } = useTeam()
  const [scrolled, setScrolled] = useState(false)
  const [totalMembers, setTotalMembers] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const carouselRef = useRef<HTMLDivElement>(null)
  const isWheelingRef = useRef(false)

  // Ordinea actualizată: Biografie este imediat după Acasă
  const LINKS: { key: ViewKey; label: string }[] = [
    { key: 'home', label: t('home') },
    { key: 'biography', label: t('biography') },
    { key: 'skills', label: t('skills') },
    { key: 'portfolio', label: t('portfolio') },
    { key: 'studies', label: t('studies') },
    { key: 'experience', label: t('experience') },
    { key: 'competences', label: t('competences') },
    { key: 'social', label: t('social') },
  ]

  const activeIndexRef = useRef(0)
  activeIndexRef.current = Math.max(
    0,
    LINKS.findIndex((l) => l.key === view)
  )

  const handleLink = (key: ViewKey) => {
    if (key === 'home') {
      setActiveMemberId(null)
      setView('home')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setView(key)
    }
    setMobileMenuOpen(false)
  }

  const handleLinkRef = useRef(handleLink)
  handleLinkRef.current = handleLink

  // Detectare scroll pe pagină pentru activare tranziții
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Căutare număr membri din Supabase
  useEffect(() => {
    async function fetchMemberCount() {
      try {
        const { data, count, error } = await supabase
          .from('cvs')
          .select('*', { count: 'exact' })

        if (error) {
          console.error('[Supabase Error] Politică RLS activă pe cvs:', error.message)
        }

        if (count !== null && count > 0) {
          setTotalMembers(count)
        } else if (data && data.length > 0) {
          setTotalMembers(data.length)
        } else {
          setTotalMembers(0)
        }
      } catch (err) {
        console.error('[Supabase Error]', err)
        setTotalMembers(0)
      }
    }
    fetchMemberCount()
  }, [])

  // Control prin rotița mouse-ului (Wheel) pe semicercul meniului
  useEffect(() => {
    const el = carouselRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (isWheelingRef.current) return

      const currentIdx = activeIndexRef.current

      if (e.deltaY > 0 && currentIdx < LINKS.length - 1) {
        handleLinkRef.current(LINKS[currentIdx + 1].key)
        triggerCooldown()
      } else if (e.deltaY < 0 && currentIdx > 0) {
        handleLinkRef.current(LINKS[currentIdx - 1].key)
        triggerCooldown()
      }
    }

    const triggerCooldown = () => {
      isWheelingRef.current = true
      setTimeout(() => {
        isWheelingRef.current = false
      }, 400)
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', handleWheel)
    }
  }, [LINKS.length])

  // Funcția de schimbare a limbii
  const toggleLanguage = (newLocale: string) => {
    if (newLocale === currentLocale) return

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`

    startTransition(() => {
      const segments = pathname.split('/')
      if (segments[1] === 'ro' || segments[1] === 'en') {
        segments[1] = newLocale
        const newPathname = segments.join('/')
        router.push(newPathname)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-in-out',
          scrolled
            ? 'bg-brand-black/90 backdrop-blur-xl border-b border-brand-white/10 py-2 shadow-2xl'
            : 'bg-transparent py-4'
        )}
      >
        {/* === VERSIUNEA DESKTOP === */}
        <div className="hidden md:flex flex-col items-center justify-start w-full relative px-8 min-h-[75px]">
          
          {/* Tumbler Limbă (Stânga Fixat) */}
          <div className="absolute left-8 top-3 flex items-center rounded-full border border-brand-white/10 bg-brand-black/60 p-1 text-xs font-bold shadow-lg backdrop-blur-md z-30">
            <button
              type="button"
              disabled={isPending}
              onClick={() => toggleLanguage('ro')}
              className={cn(
                'rounded-full px-4 py-1.5 transition-all duration-300',
                currentLocale === 'ro'
                  ? 'bg-brand-orange text-brand-black shadow-md'
                  : 'text-brand-white/50 hover:text-brand-white'
              )}
            >
              RO
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => toggleLanguage('en')}
              className={cn(
                'rounded-full px-4 py-1.5 transition-all duration-300',
                currentLocale === 'en'
                  ? 'bg-brand-orange text-brand-black shadow-md'
                  : 'text-brand-white/50 hover:text-brand-white'
              )}
            >
              EN
            </button>
          </div>

          {/* Status Membri din Baza de Date (Dreapta Fixat) */}
          <div className="absolute right-8 top-3 flex items-center rounded-full border border-brand-white/10 bg-brand-black/60 px-5 py-2 text-sm text-brand-white/70 shadow-lg backdrop-blur-md z-30">
            {activeMember ? (
              <span className="font-bold text-brand-orange">
                {activeMember.firstName} {activeMember.lastName}
              </span>
            ) : (
              <span>
                {totalMembers !== null
                  ? `${totalMembers} ${totalMembers === 1 ? t('member') : t('members')}`
                  : '...'}
              </span>
            )}
          </div>

          {/* LOGO + TEXT: Glisare fluidă la scroll */}
          <button
            type="button"
            onClick={() => handleLink('home')}
            className={cn(
              'flex flex-row items-center gap-3 transition-all duration-500 ease-in-out z-30',
              scrolled
                ? 'absolute left-40 top-2 scale-90'
                : 'relative mt-1 scale-100'
            )}
          >
            <div className="relative h-[60px] w-[60px] overflow-hidden rounded-xl shadow-2xl transition-all duration-500">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={60}
                height={60}
                className="object-contain"
                priority
              />
            </div>
            <span className="font-display text-lg font-extrabold uppercase tracking-widest text-brand-white drop-shadow-md whitespace-nowrap">
              Orange<span className="text-brand-orange">/</span>Group 3
            </span>
          </button>

          {/* MENIUL ÎN SEMICERC */}
          <div
            ref={carouselRef}
            className={cn(
              'relative w-full max-w-4xl cursor-ew-resize flex justify-center items-start transition-all duration-500 ease-in-out',
              scrolled
                ? 'mt-0 h-16 -translate-x-12'
                : 'mt-2 h-20 translate-x-0'
            )}
          >
            {LINKS.map((link, i) => {
              const activeIndex = activeIndexRef.current
              const offset = i - activeIndex
              const absOffset = Math.abs(offset)
              const isCenter = offset === 0

              const RADIUS = 340
              const ANGLE_STEP = 15

              const angleDeg = offset * ANGLE_STEP
              const angleRad = (angleDeg * Math.PI) / 180

              const translateX = RADIUS * Math.sin(angleRad)
              const translateY = RADIUS * (1 - Math.cos(angleRad))
              const rotateDeg = angleDeg

              const scale = Math.max(0.65, 1 - absOffset * 0.1)
              const opacity = Math.max(0, 1 - absOffset * 0.32)
              const zIndex = 50 - absOffset

              return (
                <div
                  key={link.key}
                  className="absolute transition-all duration-500 ease-out flex items-center justify-center top-0 origin-center"
                  style={{
                    transform: `translate(${translateX}px, ${translateY}px) rotate(${rotateDeg}deg) scale(${scale})`,
                    opacity,
                    zIndex,
                    pointerEvents: opacity > 0.2 ? 'auto' : 'none',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleLink(link.key)}
                    className="relative group flex items-center justify-center"
                  >
                    {isCenter && (
                      <div className="absolute inset-0 rounded-full bg-brand-orange/40 blur-lg transition-all duration-500 pointer-events-none scale-125" />
                    )}

                    <div
                      className={cn(
                        'relative z-10 rounded-full px-6 py-2 font-display text-xs font-extrabold uppercase tracking-widest shadow-xl transition-all duration-300 whitespace-nowrap',
                        isCenter
                          ? 'bg-brand-orange text-brand-black scale-105 border border-brand-orange'
                          : 'bg-brand-white/10 text-brand-white border border-brand-white/10 hover:bg-brand-white/20 backdrop-blur-md'
                      )}
                    >
                      {link.label}
                    </div>
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* === VERSIUNEA MOBILĂ === */}
        <div className="flex md:hidden mx-auto max-w-7xl items-center justify-between px-4">
          <button
            type="button"
            onClick={() => handleLink('home')}
            className="flex items-center gap-3"
          >
            <div className="relative h-[44px] w-[44px] overflow-hidden rounded">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={44}
                height={44}
                className="object-contain"
                priority
              />
            </div>
            <span className="font-display text-sm font-extrabold uppercase tracking-widest text-brand-white">
              Orange<span className="text-brand-orange">/</span>3
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg bg-brand-white/5 p-2 text-brand-white border border-brand-white/10"
          >
            <Menu size={28} />
          </button>
        </div>
      </header>

      {/* DRAWER MOBIL */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-brand-black/95 backdrop-blur-3xl px-6 pt-6 pb-12 md:hidden animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-brand-white/10 pb-4 mb-6">
            <div className="relative h-10 w-10 overflow-hidden rounded">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-full bg-brand-white/10 p-2 text-brand-white"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 rounded-full bg-brand-white/5 p-1 mb-8 self-center">
            <button
              type="button"
              onClick={() => toggleLanguage('ro')}
              className={cn(
                'rounded-full px-6 py-2 text-sm font-bold transition-colors',
                currentLocale === 'ro' ? 'bg-brand-orange text-brand-black' : 'text-brand-white/60'
              )}
            >
              RO
            </button>
            <button
              type="button"
              onClick={() => toggleLanguage('en')}
              className={cn(
                'rounded-full px-6 py-2 text-sm font-bold transition-colors',
                currentLocale === 'en' ? 'bg-brand-orange text-brand-black' : 'text-brand-white/60'
              )}
            >
              EN
            </button>
          </div>

          <nav className="flex flex-col gap-3 overflow-y-auto">
            {LINKS.map((link) => {
              const isActive = view === link.key
              return (
                <button
                  key={link.key}
                  type="button"
                  onClick={() => handleLink(link.key)}
                  className={cn(
                    'w-full text-center rounded-2xl py-3.5 font-display text-sm font-extrabold uppercase tracking-widest transition-all',
                    isActive
                      ? 'bg-brand-orange text-brand-black'
                      : 'bg-brand-white/5 text-brand-white/70'
                  )}
                >
                  {link.label}
                </button>
              )
            })}
          </nav>

          <div className="mt-auto pt-6 text-center text-sm text-brand-white/40">
            {totalMembers !== null
              ? `${totalMembers} ${totalMembers === 1 ? t('member') : t('members')}`
              : ''}
          </div>
        </div>
      )}
    </>
  )
}