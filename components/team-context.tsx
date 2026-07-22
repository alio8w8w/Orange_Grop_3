'use client'

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { teamMembers, type TeamMember } from '@/lib/team-data'

export type ViewKey = 'home' | 'skills' | 'portfolio'

interface TeamContextValue {
  members: TeamMember[]
  /** The currently selected member, or null when no one is chosen on Home. */
  activeMember: TeamMember | null
  activeMemberId: string | null
  setActiveMemberId: (id: string | null) => void
  view: ViewKey
  setView: (view: ViewKey) => void
}

const TeamContext = createContext<TeamContextValue | null>(null)

export function TeamProvider({ children }: { children: ReactNode }) {
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null)
  const [view, setView] = useState<ViewKey>('home')

  const value = useMemo<TeamContextValue>(() => {
    const activeMember =
      teamMembers.find((m) => m.id === activeMemberId) ?? null
    return {
      members: teamMembers,
      activeMember,
      activeMemberId,
      setActiveMemberId,
      view,
      setView,
    }
  }, [activeMemberId, view])

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>
}

export function useTeam() {
  const ctx = useContext(TeamContext)
  if (!ctx) {
    throw new Error('useTeam must be used within a TeamProvider')
  }
  return ctx
}
