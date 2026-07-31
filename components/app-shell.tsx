'use client'

import React from 'react'
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
  // Componenta Home landing hero stă full-screen în spatele navbar-ului transparent.
  // Orice altă vizualizare are nevoie de pt-16 pentru a evita suprapunerea cu navbar-ul fixed (4rem).
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