'use client'

import { Navbar } from '@/components/navbar'
import { TeamProvider, useTeam } from '@/components/team-context'
import { HomeView } from '@/components/home/home-view'
import { SkillsView } from '@/components/skills-view'
import { PortfolioView } from '@/components/portfolio-view'

function CurrentView() {
  const { view } = useTeam()

  if (view === 'skills') return <SkillsView />
  if (view === 'portfolio') return <PortfolioView />
  return <HomeView />
}

function Main() {
  const { view, activeMember } = useTeam()
  // The Home landing hero sits full-screen behind the transparent navbar.
  // Every other view needs to clear the fixed 4rem navbar.
  const flush = view === 'home' && !activeMember

  return (
    <main className={flush ? 'flex-1' : 'flex-1 pt-16'}>
      <CurrentView />
    </main>
  )
}

export function AppShell() {
  return (
    <TeamProvider>
      <div className="flex min-h-screen flex-col bg-brand-black text-brand-white">
        <Navbar />
        <Main />
      </div>
    </TeamProvider>
  )
}
