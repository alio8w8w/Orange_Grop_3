'use client'

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { supabase } from '@/lib/supabase/client'

export type ViewKey =
  | 'home'
  | 'skills'
  | 'portfolio'
  | 'studies'
  | 'experience'
  | 'competences'
  | 'social'

export interface TeamMember {
  id: string
  nume?: string
  prenume?: string
  poza_url?: string
  functie?: string
  role?: string
  [key: string]: any
}

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
  const [members, setMembers] = useState<TeamMember[]>([])
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null)
  const [view, setView] = useState<ViewKey>('home')

  // Preluarea datelor din tabelul `cvs` din Supabase folosind clientul tău din `@/lib/supabase/client`
  useEffect(() => {
    async function fetchTeamMembers() {
      const { data, error } = await supabase.from('cvs').select('*')
      if (data) {
        setMembers(data)
      } else if (error) {
        console.error('Eroare la preluarea membrilor:', error.message)
      }
    }

    fetchTeamMembers()
  }, [])

  const value = useMemo<TeamContextValue>(() => {
    const activeMember =
      members.find((m) => m.id === activeMemberId) ?? null
    return {
      members,
      activeMember,
      activeMemberId,
      setActiveMemberId,
      view,
      setView,
    }
  }, [members, activeMemberId, view])

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>
}

export function useTeam() {
  const ctx = useContext(TeamContext)
  if (!ctx) {
    throw new Error('useTeam must be used within a TeamProvider')
  }
  return ctx
}