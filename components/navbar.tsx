'use client'

import { useTeam, type ViewKey } from '@/components/team-context'
import { cn } from '@/lib/utils'

const LINKS: { key: ViewKey; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'skills', label: 'Skills' },
  { key: 'portfolio', label: 'Portfolio' },
]

export function Navbar() {
  const { view, setView, activeMember } = useTeam()

  return (
    <header className="sticky top-0 z-50 border-b border-brand-black/10 bg-brand-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <button
          type="button"
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-left"
        >
          <span className="flex h-8 w-8 items-center justify-center bg-brand-orange font-display text-lg font-black text-brand-black">
            O
          </span>
          <span className="font-display text-base font-extrabold uppercase tracking-tight text-brand-black">
            Orange<span className="text-brand-orange">/</span>Group 3
          </span>
        </button>

        <ul className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((link) => {
            const isActive = view === link.key
            return (
              <li key={link.key}>
                <button
                  type="button"
                  onClick={() => setView(link.key)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'relative px-3 py-2 font-display text-sm font-bold uppercase tracking-wide transition-colors sm:px-4',
                    isActive
                      ? 'text-brand-black'
                      : 'text-brand-black/50 hover:text-brand-black',
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

        <div className="hidden min-w-[7rem] justify-end sm:flex">
          {activeMember ? (
            <span className="truncate font-sans text-sm text-brand-black/60">
              {activeMember.firstName} {activeMember.lastName}
            </span>
          ) : (
            <span className="font-sans text-sm text-brand-black/30">
              No member
            </span>
          )}
        </div>
      </nav>
    </header>
  )
}
