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

export function AppShell() {
  return (
    <TeamProvider>
      <div className="flex min-h-screen flex-col bg-brand-white text-brand-black">
        <Navbar />
        <main className="flex-1">
          <CurrentView />
        </main>
      </div>
    </TeamProvider>
  )
}
